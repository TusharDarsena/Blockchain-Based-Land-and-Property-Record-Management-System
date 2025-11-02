#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_initialize() {
    let env = Env::default();
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    let name = String::from_str(&env, "Inspector 1");
    let designation = String::from_str(&env, "Tehsil Manager");
    
    client.initialize(&inspector, &name, &45, &designation);
    
    assert_eq!(client.get_lands_count(), 0);
    assert_eq!(client.get_sellers_count(), 0);
    assert_eq!(client.get_buyers_count(), 0);
    assert_eq!(client.get_requests_count(), 0);
    assert!(client.is_land_inspector(&inspector));
}

#[test]
fn test_register_seller() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    let seller = Address::generate(&env);
    client.register_seller(
        &seller,
        &String::from_str(&env, "Vrinda"),
        &20,
        &String::from_str(&env, "abc"),
        &String::from_str(&env, "xyz"),
        &String::from_str(&env, "many"),
        &String::from_str(&env, "QmYdztkcPJLmGmwLmM4nyBfVatoBMRDuUjmgBupjmTodAP")
    );
    
    assert_eq!(client.get_sellers_count(), 1);
    
    let seller_data = client.get_seller(&seller);
    assert_eq!(seller_data.name, String::from_str(&env, "Vrinda"));
    assert_eq!(seller_data.age, 20);
    assert_eq!(seller_data.verified, false);
}

#[test]
fn test_register_buyer() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    let buyer = Address::generate(&env);
    client.register_buyer(
        &buyer,
        &String::from_str(&env, "Vrinda"),
        &20,
        &String::from_str(&env, "akola"),
        &String::from_str(&env, "aadhar123456"),
        &String::from_str(&env, "pan1234567"),
        &String::from_str(&env, "QmYdztkcPJLmGmwLmM4nyBfVatoBMRDuUjmgBupjmTodAP"),
        &String::from_str(&env, "vvahuja2000@gmail.com")
    );
    
    assert_eq!(client.get_buyers_count(), 1);
    
    let buyer_data = client.get_buyer(&buyer);
    assert_eq!(buyer_data.name, String::from_str(&env, "Vrinda"));
    assert_eq!(buyer_data.age, 20);
    assert_eq!(buyer_data.verified, false);
}

#[test]
fn test_verify_seller() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    let seller = Address::generate(&env);
    client.register_seller(
        &seller,
        &String::from_str(&env, "Vrinda"),
        &20,
        &String::from_str(&env, "abc"),
        &String::from_str(&env, "xyz"),
        &String::from_str(&env, "many"),
        &String::from_str(&env, "QmYdztkcPJLmGmwLmM4nyBfVatoBMRDuUjmgBupjmTodAP")
    );
    
    client.verify_seller(&inspector, &seller);
    
    let seller_data = client.get_seller(&seller);
    assert!(seller_data.verified);
    assert!(!seller_data.rejected);
}

#[test]
fn test_verify_buyer() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    let buyer = Address::generate(&env);
    client.register_buyer(
        &buyer,
        &String::from_str(&env, "Vrinda"),
        &20,
        &String::from_str(&env, "akola"),
        &String::from_str(&env, "aadhar123456"),
        &String::from_str(&env, "pan1234567"),
        &String::from_str(&env, "QmYdztkcPJLmGmwLmM4nyBfVatoBMRDuUjmgBupjmTodAP"),
        &String::from_str(&env, "vvahuja2000@gmail.com")
    );
    
    client.verify_buyer(&inspector, &buyer);
    
    let buyer_data = client.get_buyer(&buyer);
    assert!(buyer_data.verified);
    assert!(!buyer_data.rejected);
}

