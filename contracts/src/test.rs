#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    Address, Env, Symbol,
};

#[test]
fn test_contract_initialization() {
    let env = Env::default();
    let admin = Address::generate(&env);
    
    let contract_id = env.register_contract(None, DobLinkContract);
    let client = DobLinkContractClient::new(&env, &contract_id);
    
    client.init(&admin);
    
    // Verify admin is set correctly
    let stored_admin: Address = env.storage().instance().get(&symbol_short!("admin")).unwrap();
    assert_eq!(stored_admin, admin);
}

#[test]
fn test_investment_functionality() {
    let env = Env::default();
    let admin = Address::generate(&env);
    let investor = Address::generate(&env);
    
    let contract_id = env.register_contract(None, DobLinkContract);
    let client = DobLinkContractClient::new(&env, &contract_id);
    
    client.init(&admin);
    
    // Test successful investment
    let result = client.invest(&investor, &1000, &symbol_short!("USDC"));
    assert!(result.is_ok());
    
    // Verify investment is stored
    let investments = client.get_investment(&investor).unwrap();
    assert_eq!(investments.len(), 1);
    
    let investment = investments.get(0).unwrap();
    assert_eq!(investment.investor, investor);
    assert_eq!(investment.amount, 1000);
    assert_eq!(investment.token_id, symbol_short!("USDC"));
}

#[test]
fn test_multiple_investments() {
    let env = Env::default();
    let admin = Address::generate(&env);
    let investor1 = Address::generate(&env);
    let investor2 = Address::generate(&env);
    
    let contract_id = env.register_contract(None, DobLinkContract);
    let client = DobLinkContractClient::new(&env, &contract_id);
    
    client.init(&admin);
    
    // Multiple investments from different investors
    client.invest(&investor1, &500, &symbol_short!("USDC")).unwrap();
    client.invest(&investor2, &750, &symbol_short!("USDC")).unwrap();
    client.invest(&investor1, &300, &symbol_short!("USDC")).unwrap();
    
    // Verify all investments
    let all_investments = client.get_all_investments().unwrap();
    assert_eq!(all_investments.len(), 3);
    
    let investor1_investments = client.get_investment(&investor1).unwrap();
    assert_eq!(investor1_investments.len(), 2);
    
    let investor2_investments = client.get_investment(&investor2).unwrap();
    assert_eq!(investor2_investments.len(), 1);
}

#[test]
fn test_invalid_investment_amount() {
    let env = Env::default();
    let admin = Address::generate(&env);
    let investor = Address::generate(&env);
    
    let contract_id = env.register_contract(None, DobLinkContract);
    let client = DobLinkContractClient::new(&env, &contract_id);
    
    client.init(&admin);
    
    // Test zero amount
    let result = client.invest(&investor, &0, &symbol_short!("USDC"));
    assert!(result.is_err());
    
    // Test negative amount
    let result = client.invest(&investor, &-100, &symbol_short!("USDC"));
    assert!(result.is_err());
}

#[test]
fn test_token_registration() {
    let env = Env::default();
    let admin = Address::generate(&env);
    
    let contract_id = env.register_contract(None, DobLinkContract);
    let client = DobLinkContractClient::new(&env, &contract_id);
    
    client.init(&admin);
    
    // Create token info
    let token_info = TokenInfo {
        symbol: symbol_short!("DOB"),
        name: symbol_short!("DOB Token"),
        total_supply: 1000000,
        decimals: 7,
    };
    
    // Register token (this would need admin privileges in real scenario)
    // For testing, we'll simulate the storage directly
    env.storage().instance().set(&symbol_short!("token_info"), &token_info);
    
    // Get token info
    let retrieved_token = client.get_token_info().unwrap();
    assert_eq!(retrieved_token.symbol, symbol_short!("DOB"));
    assert_eq!(retrieved_token.name, symbol_short!("DOB Token"));
    assert_eq!(retrieved_token.total_supply, 1000000);
    assert_eq!(retrieved_token.decimals, 7);
}

#[test]
fn test_default_token_info() {
    let env = Env::default();
    let admin = Address::generate(&env);
    
    let contract_id = env.register_contract(None, DobLinkContract);
    let client = DobLinkContractClient::new(&env, &contract_id);
    
    client.init(&admin);
    
    // Get default token info when none is set
    let token_info = client.get_token_info().unwrap();
    assert_eq!(token_info.symbol, symbol_short!("DOB"));
    assert_eq!(token_info.name, symbol_short!("DOB Token"));
    assert_eq!(token_info.total_supply, 0);
    assert_eq!(token_info.decimals, 7);
}

#[test]
fn test_empty_investments() {
    let env = Env::default();
    let admin = Address::generate(&env);
    let investor = Address::generate(&env);
    
    let contract_id = env.register_contract(None, DobLinkContract);
    let client = DobLinkContractClient::new(&env, &contract_id);
    
    client.init(&admin);
    
    // Test getting investments for investor with no investments
    let investments = client.get_investment(&investor).unwrap();
    assert_eq!(investments.len(), 0);
    
    // Test getting all investments when none exist
    let all_investments = client.get_all_investments().unwrap();
    assert_eq!(all_investments.len(), 0);
}

#[test]
fn test_timestamp_tracking() {
    let env = Env::default();
    let admin = Address::generate(&env);
    let investor = Address::generate(&env);
    
    let contract_id = env.register_contract(None, DobLinkContract);
    let client = DobLinkContractClient::new(&env, &contract_id);
    
    client.init(&admin);
    
    // Set a specific timestamp for testing
    env.ledger().set_timestamp(1234567890);
    
    client.invest(&investor, &1000, &symbol_short!("USDC")).unwrap();
    
    let investments = client.get_investment(&investor).unwrap();
    let investment = investments.get(0).unwrap();
    
    assert_eq!(investment.timestamp, 1234567890);
}
