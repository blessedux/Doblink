#![cfg(test)]

use super::*;
use soroban_sdk::{Address, Env, String, symbol_short};

#[test]
fn test_contract_initialization() {
    let env = Env::default();
    let contract_id = env.register_contract(None, DobLinkContract);
    let client = DobLinkContractClient::new(&env, &contract_id);
    
    // Create a test admin address
    let admin = Address::generate(&env);
    
    // Initialize the contract
    client.init(&admin);
    
    // Test that admin is set correctly
    let retrieved_admin = client.get_admin();
    assert_eq!(retrieved_admin, admin);
}

#[test]
fn test_token_info() {
    let env = Env::default();
    let contract_id = env.register_contract(None, DobLinkContract);
    let client = DobLinkContractClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    client.init(&admin);
    
    // Get default token info
    let token_info = client.get_token_info();
    assert_eq!(token_info.id, String::from_str(&env, "EVCHARGER001"));
    assert_eq!(token_info.name, String::from_str(&env, "Electric Vehicle Charging Network"));
    assert_eq!(token_info.apy, 1250); // 12.5%
    assert_eq!(token_info.total_value_locked, 2400000000); // $2.4M
}

#[test]
fn test_create_investment() {
    let env = Env::default();
    let contract_id = env.register_contract(None, DobLinkContract);
    let client = DobLinkContractClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let buyer = Address::generate(&env);
    
    client.init(&admin);
    
    // Create an investment
    let investment_amount = 50000000; // $50
    let token_id = String::from_str(&env, "EVCHARGER001");
    
    let investment_id = client.create_investment(&buyer, &token_id, &investment_amount);
    assert_eq!(investment_id, 1);
    
    // Get the investment
    let investment = client.get_investment(&investment_id);
    assert_eq!(investment.buyer, buyer);
    assert_eq!(investment.token_id, token_id);
    assert_eq!(investment.amount, investment_amount);
    assert_eq!(investment.status, String::from_str(&env, "pending"));
}

#[test]
fn test_investment_validation() {
    let env = Env::default();
    let contract_id = env.register_contract(None, DobLinkContract);
    let client = DobLinkContractClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let buyer = Address::generate(&env);
    
    client.init(&admin);
    
    let token_id = String::from_str(&env, "EVCHARGER001");
    
    // Test minimum investment validation
    let too_small_amount = 5000000; // $5 (below $10 minimum)
    let result = client.try_create_investment(&buyer, &token_id, &too_small_amount);
    assert!(result.is_err());
    
    // Test maximum investment validation
    let too_large_amount = 200000000000; // $200K (above $100K maximum)
    let result = client.try_create_investment(&buyer, &token_id, &too_large_amount);
    assert!(result.is_err());
}

#[test]
fn test_get_buyer_investments() {
    let env = Env::default();
    let contract_id = env.register_contract(None, DobLinkContract);
    let client = DobLinkContractClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let buyer = Address::generate(&env);
    
    client.init(&admin);
    
    let token_id = String::from_str(&env, "EVCHARGER001");
    
    // Create multiple investments
    client.create_investment(&buyer, &token_id, &50000000); // $50
    client.create_investment(&buyer, &token_id, &75000000); // $75
    
    // Get buyer investments
    let investments = client.get_buyer_investments(&buyer);
    assert_eq!(investments.len(), 2);
    assert_eq!(investments.get(0).unwrap().amount, 50000000);
    assert_eq!(investments.get(1).unwrap().amount, 75000000);
}

#[test]
fn test_update_investment_status() {
    let env = Env::default();
    let contract_id = env.register_contract(None, DobLinkContract);
    let client = DobLinkContractClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let buyer = Address::generate(&env);
    
    client.init(&admin);
    
    let token_id = String::from_str(&env, "EVCHARGER001");
    let investment_id = client.create_investment(&buyer, &token_id, &50000000);
    
    // Update status to completed
    client.update_investment_status(&investment_id, &String::from_str(&env, "completed"));
    
    let investment = client.get_investment(&investment_id);
    assert_eq!(investment.status, String::from_str(&env, "completed"));
}

#[test]
fn test_get_stats() {
    let env = Env::default();
    let contract_id = env.register_contract(None, DobLinkContract);
    let client = DobLinkContractClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let buyer1 = Address::generate(&env);
    let buyer2 = Address::generate(&env);
    
    client.init(&admin);
    
    let token_id = String::from_str(&env, "EVCHARGER001");
    
    // Create investments
    client.create_investment(&buyer1, &token_id, &50000000); // $50
    client.create_investment(&buyer2, &token_id, &75000000); // $75
    
    // Complete one investment
    client.update_investment_status(&1, &String::from_str(&env, "completed"));
    
    let stats = client.get_stats();
    assert_eq!(stats.len(), 3);
    assert_eq!(stats.get(0).unwrap(), 2); // total investments
    assert_eq!(stats.get(1).unwrap(), 125000000); // total amount ($125)
    assert_eq!(stats.get(2).unwrap(), 1); // completed investments
}