#[test]
fn test_add_land() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    let seller = Address::generate(&env);
    client.register_seller(
        &seller,
        &String::from_str(&env, "Vrinda"),
        &20,
        &String::from_str(&env, "abc"),
        &String::from_str(&env, "xyz"),
        &String::from_str(&env, "many"),
        &String::from_str(&env, "QmYdztkcPJLmGmwLmM4nyBfVatoBMRDuUjmgBupjmTodAP")
    );
    
    client.verify_seller(&inspector, &seller);
    
    client.add_land(
        &seller,
        &500,
        &String::from_str(&env, "Akola"),
        &String::from_str(&env, "Maharashtra"),
        &20000,
        &567,
        &1890,
        &String::from_str(&env, "QmYdztkcPJLmGmwLmM4nyBfVatoBMRDuUjmgBupjmTodAP"),
        &String::from_str(&env, "QmYdztkcPJLmGmwLmM4nyBfVatoBMRDuUjmgBupjmTodAP")
    );
    
    assert_eq!(client.get_lands_count(), 1);
    
    let land = client.get_land(&1);
    assert_eq!(land.area, 500);
    assert_eq!(land.city, String::from_str(&env, "Akola"));
    assert_eq!(land.land_price, 20000);
    assert_eq!(land.is_fractional, false);
    
    let owner = client.get_land_owner(&1);
    assert_eq!(owner, seller);
}

#[test]
fn test_add_fractional_land() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    let seller = Address::generate(&env);
    client.register_seller(
        &seller,
        &String::from_str(&env, "Seller"),
        &30,
        &String::from_str(&env, "abc"),
        &String::from_str(&env, "xyz"),
        &String::from_str(&env, "many"),
        &String::from_str(&env, "QmHash")
    );
    client.verify_seller(&inspector, &seller);
    
    // Add fractional land with 10 fractions
    client.add_fractional_land(
        &seller,
        &5000,
        &String::from_str(&env, "Mumbai"),
        &String::from_str(&env, "Maharashtra"),
        &1000000,
        &123,
        &456,
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "QmHash"),
        &10
    );
    
    assert_eq!(client.get_lands_count(), 1);
    
    let land = client.get_land(&1);
    assert_eq!(land.is_fractional, true);
    assert_eq!(land.total_fractions, 10);
    assert_eq!(land.fractions_sold, 0);
    assert_eq!(land.price_per_fraction, 100000);
    assert_eq!(client.get_available_fractions(&1), 10);
}

#[test]
fn test_request_fractional_land() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    let seller = Address::generate(&env);
    client.register_seller(
        &seller,
        &String::from_str(&env, "Seller"),
        &30,
        &String::from_str(&env, "abc"),
        &String::from_str(&env, "xyz"),
        &String::from_str(&env, "many"),
        &String::from_str(&env, "QmHash")
    );
    client.verify_seller(&inspector, &seller);
    
    client.add_fractional_land(
        &seller,
        &5000,
        &String::from_str(&env, "Mumbai"),
        &String::from_str(&env, "Maharashtra"),
        &1000000,
        &123,
        &456,
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "QmHash"),
        &10
    );
    
    let buyer = Address::generate(&env);
    client.register_buyer(
        &buyer,
        &String::from_str(&env, "Buyer1"),
        &25,
        &String::from_str(&env, "Delhi"),
        &String::from_str(&env, "aadhar"),
        &String::from_str(&env, "pan"),
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "buyer1@email.com")
    );
    client.verify_buyer(&inspector, &buyer);
    
    client.request_fractional_land(&buyer, &seller, &1);
    
    assert_eq!(client.get_requests_count(), 1);
    
    let request = client.get_request(&1);
    assert_eq!(request.is_fractional_purchase, true);
    assert_eq!(request.fraction_id, Some(1));
}

