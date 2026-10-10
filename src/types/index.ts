export type UserRole = "individual" | "donor" | "ngo" | "admin";

export type ListingStatus = "active" | "claimed" | "completed" | "expired" | "cancelled";

export type ClaimStatus = "pending" | "approved" | "rejected" | "fulfilled" | "no_show";

export type IngredientCategory = "produce" | "dairy" | "meat" | "pantry" | "frozen" | "other";

export type LocationType = "community_fridge" | "food_bank" | "shelter" | "community_kitchen" | "civic_pantry";

export type WasteUnit = "kg" | "lbs" | "items";

export type DietaryTag = "Vegetarian" | "Vegan" | "Dairy-Free" | "Gluten-Free" | "Nut-Free";

export interface FoodListingItem {
  id: string;
  title: string;
  description: string;
  donorName: string;
  donorType: "bakery" | "restaurant" | "grocery" | "individual" | "wedding_caterer" | "mandi_wholesaler";
  donorCity: string;
  donorCountry?: string;
  donorCountryCode?: string;
  donorAddress: string;
  category: "Bakery" | "Produce" | "Meals" | "Dairy" | "Pantry" | "Rice & Grains";
  quantity: string;
  price: number; // 0 = free
  originalPrice?: number;
  currencySymbol?: string;
  expiryTime: string;
  pickupStartTime: string;
  pickupEndTime: string;
  status: ListingStatus;
  distanceKm: number;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  allergens?: string[];
  dietaryTags?: DietaryTag[];
  isBulkEventSurplus?: boolean; // E.g., banquet or wholesale lot
}

export interface ClaimRecord {
  id: string;
  listingId: string;
  claimerName: string;
  claimerRole: UserRole;
  pickupSlot: string;
  notes?: string;
  status: ClaimStatus;
  claimedAt: string;
}

export interface FridgeIngredientItem {
  id: string;
  name: string;
  category: IngredientCategory;
  quantity: number;
  unit: string;
  expiryDate: string; // YYYY-MM-DD
  addedAt: string;
}

export interface RecipeSuggestion {
  id: string;
  title: string;
  cuisine?: "South Asian" | "East Asian" | "Southeast Asian" | "Mediterranean" | "European" | "Middle Eastern" | "Latin American" | "North American" | "African" | "Global Zero-Waste" | string;
  countryOrigin?: string;
  cookingTimeMinutes: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  imageUrl: string;
  usedIngredients: string[];
  missedIngredients: string[];
  instructionsSummary: string;
  stepByStep?: string[];
  zeroWasteTip?: string;
  carbonSavedKg?: number;
  moneySavedUsd?: number;
  dietaryTag?: "Vegetarian" | "Vegan" | "Gluten-Free" | "Dairy-Free";
  calories?: number;
}

export interface SavingsSummaryData {
  totalMoneySavedUsd: number;
  totalFoodSavedKg: number;
  totalCo2AvoidedKg: number;
  consecutiveDaysStreak: number;
  mealsRescuedCount: number;
}

export interface CommunityLocationItem {
  id: string;
  name: string;
  type: LocationType;
  city: string;
  country: string;
  countryCode?: string;
  continent?: "Asia" | "Europe" | "North America" | "South America" | "Africa" | "Oceania" | "Middle East" | string;
  address: string;
  latitude: number;
  longitude: number;
  operatingHours: string;
  is24_7: boolean;
  contactInfo?: string;
  isVerified: boolean;
  inventoryLevel: "stocked" | "low" | "empty";
  inventoryItems: {
    category: string;
    items: string[];
    lastRestocked: string;
  }[];
  urgentlyNeeded: {
    item: string;
    urgency: "high" | "medium" | "low";
  }[];
}

export interface WasteLogEntry {
  id: string;
  itemName: string;
  category: "Produce" | "Dairy" | "Meat & Seafood" | "Bakery" | "Prepared Food" | "Rice & Grains" | "Other";
  quantity: number;
  unit: WasteUnit;
  estimatedCost: number;
  carbonFootprintKg: number;
  reason: "Spoiled / Expired" | "Overcooked" | "Left on Plate" | "Excess Purchased" | "Other";
  loggedAt: string;
}
