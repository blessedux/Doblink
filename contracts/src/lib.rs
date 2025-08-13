#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol, Vec};

#[contract]
pub struct DobLinkContract;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Investment {
    pub investor: Address,
    pub amount: i128,
    pub token_id: Symbol,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct TokenInfo {
    pub symbol: Symbol,
    pub name: Symbol,
    pub total_supply: i128,
    pub decimals: u32,
}

#[contractimpl]
impl DobLinkContract {
    // Initialize the contract
    pub fn init(env: &Env, admin: Address) {
        env.storage().instance().set(&symbol_short!("admin"), &admin);
    }

    // Accept USDC investment
    pub fn invest(env: &Env, investor: Address, amount: i128, token_id: Symbol) -> Result<(), Error> {
        // Validate amount
        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        // Create investment record
        let investment = Investment {
            investor: investor.clone(),
            amount,
            token_id: token_id.clone(),
            timestamp: env.ledger().timestamp(),
        };

        // Store investment
        let mut investments: Vec<Investment> = env.storage().instance().get(&symbol_short!("investments")).unwrap_or(Vec::new(&env));
        investments.push_back(investment);
        env.storage().instance().set(&symbol_short!("investments"), &investments);

        // Emit investment event
        env.events().publish((symbol_short!("investment"),), (investor, amount, token_id));

        Ok(())
    }

    // Get investment by investor
    pub fn get_investment(env: &Env, investor: Address) -> Result<Vec<Investment>, Error> {
        let investments: Vec<Investment> = env.storage().instance().get(&symbol_short!("investments")).unwrap_or(Vec::new(&env));
        
        let mut user_investments = Vec::new(&env);
        for investment in investments.iter() {
            if investment.investor == investor {
                user_investments.push_back(investment);
            }
        }
        
        Ok(user_investments)
    }

    // Get all investments
    pub fn get_all_investments(env: &Env) -> Result<Vec<Investment>, Error> {
        let investments: Vec<Investment> = env.storage().instance().get(&symbol_short!("investments")).unwrap_or(Vec::new(&env));
        Ok(investments)
    }

    // Register token info
    pub fn register_token(env: &Env, token_info: TokenInfo) -> Result<(), Error> {
        // Check if caller is admin
        let admin: Address = env.storage().instance().get(&symbol_short!("admin")).unwrap();
        let caller = env.current_contract_address();
        
        if caller != admin {
            return Err(Error::NotAuthorized);
        }

        env.storage().instance().set(&symbol_short!("token_info"), &token_info);
        Ok(())
    }

    // Get token info
    pub fn get_token_info(env: &Env) -> Result<TokenInfo, Error> {
        let token_info: TokenInfo = env.storage().instance().get(&symbol_short!("token_info")).unwrap_or(TokenInfo {
            symbol: symbol_short!("DOB"),
            name: symbol_short!("DOB Token"),
            total_supply: 0,
            decimals: 7,
        });
        Ok(token_info)
    }
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Error {
    InvalidAmount,
    NotAuthorized,
    TokenNotFound,
}

impl From<Error> for soroban_sdk::Error {
    fn from(err: Error) -> Self {
        match err {
            Error::InvalidAmount => soroban_sdk::Error::from_type_and_code(1, 1),
            Error::NotAuthorized => soroban_sdk::Error::from_type_and_code(1, 2),
            Error::TokenNotFound => soroban_sdk::Error::from_type_and_code(1, 3),
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::{Address as _, Ledger};

    #[test]
    fn test_init() {
        let env = Env::default();
        let admin = Address::generate(&env);
        
        let contract_id = env.register_contract(None, DobLinkContract);
        let client = DobLinkContractClient::new(&env, &contract_id);
        
        client.init(&admin);
        
        let stored_admin: Address = env.storage().instance().get(&symbol_short!("admin")).unwrap();
        assert_eq!(stored_admin, admin);
    }

    #[test]
    fn test_invest() {
        let env = Env::default();
        let admin = Address::generate(&env);
        let investor = Address::generate(&env);
        
        let contract_id = env.register_contract(None, DobLinkContract);
        let client = DobLinkContractClient::new(&env, &contract_id);
        
        client.init(&admin);
        
        // Test investment
        let result = client.invest(&investor, &1000, &symbol_short!("USDC"));
        assert!(result.is_ok());
        
        // Get investments
        let investments = client.get_investment(&investor).unwrap();
        assert_eq!(investments.len(), 1);
        assert_eq!(investments.get(0).unwrap().amount, 1000);
    }

    #[test]
    fn test_invalid_amount() {
        let env = Env::default();
        let admin = Address::generate(&env);
        let investor = Address::generate(&env);
        
        let contract_id = env.register_contract(None, DobLinkContract);
        let client = DobLinkContractClient::new(&env, &contract_id);
        
        client.init(&admin);
        
        // Test invalid amount
        let result = client.invest(&investor, &0, &symbol_short!("USDC"));
        assert!(result.is_err());
    }
}