#[test]
fn test_multiple_buyers_fractional_land() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    let seller = Address::generate(&env);
    client.register_seller(
        &seller,
        &String::from_str(&env, "Seller"),
        &30,
        &String::from_str(&env, "abc"),
        &String::from_str(&env, "xyz"),
        &String::from_str(&env, "many"),
        &String::from_str(&env, "QmHash")
    );
    client.verify_seller(&inspector, &seller);
    
    // Add fractional land with 10 fractions
    client.add_fractional_land(
        &seller,
        &5000,
        &String::from_str(&env, "Mumbai"),
        &String::from_str(&env, "Maharashtra"),
        &1000000,
        &123,
        &456,
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "QmHash"),
        &10
    );
    
    // Create and verify 10 different buyers
    let mut buyers = Vec::new(&env);
    for i in 0..10 {
        let buyer = Address::generate(&env);
        let name = String::from_str(&env, "Buyer");
        client.register_buyer(
            &buyer,
            &name,
            &25,
            &String::from_str(&env, "City"),
            &String::from_str(&env, "aadhar"),
            &String::from_str(&env, "pan"),
            &String::from_str(&env, "QmHash"),
            &String::from_str(&env, "buyer@email.com")
        );
        client.verify_buyer(&inspector, &buyer);
        buyers.push_back(buyer);
    }
    
    // Each buyer requests, gets approved, and pays for a fraction
    for i in 0..10 {
        let buyer = buyers.get(i).unwrap();
        
        client.request_fractional_land(&buyer, &seller, &1);
        let req_id = i + 1;
        client.approve_request(&seller, &req_id);
        client.payment(&buyer, &req_id);
        
        // Verify fractional ownership
        let land = client.get_land(&1);
        assert_eq!(land.fractions_sold, i + 1);
    }
    
    // Verify all 10 buyers own fractions
    let land = client.get_land(&1);
    assert_eq!(land.fractions_sold, 10);
    assert_eq!(client.get_available_fractions(&1), 0);
    
    let owners = client.get_land_fraction_owners(&1);
    assert_eq!(owners.len(), 10);
    
    // Check individual fractional ownership
    for i in 0..10 {
        let fraction = client.get_fractional_ownership(&1, &(i + 1));
        assert_eq!(fraction.land_id, 1);
        assert_eq!(fraction.fraction_percentage, 10);
    }
}

#[test]
fn test_request_land() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    let seller = Address::generate(&env);
    client.register_seller(
        &seller,
        &String::from_str(&env, "Seller"),
        &30,
        &String::from_str(&env, "abc"),
        &String::from_str(&env, "xyz"),
        &String::from_str(&env, "many"),
        &String::from_str(&env, "QmHash")
    );
    client.verify_seller(&inspector, &seller);
    
    client.add_land(
        &seller,
        &500,
        &String::from_str(&env, "Akola"),
        &String::from_str(&env, "Maharashtra"),
        &20000,
        &567,
        &1890,
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "QmHash")
    );
    
    let buyer = Address::generate(&env);
    client.register_buyer(
        &buyer,
        &String::from_str(&env, "Buyer"),
        &25,
        &String::from_str(&env, "Mumbai"),
        &String::from_str(&env, "aadhar"),
        &String::from_str(&env, "pan"),
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "buyer@email.com")
    );
    client.verify_buyer(&inspector, &buyer);
    
    client.request_land(&buyer, &seller, &1);
    
    assert_eq!(client.get_requests_count(), 1);
    
    let request = client.get_request(&1);
    assert_eq!(request.seller_id, seller);
    assert_eq!(request.buyer_id, buyer);
    assert_eq!(request.land_id, 1);
    assert!(!request.approved);
    assert_eq!(request.is_fractional_purchase, false);
}

#[test]
fn test_approve_request() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    let seller = Address::generate(&env);
    client.register_seller(
        &seller,
        &String::from_str(&env, "Seller"),
        &30,
        &String::from_str(&env, "abc"),
        &String::from_str(&env, "xyz"),
        &String::from_str(&env, "many"),
        &String::from_str(&env, "QmHash")
    );
    client.verify_seller(&inspector, &seller);
    
    client.add_land(
        &seller,
        &500,
        &String::from_str(&env, "Akola"),
        &String::from_str(&env, "Maharashtra"),
        &20000,
        &567,
        &1890,
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "QmHash")
    );
    
    let buyer = Address::generate(&env);
    client.register_buyer(
        &buyer,
        &String::from_str(&env, "Buyer"),
        &25,
        &String::from_str(&env, "Mumbai"),
        &String::from_str(&env, "aadhar"),
        &String::from_str(&env, "pan"),
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "buyer@email.com")
    );
    client.verify_buyer(&inspector, &buyer);
    
    client.request_land(&buyer, &seller, &1);
    client.approve_request(&seller, &1);
    
    let request = client.get_request(&1);
    assert!(request.approved);
}

