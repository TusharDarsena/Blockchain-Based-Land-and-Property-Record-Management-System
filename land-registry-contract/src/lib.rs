#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, String, Vec
};

// Struct definitions
#[contracttype]
#[derive(Clone)]
pub struct LandReg {
    pub id: u32,
    pub area: u32,
    pub city: String,
    pub state: String,
    pub land_price: i128,
    pub property_pid: u32,
    pub physical_survey_number: u32,
    pub ipfs_hash: String,
    pub document: String,
    pub is_fractional: bool,
    pub total_fractions: u32,
    pub fractions_sold: u32,
    pub price_per_fraction: i128,
}

#[contracttype]
#[derive(Clone)]
pub struct FractionalOwnership {
    pub land_id: u32,
    pub owner: Address,
    pub fraction_id: u32,
    pub fraction_percentage: u32, // percentage of land owned (e.g., 10 for 10%)
    pub purchase_date: u64,
}

#[contracttype]
#[derive(Clone)]
pub struct Buyer {
    pub id: Address,
    pub name: String,
    pub age: u32,
    pub city: String,
    pub aadhar_number: String,
    pub pan_number: String,
    pub document: String,
    pub email: String,
    pub verified: bool,
    pub rejected: bool,
}

#[contracttype]
#[derive(Clone)]
pub struct Seller {
    pub id: Address,
    pub name: String,
    pub age: u32,
    pub aadhar_number: String,
    pub pan_number: String,
    pub lands_owned: String,
    pub document: String,
    pub verified: bool,
    pub rejected: bool,
}

#[contracttype]
#[derive(Clone)]
pub struct LandInspector {
    pub id: u32,
    pub name: String,
    pub age: u32,
    pub designation: String,
}

#[contracttype]
#[derive(Clone)]
pub struct LandRequest {
    pub req_id: u32,
    pub seller_id: Address,
    pub buyer_id: Address,
    pub land_id: u32,
    pub approved: bool,
    pub payment_received: bool,
    pub is_fractional_purchase: bool,
    pub fraction_id: Option<u32>,
}

// Storage keys
#[contracttype]
pub enum DataKey {
    LandInspector,
    InspectorCount,
    Land(u32),
    LandCount,
    Seller(Address),
    SellerCount,
    SellerList,
    Buyer(Address),
    BuyerCount,
    BuyerList,
    Request(u32),
    RequestCount,
    LandOwner(u32),
    LandVerified(u32),
    RegisteredAddress(Address),
    // New keys for fractional ownership
    FractionalOwnership(u32, u32), // (land_id, fraction_id)
    FractionalOwnershipCount(u32), // count per land
    LandFractionOwners(u32), // Vec<Address> for each land
    UserFractionalLands(Address), // Vec<u32> of land_ids user has fractions in
}

#[contract]
pub struct LandRegistryContract;

#[contractimpl]
impl LandRegistryContract {
    
    // Initialize contract with Land Inspector
    pub fn initialize(env: Env, inspector_address: Address, name: String, age: u32, designation: String) {
        if env.storage().instance().has(&DataKey::LandInspector) {
            panic!("Contract already initialized");
        }
        
        env.storage().instance().set(&DataKey::LandInspector, &inspector_address);
        env.storage().instance().set(&DataKey::InspectorCount, &1u32);
        
        let inspector = LandInspector {
            id: 1,
            name,
            age,
            designation,
        };
        
        env.storage().instance().set(&DataKey::InspectorCount, &inspector);
        env.storage().instance().set(&DataKey::LandCount, &0u32);
        env.storage().instance().set(&DataKey::SellerCount, &0u32);
        env.storage().instance().set(&DataKey::BuyerCount, &0u32);
        env.storage().instance().set(&DataKey::RequestCount, &0u32);
        env.storage().instance().set(&DataKey::SellerList, &Vec::<Address>::new(&env));
        env.storage().instance().set(&DataKey::BuyerList, &Vec::<Address>::new(&env));
    }

    pub fn is_land_inspector(env: Env, address: Address) -> bool {
        if let Some(inspector) = env.storage().instance().get::<_, Address>(&DataKey::LandInspector) {
            inspector == address
        } else {
            false
        }
    }

