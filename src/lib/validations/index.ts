import { z } from "zod";

export const addIngredientSchema = z.object({
  name: z.string().min(2, "Ingredient name must be at least 2 characters"),
  category: z.enum(["produce", "dairy", "meat", "pantry", "frozen", "other"]),
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  unit: z.string().min(1, "Unit is required"),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date (YYYY-MM-DD)"),
});

export const createListingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["Bakery", "Produce", "Meals", "Dairy", "Pantry"]),
  quantity: z.string().min(2, "Quantity description required"),
  price: z.coerce.number().min(0, "Price must be 0 or higher"),
  originalPrice: z.coerce.number().optional(),
  pickupStartTime: z.string().min(1, "Pickup start time required"),
  pickupEndTime: z.string().min(1, "Pickup end time required"),
  expiryHoursFromNow: z.coerce.number().min(1, "Expiry hours must be at least 1"),
});

export const logWasteSchema = z.object({
  itemName: z.string().min(2, "Item name is required"),
  category: z.enum(["Produce", "Dairy", "Meat & Seafood", "Bakery", "Prepared Food", "Other"]),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  unit: z.enum(["kg", "lbs", "items"]),
  estimatedCost: z.coerce.number().min(0, "Cost must be 0 or positive"),
  reason: z.enum(["Spoiled / Expired", "Overcooked", "Left on Plate", "Excess Purchased", "Other"]),
});