#[test]
fn test_payment() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    let seller = Address::generate(&env);
    client.register_seller(
        &seller,
        &String::from_str(&env, "Seller"),
        &30,
        &String::from_str(&env, "abc"),
        &String::from_str(&env, "xyz"),
        &String::from_str(&env, "many"),
        &String::from_str(&env, "QmHash")
    );
    client.verify_seller(&inspector, &seller);
    
    client.add_land(
        &seller,
        &500,
        &String::from_str(&env, "Akola"),
        &String::from_str(&env, "Maharashtra"),
        &20000,
        &567,
        &1890,
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "QmHash")
    );
    
    let buyer = Address::generate(&env);
    client.register_buyer(
        &buyer,
        &String::from_str(&env, "Buyer"),
        &25,
        &String::from_str(&env, "Mumbai"),
        &String::from_str(&env, "aadhar"),
        &String::from_str(&env, "pan"),
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "buyer@email.com")
    );
    client.verify_buyer(&inspector, &buyer);
    
    client.request_land(&buyer, &seller, &1);
    client.approve_request(&seller, &1);
    client.payment(&buyer, &1);
    
    let request = client.get_request(&1);
    assert!(request.payment_received);
}

#[test]
fn test_transfer_ownership() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    let seller = Address::generate(&env);
    client.register_seller(
        &seller,
        &String::from_str(&env, "Seller"),
        &30,
        &String::from_str(&env, "abc"),
        &String::from_str(&env, "xyz"),
        &String::from_str(&env, "many"),
        &String::from_str(&env, "QmHash")
    );
    client.verify_seller(&inspector, &seller);
    
    client.add_land(
        &seller,
        &500,
        &String::from_str(&env, "Akola"),
        &String::from_str(&env, "Maharashtra"),
        &20000,
        &567,
        &1890,
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "QmHash")
    );
    
    let buyer = Address::generate(&env);
    client.register_buyer(
        &buyer,
        &String::from_str(&env, "Buyer"),
        &25,
        &String::from_str(&env, "Mumbai"),
        &String::from_str(&env, "aadhar"),
        &String::from_str(&env, "pan"),
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "buyer@email.com")
    );
    client.verify_buyer(&inspector, &buyer);
    
    client.request_land(&buyer, &seller, &1);
    client.approve_request(&seller, &1);
    client.payment(&buyer, &1);
    
    client.transfer_ownership(&inspector, &1, &buyer);
    
    let new_owner = client.get_land_owner(&1);
    assert_eq!(new_owner, buyer);
}

#[test]
fn test_update_seller() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    let seller = Address::generate(&env);
    client.register_seller(
        &seller,
        &String::from_str(&env, "Vrinda"),
        &20,
        &String::from_str(&env, "abc"),
        &String::from_str(&env, "xyz"),
        &String::from_str(&env, "many"),
        &String::from_str(&env, "QmHash")
    );
    
    client.verify_seller(&inspector, &seller);
    
    client.update_seller(
        &seller,
        &String::from_str(&env, "Vrinda Ahuja"),
        &21,
        &String::from_str(&env, "aadhar123456"),
        &String::from_str(&env, "pannumber"),
        &String::from_str(&env, "ten")
    );
    
    let seller_data = client.get_seller(&seller);
    assert_eq!(seller_data.name, String::from_str(&env, "Vrinda Ahuja"));
    assert_eq!(seller_data.age, 21);
    assert_eq!(client.get_sellers_count(), 1);
}

#[test]
fn test_verify_land() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    let seller = Address::generate(&env);
    client.register_seller(
        &seller,
        &String::from_str(&env, "Seller"),
        &30,
        &String::from_str(&env, "abc"),
        &String::from_str(&env, "xyz"),
        &String::from_str(&env, "many"),
        &String::from_str(&env, "QmHash")
    );
    client.verify_seller(&inspector, &seller);
    
    client.add_land(
        &seller,
        &500,
        &String::from_str(&env, "Akola"),
        &String::from_str(&env, "Maharashtra"),
        &20000,
        &567,
        &1890,
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "QmHash")
    );
    
    client.verify_land(&inspector, &1);
    
    assert!(client.is_land_verified(&1));
}