    // Register Seller
    pub fn register_seller(
        env: Env,
        caller: Address,
        name: String,
        age: u32,
        aadhar_number: String,
        pan_number: String,
        lands_owned: String,
        document: String,
    ) {
        caller.require_auth();
        
        if env.storage().instance().has(&DataKey::RegisteredAddress(caller.clone())) {
            panic!("Address already registered");
        }
        
        let seller = Seller {
            id: caller.clone(),
            name,
            age,
            aadhar_number,
            pan_number,
            lands_owned,
            document,
            verified: false,
            rejected: false,
        };
        
        env.storage().instance().set(&DataKey::Seller(caller.clone()), &seller);
        env.storage().instance().set(&DataKey::RegisteredAddress(caller.clone()), &true);
        
        let mut count: u32 = env.storage().instance().get(&DataKey::SellerCount).unwrap_or(0);
        count += 1;
        env.storage().instance().set(&DataKey::SellerCount, &count);
        
        let mut sellers: Vec<Address> = env.storage().instance()
            .get(&DataKey::SellerList)
            .unwrap_or(Vec::new(&env));
        sellers.push_back(caller);
        env.storage().instance().set(&DataKey::SellerList, &sellers);
    }

    pub fn update_seller(
        env: Env,
        caller: Address,
        name: String,
        age: u32,
        aadhar_number: String,
        pan_number: String,
        lands_owned: String,
    ) {
        caller.require_auth();
        
        let mut seller: Seller = env.storage().instance()
            .get(&DataKey::Seller(caller.clone()))
            .expect("Seller not registered");
        
        seller.name = name;
        seller.age = age;
        seller.aadhar_number = aadhar_number;
        seller.pan_number = pan_number;
        seller.lands_owned = lands_owned;
        
        env.storage().instance().set(&DataKey::Seller(caller), &seller);
    }

    // Register Buyer
    pub fn register_buyer(
        env: Env,
        caller: Address,
        name: String,
        age: u32,
        city: String,
        aadhar_number: String,
        pan_number: String,
        document: String,
        email: String,
    ) {
        caller.require_auth();
        
        if env.storage().instance().has(&DataKey::RegisteredAddress(caller.clone())) {
            panic!("Address already registered");
        }
        
        let buyer = Buyer {
            id: caller.clone(),
            name,
            age,
            city,
            aadhar_number,
            pan_number,
            document,
            email,
            verified: false,
            rejected: false,
        };
        
        env.storage().instance().set(&DataKey::Buyer(caller.clone()), &buyer);
        env.storage().instance().set(&DataKey::RegisteredAddress(caller.clone()), &true);
        
        let mut count: u32 = env.storage().instance().get(&DataKey::BuyerCount).unwrap_or(0);
        count += 1;
        env.storage().instance().set(&DataKey::BuyerCount, &count);
        
        let mut buyers: Vec<Address> = env.storage().instance()
            .get(&DataKey::BuyerList)
            .unwrap_or(Vec::new(&env));
        buyers.push_back(caller);
        env.storage().instance().set(&DataKey::BuyerList, &buyers);
    }

    pub fn update_buyer(
        env: Env,
        caller: Address,
        name: String,
        age: u32,
        city: String,
        aadhar_number: String,
        pan_number: String,
        email: String,
    ) {
        caller.require_auth();
        
        let mut buyer: Buyer = env.storage().instance()
            .get(&DataKey::Buyer(caller.clone()))
            .expect("Buyer not registered");
        
        buyer.name = name;
        buyer.age = age;
        buyer.city = city;
        buyer.aadhar_number = aadhar_number;
        buyer.pan_number = pan_number;
        buyer.email = email;
        
        env.storage().instance().set(&DataKey::Buyer(caller), &buyer);
    }

    pub fn verify_seller(env: Env, inspector: Address, seller_id: Address) {
        inspector.require_auth();
        
        if !Self::is_land_inspector(env.clone(), inspector) {
            panic!("Only Land Inspector can verify");
        }
        
        let mut seller: Seller = env.storage().instance()
            .get(&DataKey::Seller(seller_id.clone()))
            .expect("Seller not found");
        
        seller.verified = true;
        seller.rejected = false;
        env.storage().instance().set(&DataKey::Seller(seller_id), &seller);
    }

    pub fn reject_seller(env: Env, inspector: Address, seller_id: Address) {
        inspector.require_auth();
        
        if !Self::is_land_inspector(env.clone(), inspector) {
            panic!("Only Land Inspector can reject");
        }
        
        let mut seller: Seller = env.storage().instance()
            .get(&DataKey::Seller(seller_id.clone()))
            .expect("Seller not found");
        
        seller.rejected = true;
        seller.verified = false;
        env.storage().instance().set(&DataKey::Seller(seller_id), &seller);
    }

