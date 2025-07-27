#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, vec, Address, Env, Map, String, Vec, Error,
};
use soroban_sdk::xdr::{ScErrorType, ScErrorCode};

#[contract]
pub struct DobLinkContract;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Investment {
    pub buyer: Address,
    pub token_id: String,
    pub amount: i128,
    pub timestamp: u64,
    pub status: String, // "pending", "completed", "failed"
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct TokenInfo {
    pub id: String,
    pub name: String,
    pub apy: i128, // APY in basis points (e.g., 1250 = 12.5%)
    pub total_value_locked: i128,
    pub min_investment: i128,
    pub max_investment: i128,
}

#[contractimpl]
impl DobLinkContract {
    // Initialize the contract with default token info
    pub fn init(env: Env, admin: Address) -> Result<(), Error> {
        let admin_key = symbol_short!("ADMIN");
        env.storage().instance().set(&admin_key, &admin);
        
        // Initialize default token info
        let default_token = TokenInfo {
            id: String::from_str(&env, "EVCHARGER001"),
            name: String::from_str(&env, "Electric Vehicle Charging Network"),
            apy: 1250, // 12.5%
            total_value_locked: 2400000000, // $2.4M in micro units
            min_investment: 10000000, // $10 in micro units
            max_investment: 100000000000, // $100K in micro units
        };
        
        let token_key = symbol_short!("TOKEN");
        env.storage().instance().set(&token_key, &default_token);
        
        Ok(())
    }

    // Get the admin address
    pub fn get_admin(env: Env) -> Result<Address, Error> {
        let admin_key = symbol_short!("ADMIN");
        env.storage().instance().get(&admin_key).ok_or(Error::from_type_and_code(ScErrorType::Auth, ScErrorCode::MissingValue))
    }

    // Update token information (admin only)
    pub fn update_token_info(
        env: Env,
        token_id: String,
        name: String,
        apy: i128,
        total_value_locked: i128,
        min_investment: i128,
        max_investment: i128,
    ) -> Result<(), Error> {
        let admin = Self::get_admin(env.clone())?;
        if env.current_contract_address() != admin {
            return Err(Error::from_type_and_code(ScErrorType::Auth, ScErrorCode::InvalidAction));
        }

        let token_info = TokenInfo {
            id: token_id,
            name,
            apy,
            total_value_locked,
            min_investment,
            max_investment,
        };

        let token_key = symbol_short!("TOKEN");
        env.storage().instance().set(&token_key, &token_info);
        
        Ok(())
    }

    // Get current token information
    pub fn get_token_info(env: Env) -> Result<TokenInfo, Error> {
        let token_key = symbol_short!("TOKEN");
        env.storage().instance().get(&token_key).ok_or(Error::from_type_and_code(ScErrorType::Storage, ScErrorCode::MissingValue))
    }

    // Create a new investment
    pub fn create_investment(
        env: Env,
        buyer: Address,
        token_id: String,
        amount: i128,
    ) -> Result<u32, Error> {
        // Validate amount
        let token_info = Self::get_token_info(env.clone())?;
        if amount < token_info.min_investment {
            return Err(Error::from_type_and_code(ScErrorType::Value, ScErrorCode::InvalidInput));
        }
        if amount > token_info.max_investment {
            return Err(Error::from_type_and_code(ScErrorType::Value, ScErrorCode::InvalidInput));
        }

        // Create investment record
        let investment = Investment {
            buyer: buyer.clone(),
            token_id: token_id.clone(),
            amount,
            timestamp: env.ledger().timestamp(),
            status: String::from_str(&env, "pending"),
        };

        // Store investment
        let investment_id = Self::get_next_investment_id(env.clone())?;
        let investment_key = symbol_short!("INV");
        let mut investments: Map<u32, Investment> = env.storage().instance().get(&investment_key).unwrap_or(Map::new(&env));
        investments.set(investment_id, investment);
        env.storage().instance().set(&investment_key, &investments);

        // Update investment counter
        let counter_key = symbol_short!("CNT");
        let next_id = investment_id + 1;
        env.storage().instance().set(&counter_key, &next_id);

        // Emit event
        env.events().publish(
            (symbol_short!("INVESTED"),),
            (investment_id, buyer, token_id, amount),
        );

        Ok(investment_id)
    }

    // Get investment by ID
    pub fn get_investment(env: Env, investment_id: u32) -> Result<Investment, Error> {
        let investment_key = symbol_short!("INV");
        let investments: Map<u32, Investment> = env.storage().instance().get(&investment_key).unwrap_or(Map::new(&env));
        investments.get(investment_id).ok_or(Error::from_type_and_code(ScErrorType::Storage, ScErrorCode::MissingValue))
    }

    // Get all investments for a buyer
    pub fn get_buyer_investments(env: Env, buyer: Address) -> Result<Vec<Investment>, Error> {
        let investment_key = symbol_short!("INV");
        let investments: Map<u32, Investment> = env.storage().instance().get(&investment_key).unwrap_or(Map::new(&env));
        
        let mut buyer_investments = vec![&env];
        for (_, investment) in investments.iter() {
            if investment.buyer == buyer {
                buyer_investments.push_back(investment);
            }
        }
        
        Ok(buyer_investments)
    }

    // Update investment status (admin only)
    pub fn update_investment_status(
        env: Env,
        investment_id: u32,
        status: String,
    ) -> Result<(), Error> {
        let admin = Self::get_admin(env.clone())?;
        if env.current_contract_address() != admin {
            return Err(Error::from_type_and_code(ScErrorType::Auth, ScErrorCode::InvalidAction));
        }

        let mut investment = Self::get_investment(env.clone(), investment_id)?;
        investment.status = status.clone();
        
        let investment_key = symbol_short!("INV");
        let mut investments: Map<u32, Investment> = env.storage().instance().get(&investment_key).unwrap_or(Map::new(&env));
        investments.set(investment_id, investment);
        env.storage().instance().set(&investment_key, &investments);

        // Emit event
        env.events().publish(
            (symbol_short!("INVSTAT"),),
            (investment_id, status),
        );

        Ok(())
    }

    // Get total investments for a token
    pub fn get_token_total_investments(env: Env, token_id: String) -> Result<i128, Error> {
        let investment_key = symbol_short!("INV");
        let investments: Map<u32, Investment> = env.storage().instance().get(&investment_key).unwrap_or(Map::new(&env));
        
        let mut total = 0i128;
        for (_, investment) in investments.iter() {
            if investment.token_id == token_id && investment.status == String::from_str(&env, "completed") {
                total += investment.amount;
            }
        }
        
        Ok(total)
    }

    // Helper function to get next investment ID
    fn get_next_investment_id(env: Env) -> Result<u32, Error> {
        let counter_key = symbol_short!("CNT");
        Ok(env.storage().instance().get(&counter_key).unwrap_or(1))
    }

    // Get contract statistics
    pub fn get_stats(env: Env) -> Result<Vec<i128>, Error> {
        let investment_key = symbol_short!("INV");
        let investments: Map<u32, Investment> = env.storage().instance().get(&investment_key).unwrap_or(Map::new(&env));
        
        let mut total_investments = 0i128;
        let mut total_amount = 0i128;
        let mut completed_investments = 0i128;
        
        for (_, investment) in investments.iter() {
            total_investments += 1;
            total_amount += investment.amount;
            if investment.status == String::from_str(&env, "completed") {
                completed_investments += 1;
            }
        }
        
        Ok(vec![&env, total_investments, total_amount, completed_investments])
    }
}

mod test;