#[test]
fn test_get_user_fractional_lands() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    let seller = Address::generate(&env);
    client.register_seller(
        &seller,
        &String::from_str(&env, "Seller"),
        &30,
        &String::from_str(&env, "abc"),
        &String::from_str(&env, "xyz"),
        &String::from_str(&env, "many"),
        &String::from_str(&env, "QmHash")
    );
    client.verify_seller(&inspector, &seller);
    
    client.add_fractional_land(
        &seller,
        &5000,
        &String::from_str(&env, "Mumbai"),
        &String::from_str(&env, "Maharashtra"),
        &1000000,
        &123,
        &456,
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "QmHash"),
        &10
    );
    
    let buyer = Address::generate(&env);
    client.register_buyer(
        &buyer,
        &String::from_str(&env, "Buyer"),
        &25,
        &String::from_str(&env, "Delhi"),
        &String::from_str(&env, "aadhar"),
        &String::from_str(&env, "pan"),
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "buyer@email.com")
    );
    client.verify_buyer(&inspector, &buyer);
    
    client.request_fractional_land(&buyer, &seller, &1);
    client.approve_request(&seller, &1);
    client.payment(&buyer, &1);
    
    let user_lands = client.get_user_fractional_lands(&buyer);
    assert_eq!(user_lands.len(), 1);
    assert_eq!(user_lands.get(0).unwrap(), 1);
}

#[test]
#[should_panic(expected = "Contract already initialized")]
fn test_double_initialization() {
    let env = Env::default();
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    // Should panic
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 2"),
        &50,
        &String::from_str(&env, "Manager")
    );
}

#[test]
#[should_panic(expected = "Address already registered")]
fn test_double_registration() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    let seller = Address::generate(&env);
    client.register_seller(
        &seller,
        &String::from_str(&env, "Seller"),
        &30,
        &String::from_str(&env, "abc"),
        &String::from_str(&env, "xyz"),
        &String::from_str(&env, "many"),
        &String::from_str(&env, "QmHash")
    );
    
    // Should panic
    client.register_seller(
        &seller,
        &String::from_str(&env, "Seller 2"),
        &35,
        &String::from_str(&env, "def"),
        &String::from_str(&env, "uvw"),
        &String::from_str(&env, "some"),
        &String::from_str(&env, "QmHash2")
    );
}

#[test]
#[should_panic(expected = "All fractions have been sold")]
fn test_fractional_land_sold_out() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    let seller = Address::generate(&env);
    client.register_seller(
        &seller,
        &String::from_str(&env, "Seller"),
        &30,
        &String::from_str(&env, "abc"),
        &String::from_str(&env, "xyz"),
        &String::from_str(&env, "many"),
        &String::from_str(&env, "QmHash")
    );
    client.verify_seller(&inspector, &seller);
    
    // Add fractional land with only 2 fractions
    client.add_fractional_land(
        &seller,
        &1000,
        &String::from_str(&env, "City"),
        &String::from_str(&env, "State"),
        &100000,
        &123,
        &456,
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "QmHash"),
        &2
    );
    
    // Create 3 buyers
    let buyer1 = Address::generate(&env);
    client.register_buyer(
        &buyer1,
        &String::from_str(&env, "Buyer1"),
        &25,
        &String::from_str(&env, "City"),
        &String::from_str(&env, "aadhar"),
        &String::from_str(&env, "pan"),
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "buyer1@email.com")
    );
    client.verify_buyer(&inspector, &buyer1);
    
    let buyer2 = Address::generate(&env);
    client.register_buyer(
        &buyer2,
        &String::from_str(&env, "Buyer2"),
        &25,
        &String::from_str(&env, "City"),
        &String::from_str(&env, "aadhar"),
        &String::from_str(&env, "pan"),
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "buyer2@email.com")
    );
    client.verify_buyer(&inspector, &buyer2);
    
    let buyer3 = Address::generate(&env);
    client.register_buyer(
        &buyer3,
        &String::from_str(&env, "Buyer3"),
        &25,
        &String::from_str(&env, "City"),
        &String::from_str(&env, "aadhar"),
        &String::from_str(&env, "pan"),
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "buyer3@email.com")
    );
    client.verify_buyer(&inspector, &buyer3);
    
    // First two buyers purchase successfully
    client.request_fractional_land(&buyer1, &seller, &1);
    client.approve_request(&seller, &1);
    client.payment(&buyer1, &1);
    
    client.request_fractional_land(&buyer2, &seller, &1);
    client.approve_request(&seller, &2);
    client.payment(&buyer2, &2);
    
    // Third buyer tries to purchase - should panic
    client.request_fractional_land(&buyer3, &seller, &1);
}