    pub fn verify_buyer(env: Env, inspector: Address, buyer_id: Address) {
        inspector.require_auth();
        
        if !Self::is_land_inspector(env.clone(), inspector) {
            panic!("Only Land Inspector can verify");
        }
        
        let mut buyer: Buyer = env.storage().instance()
            .get(&DataKey::Buyer(buyer_id.clone()))
            .expect("Buyer not found");
        
        buyer.verified = true;
        buyer.rejected = false;
        env.storage().instance().set(&DataKey::Buyer(buyer_id), &buyer);
    }

    pub fn reject_buyer(env: Env, inspector: Address, buyer_id: Address) {
        inspector.require_auth();
        
        if !Self::is_land_inspector(env.clone(), inspector) {
            panic!("Only Land Inspector can reject");
        }
        
        let mut buyer: Buyer = env.storage().instance()
            .get(&DataKey::Buyer(buyer_id.clone()))
            .expect("Buyer not found");
        
        buyer.rejected = true;
        buyer.verified = false;
        env.storage().instance().set(&DataKey::Buyer(buyer_id), &buyer);
    }

    // Add whole land (traditional)
    pub fn add_land(
        env: Env,
        seller: Address,
        area: u32,
        city: String,
        state: String,
        land_price: i128,
        property_pid: u32,
        survey_num: u32,
        ipfs_hash: String,
        document: String,
    ) {
        seller.require_auth();
        
        let seller_data: Seller = env.storage().instance()
            .get(&DataKey::Seller(seller.clone()))
            .expect("Seller not registered");
        
        if !seller_data.verified {
            panic!("Seller not verified");
        }
        
        let mut count: u32 = env.storage().instance().get(&DataKey::LandCount).unwrap_or(0);
        count += 1;
        
        let land = LandReg {
            id: count,
            area,
            city,
            state,
            land_price,
            property_pid,
            physical_survey_number: survey_num,
            ipfs_hash,
            document,
            is_fractional: false,
            total_fractions: 0,
            fractions_sold: 0,
            price_per_fraction: 0,
        };
        
        env.storage().instance().set(&DataKey::Land(count), &land);
        env.storage().instance().set(&DataKey::LandOwner(count), &seller);
        env.storage().instance().set(&DataKey::LandCount, &count);
    }

    // NEW: Add fractional land (can be split into multiple ownership)
    pub fn add_fractional_land(
        env: Env,
        seller: Address,
        area: u32,
        city: String,
        state: String,
        total_price: i128,
        property_pid: u32,
        survey_num: u32,
        ipfs_hash: String,
        document: String,
        total_fractions: u32, // e.g., 10 for 10 buyers
    ) {
        seller.require_auth();
        
        let seller_data: Seller = env.storage().instance()
            .get(&DataKey::Seller(seller.clone()))
            .expect("Seller not registered");
        
        if !seller_data.verified {
            panic!("Seller not verified");
        }

        if total_fractions == 0 || total_fractions > 100 {
            panic!("Invalid number of fractions (must be 1-100)");
        }
        
        let mut count: u32 = env.storage().instance().get(&DataKey::LandCount).unwrap_or(0);
        count += 1;
        
        let price_per_fraction = total_price / (total_fractions as i128);
        
        let land = LandReg {
            id: count,
            area,
            city,
            state,
            land_price: total_price,
            property_pid,
            physical_survey_number: survey_num,
            ipfs_hash,
            document,
            is_fractional: true,
            total_fractions,
            fractions_sold: 0,
            price_per_fraction,
        };
        
        env.storage().instance().set(&DataKey::Land(count), &land);
        env.storage().instance().set(&DataKey::LandOwner(count), &seller);
        env.storage().instance().set(&DataKey::LandCount, &count);
        env.storage().instance().set(&DataKey::FractionalOwnershipCount(count), &0u32);
        env.storage().instance().set(&DataKey::LandFractionOwners(count), &Vec::<Address>::new(&env));
    }

    pub fn verify_land(env: Env, inspector: Address, land_id: u32) {
        inspector.require_auth();
        
        if !Self::is_land_inspector(env.clone(), inspector) {
            panic!("Only Land Inspector can verify land");
        }
        
        env.storage().instance().set(&DataKey::LandVerified(land_id), &true);
    }

