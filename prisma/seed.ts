import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting FoodSave database seeding...");

  // 1. Clear existing records to ensure clean idempotent seed
  await prisma.locationNeed.deleteMany();
  await prisma.locationInventory.deleteMany();
  await prisma.communityLocation.deleteMany();
  await prisma.listingClaim.deleteMany();
  await prisma.foodListing.deleteMany();
  await prisma.fridgeIngredient.deleteMany();
  await prisma.savingsLog.deleteMany();
  await prisma.wasteLog.deleteMany();
  await prisma.donorProfile.deleteMany();
  await prisma.ngoProfile.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash("foodsave123", 10);

  // 2. Create Users
  const userIndividual = await prisma.user.create({
    data: {
      id: "user-ind-1",
      email: "individual@foodsave.org",
      passwordHash: defaultPassword,
      fullName: "Aarav Sen",
      primaryRole: "individual",
      phoneNumber: "+91 98301 23456",
      city: "Kolkata",
    },
  });

  const userDonor = await prisma.user.create({
    data: {
      id: "user-donor-1",
      email: "donor@foodsave.org",
      passwordHash: defaultPassword,
      fullName: "Chef Priya Sharma",
      primaryRole: "donor",
      phoneNumber: "+91 98200 87654",
      city: "Mumbai",
      organizationName: "Bandra Homestyle Kitchen",
    },
  });

  const userNgo = await prisma.user.create({
    data: {
      id: "user-ngo-1",
      email: "ngo@foodsave.org",
      passwordHash: defaultPassword,
      fullName: "Robin Hood Army Co-ordinator",
      primaryRole: "ngo",
      phoneNumber: "+91 99100 45678",
      city: "Delhi NCR",
      organizationName: "Meals For All Foundation",
    },
  });

  const userAdmin = await prisma.user.create({
    data: {
      id: "user-admin-1",
      email: "admin@foodsave.org",
      passwordHash: defaultPassword,
      fullName: "FoodSave System Admin",
      primaryRole: "admin",
      phoneNumber: "+1 415 555 0199",
      city: "Global",
    },
  });

  // 3. Create Profiles
  const donorProfile = await prisma.donorProfile.create({
    data: {
      id: "dp-1",
      userId: userDonor.id,
      businessName: "Bandra Homestyle Kitchen",
      description: "Wholesome fresh home-style meals and daily surplus rescue kitchen.",
      address: "Shop 12, Link Road, Bandra West, Mumbai",
      latitude: 19.0596,
      longitude: 72.8295,
      isVerified: true,
    },
  });

  await prisma.ngoProfile.create({
    data: {
      id: "np-1",
      userId: userNgo.id,
      organizationName: "Meals For All Foundation",
      taxId: "80G-DEL-2024-8841",
      address: "C-14, Connaught Place, New Delhi",
      latitude: 28.6315,
      longitude: 77.2167,
      isVerified: true,
    },
  });

  // 4. Create Food Listings
  const listing1 = await prisma.foodListing.create({
    data: {
      id: "list-1",
      donorId: donorProfile.id,
      donorName: "Bandra Homestyle Kitchen",
      donorType: "restaurant",
      donorCity: "Mumbai",
      donorCountry: "India",
      donorCountryCode: "IN",
      donorAddress: "Shop 12, Link Road, Bandra West",
      title: "Fresh Roti, Dal Tadka & Paneer Tiffin Sets (Pack of 6)",
      description: "End of lunch-hour cooked wholesome tiffins: freshly rolled chapatis, tempered yellow dal, and paneer curry in sealed food-grade containers.",
      category: "Meals",
      quantity: "6 full meal thalis",
      price: 0,
      originalPrice: 24,
      currencySymbol: "₹",
      expiryTime: new Date(Date.now() + 8 * 3600 * 1000),
      pickupStartTime: new Date(Date.now() + 1 * 3600 * 1000),
      pickupEndTime: new Date(Date.now() + 4 * 3600 * 1000),
      status: "active",
      latitude: 19.0596,
      longitude: 72.8295,
      imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80",
      allergens: JSON.stringify(["Dairy"]),
      dietaryTags: JSON.stringify(["Vegetarian"]),
      isBulkEventSurplus: false,
    },
  });

  const listingKolkata = await prisma.foodListing.create({
    data: {
      id: "list-kolkata",
      donorName: "Park Street Homestyle Kitchen",
      donorType: "restaurant",
      donorCity: "Kolkata",
      donorCountry: "India",
      donorCountryCode: "IN",
      donorAddress: "18 Park Street, Kolkata",
      title: "Fresh Bengali Tiffin Meals & Paneer Thalis (Pack of 8)",
      description: "Daily surplus from afternoon kitchen service: steamed basmati rice, yellow moong dal, aloo poshto, and paneer curry in sealed takeaway meal containers.",
      category: "Meals",
      quantity: "8 complete meal thalis",
      price: 0,
      originalPrice: 28,
      currencySymbol: "₹",
      expiryTime: new Date(Date.now() + 10 * 3600 * 1000),
      pickupStartTime: new Date(Date.now() + 1 * 3600 * 1000),
      pickupEndTime: new Date(Date.now() + 5 * 3600 * 1000),
      status: "active",
      latitude: 22.5518,
      longitude: 88.3524,
      imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80",
      allergens: JSON.stringify(["Dairy"]),
      dietaryTags: JSON.stringify(["Vegetarian"]),
      isBulkEventSurplus: false,
    },
  });

  const listingDelhi = await prisma.foodListing.create({
    data: {
      id: "list-2",
      donorName: "Grand Heritage Banquet Caterers",
      donorType: "wedding_caterer",
      donorCity: "Delhi NCR",
      donorCountry: "India",
      donorCountryCode: "IN",
      donorAddress: "Grand Ballroom, MG Road",
      title: "Banquet Catering Surplus: Vegetable Biryani & Salan (Feeds 35)",
      description: "Surplus untouched banquet food from afternoon event ceremony. Fresh aromatic vegetable dum biryani, salan gravy, and raita in hygienic catering trays.",
      category: "Meals",
      quantity: "approx 18-20 kg (Feeds 35-40)",
      price: 0,
      originalPrice: 180,
      currencySymbol: "₹",
      expiryTime: new Date(Date.now() + 12 * 3600 * 1000),
      pickupStartTime: new Date(Date.now() + 2 * 3600 * 1000),
      pickupEndTime: new Date(Date.now() + 6 * 3600 * 1000),
      status: "active",
      latitude: 28.4815,
      longitude: 77.0864,
      imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
      dietaryTags: JSON.stringify(["Vegetarian"]),
      isBulkEventSurplus: true,
    },
  });

  const listingBengaluru = await prisma.foodListing.create({
    data: {
      id: "list-3",
      donorName: "Artisan Woodfire Bakery",
      donorType: "bakery",
      donorCity: "Bengaluru",
      donorCountry: "India",
      donorCountryCode: "IN",
      donorAddress: "12th Main, Indiranagar, Bengaluru",
      title: "Daily Fresh Sourdough Batards & Brioche Buns (Pack of 10)",
      description: "Evening bake surplus: naturally fermented country sourdough loaves and enriched sweet brioche burger buns.",
      category: "Bakery",
      quantity: "10 assorted bakery items",
      price: 150,
      originalPrice: 600,
      currencySymbol: "₹",
      expiryTime: new Date(Date.now() + 24 * 3600 * 1000),
      pickupStartTime: new Date(Date.now() + 1 * 3600 * 1000),
      pickupEndTime: new Date(Date.now() + 4 * 3600 * 1000),
      status: "active",
      latitude: 12.9784,
      longitude: 77.6408,
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
      allergens: JSON.stringify(["Gluten"]),
      dietaryTags: JSON.stringify(["Vegetarian"]),
      isBulkEventSurplus: false,
    },
  });

  // 5. Seed Claims
  await prisma.listingClaim.create({
    data: {
      id: "claim-101",
      listingId: listing1.id,
      claimerId: userIndividual.id,
      claimerName: "Aarav Sen",
      claimerEmail: "individual@foodsave.org",
      claimerPhone: "+91 98301 23456",
      claimerRole: "individual",
      pickupSlot: "Today 16:00 - 16:30",
      notes: "Bringing clean thermal bags for food rescue.",
      status: "approved",
      verificationCode: "FS-928410",
    },
  });

  // 6. Seed Virtual Fridge Ingredients
  const now = new Date();
  const dayMs = 24 * 3600 * 1000;

  await prisma.fridgeIngredient.createMany({
    data: [
      {
        id: "ing-1",
        userId: userIndividual.id,
        name: "Cooked Basmati Rice (Leftover)",
        category: "pantry",
        quantity: 400,
        unit: "g",
        expiryDate: new Date(now.getTime() + 1 * dayMs),
        addedAt: new Date(now.getTime() - 1 * dayMs),
      },
      {
        id: "ing-2",
        userId: userIndividual.id,
        name: "Fresh Palak (Spinach Leaves)",
        category: "produce",
        quantity: 250,
        unit: "g",
        expiryDate: new Date(now.getTime() + 2 * dayMs),
        addedAt: new Date(now.getTime() - 2 * dayMs),
      },
      {
        id: "ing-3",
        userId: userIndividual.id,
        name: "Fresh Paneer / Tofu Block",
        category: "dairy",
        quantity: 200,
        unit: "g",
        expiryDate: new Date(now.getTime() + 3 * dayMs),
        addedAt: new Date(now.getTime() - 1 * dayMs),
      },
      {
        id: "ing-4",
        userId: userIndividual.id,
        name: "Overripe Tomatoes",
        category: "produce",
        quantity: 4,
        unit: "items",
        expiryDate: new Date(now.getTime() + 1 * dayMs),
        addedAt: new Date(now.getTime() - 3 * dayMs),
      },
      {
        id: "ing-5",
        userId: userIndividual.id,
        name: "Leftover Chapatis / Rotis",
        category: "pantry",
        quantity: 5,
        unit: "items",
        expiryDate: new Date(now.getTime() + 2 * dayMs),
        addedAt: new Date(now.getTime() - 1 * dayMs),
      },
      {
        id: "ing-6",
        userId: userIndividual.id,
        name: "Fresh Coriander & Herb Stems",
        category: "produce",
        quantity: 80,
        unit: "g",
        expiryDate: new Date(now.getTime() + 2 * dayMs),
        addedAt: new Date(now.getTime() - 2 * dayMs),
      },
      {
        id: "ing-7",
        userId: userIndividual.id,
        name: "Greek Yogurt / Curd (Dahi)",
        category: "dairy",
        quantity: 350,
        unit: "g",
        expiryDate: new Date(now.getTime() + 4 * dayMs),
        addedAt: new Date(now.getTime() - 3 * dayMs),
      },
    ],
  });

  // 7. Seed Community Locations (Fridges, Food Banks, Shelters)
  const locKolkata = await prisma.communityLocation.create({
    data: {
      id: "loc-kolkata",
      name: "Kolkata Park Street Community Food Bank & Fridge",
      type: "community_fridge",
      city: "Kolkata",
      country: "India",
      countryCode: "IN",
      address: "14 Park Street, Near St. Xavier's, Kolkata, West Bengal",
      latitude: 22.5511,
      longitude: 88.3533,
      operatingHours: "24/7 Public Access",
      isVerified: true,
      currentStockLevel: "Moderate",
      capacityNotes: "Dual door solar refrigeration with pantry shelves",
      contactPhone: "+91 98301 99887",
    },
  });

  const locMumbai = await prisma.communityLocation.create({
    data: {
      id: "loc-1",
      name: "Mumbai Bandra West Public Fridge",
      type: "community_fridge",
      city: "Mumbai",
      country: "India",
      countryCode: "IN",
      address: "Near Carter Road Promenade, Bandra West, Mumbai",
      latitude: 19.0657,
      longitude: 72.8258,
      operatingHours: "24/7 Public Access",
      isVerified: true,
      currentStockLevel: "High",
      capacityNotes: "Large double-door commercial cooler",
      contactPhone: "+91 98200 11223",
    },
  });

  const locDelhi = await prisma.communityLocation.create({
    data: {
      id: "loc-2",
      name: "Delhi Nizamuddin Community Food Pantry",
      type: "food_bank",
      city: "Delhi NCR",
      country: "India",
      countryCode: "IN",
      address: "Near Dargah Complex, West Nizamuddin, New Delhi",
      latitude: 28.5916,
      longitude: 77.2435,
      operatingHours: "Daily 7:00 AM - 10:00 PM",
      isVerified: true,
      currentStockLevel: "Moderate",
      capacityNotes: "Deep chest freezers and bulk grain containers",
      contactPhone: "+91 98111 22334",
    },
  });

  const locBengaluru = await prisma.communityLocation.create({
    data: {
      id: "loc-3",
      name: "Bengaluru Indiranagar Civic Care Fridge",
      type: "community_fridge",
      city: "Bengaluru",
      country: "India",
      countryCode: "IN",
      address: "100 Feet Road, 2nd Stage, Indiranagar, Bengaluru",
      latitude: 12.9719,
      longitude: 77.6412,
      operatingHours: "24/7 Public Access",
      isVerified: true,
      currentStockLevel: "High",
      capacityNotes: "Triple door solar fridge with CCTV supervision",
      contactPhone: "+91 98450 33445",
    },
  });

  // 8. Add inventory to locations
  await prisma.locationInventory.createMany({
    data: [
      {
        locationId: locKolkata.id,
        itemName: "Cooked Dal & Steamed Rice Packs",
        quantity: 18,
        unit: "meals",
      },
      {
        locationId: locKolkata.id,
        itemName: "Fresh Bananas & Guavas",
        quantity: 25,
        unit: "kg",
      },
      {
        locationId: locMumbai.id,
        itemName: "Fresh Whole Wheat Breads",
        quantity: 12,
        unit: "loaves",
      },
      {
        locationId: locMumbai.id,
        itemName: "Filtered Water Bottles (1L)",
        quantity: 40,
        unit: "bottles",
      },
    ],
  });

  // 9. Add Needs
  await prisma.locationNeed.createMany({
    data: [
      {
        locationId: locKolkata.id,
        itemName: "Clean reusable thermal meal containers",
        urgencyLevel: 2,
        fulfilled: false,
      },
      {
        locationId: locDelhi.id,
        itemName: "Sealed milk packets and high-protein lentils",
        urgencyLevel: 3,
        fulfilled: false,
      },
    ],
  });

  // 10. Seed Savings Log
  await prisma.savingsLog.createMany({
    data: [
      {
        userId: userIndividual.id,
        amountSaved: 280,
        currency: "₹",
        description: "Repurposed stale rotis into spiced snack upma instead of ordering delivery.",
      },
      {
        userId: userIndividual.id,
        amountSaved: 420,
        currency: "₹",
        description: "Claimed fresh surplus dinner thali from Bandra Homestyle Kitchen.",
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
  console.log(`- 4 Demo Users created (password: foodsave123)`);
  console.log(`  • individual@foodsave.org (Role: individual)`);
  console.log(`  • donor@foodsave.org (Role: donor)`);
  console.log(`  • ngo@foodsave.org (Role: ngo)`);
  console.log(`  • admin@foodsave.org (Role: admin)`);
  console.log(`- ${[listing1, listingKolkata, listingDelhi, listingBengaluru].length} Food Listings active`);
  console.log(`- 4 Community Locations active (Kolkata, Mumbai, Delhi, Bengaluru)`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