#[test]
#[should_panic(expected = "Buyer already owns a fraction of this land")]
fn test_buyer_cannot_buy_twice() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    let seller = Address::generate(&env);
    client.register_seller(
        &seller,
        &String::from_str(&env, "Seller"),
        &30,
        &String::from_str(&env, "abc"),
        &String::from_str(&env, "xyz"),
        &String::from_str(&env, "many"),
        &String::from_str(&env, "QmHash")
    );
    client.verify_seller(&inspector, &seller);
    
    client.add_fractional_land(
        &seller,
        &1000,
        &String::from_str(&env, "City"),
        &String::from_str(&env, "State"),
        &100000,
        &123,
        &456,
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "QmHash"),
        &5
    );
    
    let buyer = Address::generate(&env);
    client.register_buyer(
        &buyer,
        &String::from_str(&env, "Buyer"),
        &25,
        &String::from_str(&env, "City"),
        &String::from_str(&env, "aadhar"),
        &String::from_str(&env, "pan"),
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "buyer@email.com")
    );
    client.verify_buyer(&inspector, &buyer);
    
    // First purchase
    client.request_fractional_land(&buyer, &seller, &1);
    client.approve_request(&seller, &1);
    client.payment(&buyer, &1);
    
    // Second purchase attempt - should panic
    client.request_fractional_land(&buyer, &seller, &1);
}

#[test]
#[should_panic(expected = "This is fractional land, use request_fractional_land instead")]
fn test_wrong_request_method_for_fractional_land() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    let seller = Address::generate(&env);
    client.register_seller(
        &seller,
        &String::from_str(&env, "Seller"),
        &30,
        &String::from_str(&env, "abc"),
        &String::from_str(&env, "xyz"),
        &String::from_str(&env, "many"),
        &String::from_str(&env, "QmHash")
    );
    client.verify_seller(&inspector, &seller);
    
    client.add_fractional_land(
        &seller,
        &1000,
        &String::from_str(&env, "City"),
        &String::from_str(&env, "State"),
        &100000,
        &123,
        &456,
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "QmHash"),
        &10
    );
    
    let buyer = Address::generate(&env);
    client.register_buyer(
        &buyer,
        &String::from_str(&env, "Buyer"),
        &25,
        &String::from_str(&env, "City"),
        &String::from_str(&env, "aadhar"),
        &String::from_str(&env, "pan"),
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "buyer@email.com")
    );
    client.verify_buyer(&inspector, &buyer);
    
    // Using wrong method - should panic
    client.request_land(&buyer, &seller, &1);
}

#[test]
#[should_panic(expected = "Cannot transfer ownership of fractional land")]
fn test_cannot_transfer_fractional_land() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, LandRegistryContract);
    let client = LandRegistryContractClient::new(&env, &contract_id);
    
    let inspector = Address::generate(&env);
    client.initialize(
        &inspector,
        &String::from_str(&env, "Inspector 1"),
        &45,
        &String::from_str(&env, "Tehsil Manager")
    );
    
    let seller = Address::generate(&env);
    client.register_seller(
        &seller,
        &String::from_str(&env, "Seller"),
        &30,
        &String::from_str(&env, "abc"),
        &String::from_str(&env, "xyz"),
        &String::from_str(&env, "many"),
        &String::from_str(&env, "QmHash")
    );
    client.verify_seller(&inspector, &seller);
    
    client.add_fractional_land(
        &seller,
        &1000,
        &String::from_str(&env, "City"),
        &String::from_str(&env, "State"),
        &100000,
        &123,
        &456,
        &String::from_str(&env, "QmHash"),
        &String::from_str(&env, "QmHash"),
        &10
    );
    
    let buyer = Address::generate(&env);
    
    // Should panic - cannot transfer fractional land
    client.transfer_ownership(&inspector, &1, &buyer);
}