    // Request whole land (traditional)
    pub fn request_land(env: Env, buyer: Address, seller_id: Address, land_id: u32) {
        buyer.require_auth();
        
        let buyer_data: Buyer = env.storage().instance()
            .get(&DataKey::Buyer(buyer.clone()))
            .expect("Buyer not registered");
        
        if !buyer_data.verified {
            panic!("Buyer not verified");
        }

        let land: LandReg = env.storage().instance()
            .get(&DataKey::Land(land_id))
            .expect("Land not found");

        if land.is_fractional {
            panic!("This is fractional land, use request_fractional_land instead");
        }
        
        let mut count: u32 = env.storage().instance().get(&DataKey::RequestCount).unwrap_or(0);
        count += 1;
        
        let request = LandRequest {
            req_id: count,
            seller_id,
            buyer_id: buyer,
            land_id,
            approved: false,
            payment_received: false,
            is_fractional_purchase: false,
            fraction_id: None,
        };
        
        env.storage().instance().set(&DataKey::Request(count), &request);
        env.storage().instance().set(&DataKey::RequestCount, &count);
    }

    // NEW: Request fractional land
    pub fn request_fractional_land(env: Env, buyer: Address, seller_id: Address, land_id: u32) {
        buyer.require_auth();
        
        let buyer_data: Buyer = env.storage().instance()
            .get(&DataKey::Buyer(buyer.clone()))
            .expect("Buyer not registered");
        
        if !buyer_data.verified {
            panic!("Buyer not verified");
        }

        let land: LandReg = env.storage().instance()
            .get(&DataKey::Land(land_id))
            .expect("Land not found");

        if !land.is_fractional {
            panic!("This is not fractional land, use request_land instead");
        }

        if land.fractions_sold >= land.total_fractions {
            panic!("All fractions have been sold");
        }

        // Check if buyer already owns a fraction
        let owners: Vec<Address> = env.storage().instance()
            .get(&DataKey::LandFractionOwners(land_id))
            .unwrap_or(Vec::new(&env));
        
        for owner in owners.iter() {
            if owner == buyer {
                panic!("Buyer already owns a fraction of this land");
            }
        }
        
        let mut count: u32 = env.storage().instance().get(&DataKey::RequestCount).unwrap_or(0);
        count += 1;

        let next_fraction_id = land.fractions_sold + 1;
        
        let request = LandRequest {
            req_id: count,
            seller_id,
            buyer_id: buyer,
            land_id,
            approved: false,
            payment_received: false,
            is_fractional_purchase: true,
            fraction_id: Some(next_fraction_id),
        };
        
        env.storage().instance().set(&DataKey::Request(count), &request);
        env.storage().instance().set(&DataKey::RequestCount, &count);
    }

    pub fn approve_request(env: Env, seller: Address, req_id: u32) {
        seller.require_auth();
        
        let seller_data: Seller = env.storage().instance()
            .get(&DataKey::Seller(seller.clone()))
            .expect("Seller not registered");
        
        if !seller_data.verified {
            panic!("Seller not verified");
        }
        
        let mut request: LandRequest = env.storage().instance()
            .get(&DataKey::Request(req_id))
            .expect("Request not found");
        
        if request.seller_id != seller {
            panic!("Only the seller can approve this request");
        }
        
        request.approved = true;
        env.storage().instance().set(&DataKey::Request(req_id), &request);
    }

    // Updated payment to handle fractional purchases
    pub fn payment(env: Env, buyer: Address, req_id: u32) {
        buyer.require_auth();
        
        let mut request: LandRequest = env.storage().instance()
            .get(&DataKey::Request(req_id))
            .expect("Request not found");
        
        if request.buyer_id != buyer {
            panic!("Only the buyer can make payment");
        }
        
        if !request.approved {
            panic!("Request not approved");
        }

        if request.payment_received {
            panic!("Payment already received");
        }
        
        request.payment_received = true;
        env.storage().instance().set(&DataKey::Request(req_id), &request);

        // If fractional purchase, create fractional ownership record
        if request.is_fractional_purchase {
            let land_id = request.land_id;
            let mut land: LandReg = env.storage().instance()
                .get(&DataKey::Land(land_id))
                .expect("Land not found");

            let fraction_id = request.fraction_id.expect("Fraction ID missing");
            let fraction_percentage = 100 / land.total_fractions;

            let fractional_ownership = FractionalOwnership {
                land_id,
                owner: buyer.clone(),
                fraction_id,
                fraction_percentage,
                purchase_date: env.ledger().timestamp(),
            };

            env.storage().instance().set(
                &DataKey::FractionalOwnership(land_id, fraction_id),
                &fractional_ownership
            );

            // Update land fractions sold
            land.fractions_sold += 1;
            env.storage().instance().set(&DataKey::Land(land_id), &land);

            // Add buyer to fraction owners list
            let mut owners: Vec<Address> = env.storage().instance()
                .get(&DataKey::LandFractionOwners(land_id))
                .unwrap_or(Vec::new(&env));
            owners.push_back(buyer.clone());
            env.storage().instance().set(&DataKey::LandFractionOwners(land_id), &owners);

            // Add land to user's fractional lands
            let mut user_lands: Vec<u32> = env.storage().instance()
                .get(&DataKey::UserFractionalLands(buyer.clone()))
                .unwrap_or(Vec::new(&env));
            user_lands.push_back(land_id);
            env.storage().instance().set(&DataKey::UserFractionalLands(buyer), &user_lands);
        }
    }

    // Transfer ownership (only for whole land, not fractional)
    pub fn transfer_ownership(env: Env, inspector: Address, land_id: u32, new_owner: Address) {
        inspector.require_auth();
        
        if !Self::is_land_inspector(env.clone(), inspector) {
            panic!("Only Land Inspector can transfer ownership");
        }

        let land: LandReg = env.storage().instance()
            .get(&DataKey::Land(land_id))
            .expect("Land not found");

        if land.is_fractional {
            panic!("Cannot transfer ownership of fractional land");
        }
        
        env.storage().instance().set(&DataKey::LandOwner(land_id), &new_owner);
    }

    // NEW: Get fractional ownership details for a specific fraction
    pub fn get_fractional_ownership(env: Env, land_id: u32, fraction_id: u32) -> FractionalOwnership {
        env.storage().instance()
            .get(&DataKey::FractionalOwnership(land_id, fraction_id))
            .expect("Fractional ownership not found")
    }

    // NEW: Get all fractional owners of a land
    pub fn get_land_fraction_owners(env: Env, land_id: u32) -> Vec<Address> {
        env.storage().instance()
            .get(&DataKey::LandFractionOwners(land_id))
            .unwrap_or(Vec::new(&env))
    }

    // NEW: Get all fractional lands owned by a user
    pub fn get_user_fractional_lands(env: Env, user: Address) -> Vec<u32> {
        env.storage().instance()
            .get(&DataKey::UserFractionalLands(user))
            .unwrap_or(Vec::new(&env))
    }

    // NEW: Get available fractions for a land
    pub fn get_available_fractions(env: Env, land_id: u32) -> u32 {
        let land: LandReg = env.storage().instance()
            .get(&DataKey::Land(land_id))
            .expect("Land not found");
        
        if !land.is_fractional {
            return 0;
        }

        land.total_fractions - land.fractions_sold
    }

    // View functions
    pub fn get_land(env: Env, land_id: u32) -> LandReg {
        env.storage().instance()
            .get(&DataKey::Land(land_id))
            .expect("Land not found")
    }

    pub fn get_seller(env: Env, seller_id: Address) -> Seller {
        env.storage().instance()
            .get(&DataKey::Seller(seller_id))
            .expect("Seller not found")
    }

    pub fn get_buyer(env: Env, buyer_id: Address) -> Buyer {
        env.storage().instance()
            .get(&DataKey::Buyer(buyer_id))
            .expect("Buyer not found")
    }

    pub fn get_request(env: Env, req_id: u32) -> LandRequest {
        env.storage().instance()
            .get(&DataKey::Request(req_id))
            .expect("Request not found")
    }

    pub fn get_land_owner(env: Env, land_id: u32) -> Address {
        env.storage().instance()
            .get(&DataKey::LandOwner(land_id))
            .expect("Land owner not found")
    }

    pub fn get_lands_count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::LandCount).unwrap_or(0)
    }

    pub fn get_sellers_count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::SellerCount).unwrap_or(0)
    }

    pub fn get_buyers_count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::BuyerCount).unwrap_or(0)
    }

    pub fn get_requests_count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::RequestCount).unwrap_or(0)
    }

    pub fn is_land_verified(env: Env, land_id: u32) -> bool {
        env.storage().instance()
            .get(&DataKey::LandVerified(land_id))
            .unwrap_or(false)
    }
}

mod test;