"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Leaf,
  ShoppingBag,
  Refrigerator,
  MapPin,
  Calculator,
  ArrowRight,
  Sparkles,
  Sun,
  Globe2,
  Users,
  UtensilsCrossed,
  ChefHat,
  CheckCircle2,
} from "lucide-react";
import { LocalHubSection } from "@/components/home/local-hub-section";

export default function HomePage() {
  // Hero interactive country dish preview switcher
  const [activeHeroDishIdx, setActiveHeroDishIdx] = useState(0);
  const [selectedWorldRegion, setSelectedWorldRegion] = useState("All Nations");

  const heroDishes = [
    {
      country: "India",
      flag: "🇮🇳",
      city: "Mumbai • Kolkata • Delhi",
      badge: "South Asian Feast",
      title: "Homestyle Chapatis, Dal Tadka & Paneer Thali",
      desc: "Fresh cooked lunch surplus sealed in hygienic food-grade containers • 100% Free",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=900&auto=format&fit=crop&q=85",
      tag: "Rescues Rotis & Curries",
    },
    {
      country: "Japan",
      flag: "🇯🇵",
      city: "Tokyo • Kyoto",
      badge: "East Asian Delicacy",
      title: "Warm Japanese Vegetable Miso Ramen Bowl",
      desc: "Rich savory miso broth with springy noodles, greens, and seasoned nori • Plant-Based",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=900&auto=format&fit=crop&q=85",
      tag: "Mottainai Zero-Waste",
    },
    {
      country: "Italy",
      flag: "🇮🇹",
      city: "Florence • Rome",
      badge: "Mediterranean Classic",
      title: "Classic Italian Penne Pomodoro with Fresh Basil",
      desc: "Al dente penne pasta tossed in sweet overripe tomato reduction and extra virgin olive oil",
      image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=900&auto=format&fit=crop&q=85",
      tag: "Rescues Soft Tomatoes",
    },
    {
      country: "Mexico",
      flag: "🇲🇽",
      city: "Mexico City • Oaxaca",
      badge: "Latin American Heritage",
      title: "Crispy Corn Street Tacos with Fresh Salsa",
      desc: "Crunchy folded corn tortillas loaded with savory black beans, roasted vegetables, and cilantro",
      image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=900&auto=format&fit=crop&q=85",
      tag: "Rescues Stale Tortillas",
    },
    {
      country: "France",
      flag: "🇫🇷",
      city: "Paris • Lyon",
      badge: "European Tradition",
      title: "Provençal Slow-Simmered Vegetable Ratatouille",
      desc: "Soft aubergines, wrinkled courgettes, and tomatoes in herb-infused olive oil",
      image: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=900&auto=format&fit=crop&q=85",
      tag: "Rescues Soft Produce",
    },
  ];

  const activeDish = heroDishes[activeHeroDishIdx];

  // International Food Items from Different Countries Showcase
  const worldFoodItems = [
    {
      country: "India",
      countryCode: "IN",
      flag: "🇮🇳",
      region: "Asia",
      dishName: "Dal Tadka & Fresh Roti Thali",
      tradition: "South Asian Wholesome Meals",
      wasteSaved: "Day-old cooked rice, chapatis & lentils",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=700&auto=format&fit=crop&q=80",
      recipeHref: "/fridge/recipes?search=Palak",
    },
    {
      country: "Japan",
      countryCode: "JP",
      flag: "🇯🇵",
      region: "Asia",
      dishName: "Japanese Miso Vegetable Ramen Bowl",
      tradition: "Japanese Ramen Comfort",
      wasteSaved: "Vegetable scrap broth, spring noodles & nori",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700&auto=format&fit=crop&q=80",
      recipeHref: "/fridge/recipes?search=Pickled",
    },
    {
      country: "Italy",
      countryCode: "IT",
      flag: "🇮🇹",
      region: "Europe",
      dishName: "Italian Penne Pomodoro with Fresh Basil",
      tradition: "Classic Italian Pasta Cucina",
      wasteSaved: "Overripe soft tomatoes & fresh basil stems",
      image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=700&auto=format&fit=crop&q=80",
      recipeHref: "/fridge/recipes?search=Panzanella",
    },
    {
      country: "Mexico",
      countryCode: "MX",
      flag: "🇲🇽",
      region: "Americas",
      dishName: "Crispy Corn Street Tacos with Salsa",
      tradition: "Mexican Street Food Heritage",
      wasteSaved: "Stale dry corn tortillas & roasted vegetables",
      image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=700&auto=format&fit=crop&q=80",
      recipeHref: "/fridge/recipes?search=Chilaquiles",
    },
    {
      country: "France",
      countryCode: "FR",
      flag: "🇫🇷",
      region: "Europe",
      dishName: "Provençal Summer Ratatouille & Tart",
      tradition: "French Countryside Cooking",
      wasteSaved: "Wrinkly peppers, soft zucchini & aubergines",
      image: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=700&auto=format&fit=crop&q=80",
      recipeHref: "/fridge/recipes?search=Ratatouille",
    },
    {
      country: "Thailand",
      countryCode: "TH",
      flag: "🇹🇭",
      region: "Asia",
      dishName: "Thai Coconut Lemongrass Curry Soup",
      tradition: "Southeast Asian Flavors",
      wasteSaved: "Assorted vegetable ends & coconut milk broth",
      image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=700&auto=format&fit=crop&q=80",
      recipeHref: "/fridge/recipes?search=Coconut",
    },
    {
      country: "Lebanon",
      countryCode: "LB",
      flag: "🇱🇧",
      region: "Middle East & Africa",
      dishName: "Levantine Crisp Fattoush Herb Salad",
      tradition: "Levantine Mezze Tradition",
      wasteSaved: "Stale dry pita shards & crisp garden greens",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop&q=80",
      recipeHref: "/fridge/recipes?search=Fattoush",
    },
    {
      country: "Spain",
      countryCode: "ES",
      flag: "🇪🇸",
      region: "Europe",
      dishName: "Spanish Skillet Potatoes & Garden Greens",
      tradition: "Iberian Tapas & Skillets",
      wasteSaved: "Sprouted potatoes, olive oil & garden greens",
      image: "https://images.unsplash.com/photo-1630230596944-6373069c837d?w=700&auto=format&fit=crop&q=80",
      recipeHref: "/fridge/recipes?search=Spanish",
    },
    {
      country: "South Korea",
      countryCode: "KR",
      flag: "🇰🇷",
      region: "Asia",
      dishName: "Korean Kimchi & Tofu Bokkeumbap",
      tradition: "Korean Home Cooking",
      wasteSaved: "Cold day-old rice, aged kimchi & seared tofu",
      image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=700&auto=format&fit=crop&q=80",
      recipeHref: "/fridge/recipes?search=Kimchi",
    },
    {
      country: "Nigeria",
      countryCode: "NG",
      flag: "🇳🇬",
      region: "Middle East & Africa",
      dishName: "West African Spiced Jollof Rice",
      tradition: "West African Celebration",
      wasteSaved: "Day-old long-grain rice & blended sweet tomatoes",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&auto=format&fit=crop&q=80",
      recipeHref: "/fridge/recipes?search=Jollof",
    },
    {
      country: "Vietnam",
      countryCode: "VN",
      flag: "🇻🇳",
      region: "Asia",
      dishName: "Vietnamese Ginger Broth & Rice Congee",
      tradition: "Vietnamese Morning Comfort",
      wasteSaved: "Cold cooked rice, ginger & fresh herb stems",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=700&auto=format&fit=crop&q=80",
      recipeHref: "/fridge/recipes?search=Congee",
    },
    {
      country: "United States",
      countryCode: "US",
      flag: "🇺🇸",
      region: "Americas",
      dishName: "Fluffy Banana & Oat Griddle Pancakes",
      tradition: "Pan-American Breakfast",
      wasteSaved: "Black speckled bananas & rolled oats",
      image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=700&auto=format&fit=crop&q=80",
      recipeHref: "/fridge/recipes?search=Banana",
    },
  ];

  const regions = ["All Nations", "Asia", "Europe", "Americas", "Middle East & Africa"];

  const filteredWorldFoods = worldFoodItems.filter((item) => {
    if (selectedWorldRegion === "All Nations") return true;
    return item.region === selectedWorldRegion;
  });

  const modules = [
    {
      id: "matcher",
      title: "Surplus Food Matcher",
      badge: "Commercial & Event Rescue",
      tagline: "Worldwide Bakeries, Markets & Caterers",
      desc: "Rescue closing bakery loaves, mandi wholesale lots, and wedding banquet surplus across India, Singapore, Tokyo, New York, London, Madrid, and beyond. Vegetarian and Vegan certified.",
      href: "/listings",
      icon: ShoppingBag,
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80",
      highlight: "Global Marketplace",
    },
    {
      id: "fridge",
      title: "Fridge Rescue Planner",
      badge: "Smart Kitchen Chef",
      tagline: "22+ Master Recipes for Expiring Food",
      desc: "Log chapatis, cooked rice, tofu, greens, and stale breads. Cook Asian Fried Rice, Tuscan Panzanella, Mexican Chilaquiles, or Indian Palak Paneer so nothing is thrown away.",
      href: "/fridge",
      icon: Refrigerator,
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80",
      highlight: "6 World Cuisines",
    },
    {
      id: "map",
      title: "Community Fridge Map",
      badge: "Mutual Aid in 195 Countries",
      tagline: "Every Continent & Global Hub",
      desc: "Locate open community fridges, food banks, and civic pantries in Mumbai, Singapore, Delhi, Tokyo, Seoul, London, Berlin, Paris, New York, São Paulo, and Nairobi.",
      href: "/map",
      icon: MapPin,
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80",
      highlight: "100% Free & Open",
    },
    {
      id: "calc",
      title: "Carbon & Cost Calculator",
      badge: "Planetary Auditor",
      tagline: "Multi-Currency & Climate Zones",
      desc: "Measure financial grocery loss and landfill methane greenhouse footprint across ₹ INR, $ USD, € EUR, £ GBP, ¥ JPY, S$ SGD, and all world currencies.",
      href: "/calculator",
      icon: Calculator,
      image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=80",
      highlight: "Universal Currencies",
    },
  ];

  const visualFoodGallery = [
    {
      name: "Cooked Rice & Grains",
      tip: "Wok Fried Rice, Congee & Mujadara",
      icon: "🍚",
      benefit: "East Asian & Middle Eastern",
      image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&auto=format&fit=crop&q=70",
    },
    {
      name: "Day-Old Flatbreads & Rotis",
      tip: "Spiced Roti Upma & Chilaquiles",
      icon: "🫓",
      benefit: "South Asian & Mexican",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=70",
    },
    {
      name: "Stale Sourdough & Crusty Breads",
      tip: "Tuscan Panzanella & Ribollita Stew",
      icon: "🥖",
      benefit: "Mediterranean & European",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=70",
    },
    {
      name: "Coriander & Herb Stems",
      tip: "Walnut Pesto & Crisp Pakoras",
      icon: "🌿",
      benefit: "3x More Aromatic Oils",
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=70",
    },
    {
      name: "Soft Tomatoes & Wrinkly Veggies",
      tip: "Warm Shakshuka & French Ratatouille",
      icon: "🍅",
      benefit: "Concentrated Rich Sugars",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=70",
    },
    {
      name: "Overripe Bananas & Ripe Fruits",
      tip: "Cinnamon Oat Griddle Hotcakes",
      icon: "🍌",
      benefit: "Zero Added Sugar Needed",
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=70",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fbfbfd] text-[#1d1d1f] selection:bg-emerald-100 selection:text-emerald-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        {/* Soft Ambient Light Glows */}
        <div className="pointer-events-none absolute -top-40 right-1/4 h-[550px] w-[550px] rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="pointer-events-none absolute -top-20 left-10 h-[450px] w-[450px] rounded-full bg-amber-100/30 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              {/* Apple-style Global Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/90 px-4 py-1.5 text-[12px] font-medium text-[#1d1d1f] shadow-xs backdrop-blur-md">
                <Globe2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Global Movement • Connecting All Countries & Continents</span>
              </div>

              {/* Apple-style Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-semibold text-[#1d1d1f] tracking-[-0.038em] leading-[1.05]">
                Honor food. <br />
                <span className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 bg-clip-text text-transparent">
                  Rescue every meal.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-[21px] text-[#6e6e73] font-normal leading-[1.4] max-w-xl mx-auto lg:mx-0 tracking-[-0.016em]">
                From Mumbai and Singapore to Rome, Mexico City, and Paris. Rescue surplus from
                bakeries and event caterers, cook 22+ international zero-waste recipes, and eliminate landfill methane.
              </p>

              {/* CTA Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
                <Link
                  href="/listings"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-7 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#333336] hover:scale-[1.01] active:scale-[0.99] transition duration-150 cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4 text-emerald-400" />
                  <span>Explore Surplus Food</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/fridge/recipes"
                  className="inline-flex items-center gap-2 rounded-full border border-black/[0.12] bg-white px-7 py-3.5 text-sm font-semibold text-[#1d1d1f] hover:bg-[#f5f5f7] hover:border-black/[0.2] transition duration-150 cursor-pointer"
                >
                  <UtensilsCrossed className="h-4 w-4 text-emerald-600" />
                  <span>22+ Smart World Recipes</span>
                </Link>
              </div>

              {/* Global Trust Badges */}
              <div className="pt-5 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-[12px] text-[#86868b] border-t border-black/[0.06]">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  <span>195+ Countries Supported</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                  <span>🌱 100% Secular Dietary Standards</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-zinc-800 bg-zinc-100 px-3 py-1 rounded-full">
                  <span>🌍 Mutual Aid on 6 Continents</span>
                </div>
              </div>
            </div>

            {/* Right Visual Composition with Country Dish Switcher */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Hero Food Visual Card */}
                <div className="relative overflow-hidden rounded-[28px] border border-black/[0.08] bg-white p-3 shadow-2xl shadow-black/5">
                  <div className="relative h-80 sm:h-96 w-full overflow-hidden rounded-[22px] bg-zinc-100">
                    <img
                      key={activeDish.image}
                      src={activeDish.image}
                      alt={activeDish.title}
                      className="h-full w-full object-cover transition duration-700 hover:scale-105 animate-in fade-in"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Top tags on image */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white">
                        {activeDish.flag} {activeDish.country}
                      </span>
                      <span className="rounded-full bg-emerald-600/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-white">
                        {activeDish.tag}
                      </span>
                    </div>

                    {/* Bottom info on image */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-medium">
                          {activeDish.city}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-300">
                          {activeDish.badge}
                        </span>
                      </div>
                      <h3 className="mt-1.5 text-base font-semibold tracking-[-0.02em] leading-snug">
                        {activeDish.title}
                      </h3>
                      <p className="text-xs text-white/80 tracking-[-0.01em] mt-0.5">
                        {activeDish.desc}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Quick-Toggles underneath photo */}
                  <div className="mt-3 flex items-center justify-between gap-1.5 px-1 py-1 overflow-x-auto scrollbar-none">
                    {heroDishes.map((dish, idx) => (
                      <button
                        key={dish.country}
                        onClick={() => setActiveHeroDishIdx(idx)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
                          activeHeroDishIdx === idx
                            ? "bg-[#1d1d1f] text-white shadow-xs"
                            : "bg-[#f5f5f7] text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.05]"
                        }`}
                      >
                        <span>{dish.flag}</span>
                        <span>{dish.country}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Floating Micro-Cards */}
                <div className="absolute -bottom-5 -left-5 rounded-2xl border border-black/[0.08] bg-white/95 p-3.5 shadow-xl shadow-black/5 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#1d1d1f] tracking-tight block">
                        Catering Surplus Diverted
                      </span>
                      <p className="text-[11px] text-amber-700 font-medium">
                        Feeds 35+ People (Zero Waste)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 rounded-2xl border border-black/[0.08] bg-white/95 p-3.5 shadow-xl shadow-black/5 backdrop-blur-md">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <div>
                      <span className="text-xs font-semibold text-[#1d1d1f] tracking-tight block">
                        Worldwide Hubs
                      </span>
                      <p className="text-[11px] font-medium text-emerald-600">
                        🟢 Active across 6 Continents
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hyper-Local Resource Detector & Hub (Auto Location, Nearest Fridge, Local Surplus) */}
      <LocalHubSection />

      {/* NEW: Comprehensive Multi-Country Food Showcase Gallery */}
      <section className="py-20 border-t border-black/[0.06] bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-[0.04em]">
                <Globe2 className="h-4 w-4" />
                <span>Culinary Traditions of the World</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-[-0.035em] mt-1.5">
                Authentic Food Across Nations
              </h2>
              <p className="mt-2 text-sm text-[#6e6e73] max-w-2xl leading-relaxed">
                Discover authentic zero-waste dishes from Asia, Europe, the Americas, Africa, and the Middle East.
                Every culinary tradition carries ancestral wisdom to transform yesterday's surplus into nutritious delicacies.
              </p>
            </div>

            {/* Region Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedWorldRegion(region)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                    selectedWorldRegion === region
                      ? "bg-[#1d1d1f] text-white shadow-xs"
                      : "bg-[#f5f5f7] text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.06]"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Food Items from Different Countries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredWorldFoods.map((item, idx) => (
              <div
                key={idx}
                className="group flex flex-col overflow-hidden rounded-[24px] border border-black/[0.08] bg-[#fbfbfd] transition duration-200 hover:bg-white hover:border-black/[0.16] hover:shadow-xl hover:shadow-black/5"
              >
                {/* Photo container */}
                <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
                  <img
                    src={item.image}
                    alt={item.dishName}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  {/* Country Flag & Name Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="flex items-center gap-1.5 rounded-full bg-[#1d1d1f]/90 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white shadow-xs">
                      <span>{item.flag}</span>
                      <span>{item.country}</span>
                    </span>
                  </div>

                  {/* Region badge */}
                  <div className="absolute top-3 right-3">
                    <span className="rounded-full bg-white/95 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-[#1d1d1f] shadow-xs">
                      {item.region}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                    {item.tradition}
                  </span>
                  <h3 className="mt-1 text-base font-semibold text-[#1d1d1f] tracking-[-0.015em] leading-snug group-hover:text-emerald-700 transition">
                    {item.dishName}
                  </h3>

                  <div className="mt-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 p-2.5 text-[11px] text-emerald-900 leading-relaxed">
                    <span className="font-semibold text-emerald-800">Rescues:</span> {item.wasteSaved}
                  </div>

                  {/* Action Link */}
                  <div className="mt-auto pt-4 border-t border-black/[0.06]">
                    <Link
                      href={item.recipeHref}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1d1d1f] hover:text-emerald-700 transition"
                    >
                      <span>Explore Recipe & Tips</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culinary Preservation Strip */}
      <section className="py-16 border-y border-black/[0.06] bg-[#fbfbfd]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.04em] text-emerald-700 flex items-center gap-1.5">
                <Sun className="h-4 w-4 text-amber-500" />
                Worldwide Zero-Waste Kitchen Guide
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-[-0.03em] mt-0.5">
                Preserve & Recreate Global Food Staples
              </h2>
            </div>
            <Link
              href="/fridge/recipes"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition"
            >
              Explore all 22+ world recipes <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
            {visualFoodGallery.map((food, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-[20px] border border-black/[0.06] bg-white p-3 hover:border-black/[0.14] hover:shadow-lg hover:shadow-black/5 transition duration-200"
              >
                <div className="relative h-28 w-full overflow-hidden rounded-[14px] bg-zinc-100">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 rounded-lg bg-white/90 backdrop-blur-sm px-2 py-0.5 text-sm shadow-xs">
                    {food.icon}
                  </div>
                </div>
                <div className="mt-2.5">
                  <h4 className="text-xs font-semibold text-[#1d1d1f] tracking-tight group-hover:text-emerald-700 transition">
                    {food.name}
                  </h4>
                  <p className="text-[11px] font-medium text-emerald-700 mt-0.5 line-clamp-1">
                    {food.tip}
                  </p>
                  <span className="inline-block mt-0.5 text-[10px] text-[#86868b]">
                    {food.benefit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Connected Solutions Grid */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.04em] text-emerald-700">
              Four Interlinked Systems
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-[-0.032em]">
              Designed for Kitchens & Communities Worldwide
            </h2>
            <p className="text-base text-[#6e6e73] font-normal tracking-[-0.014em]">
              Empowering households, restaurants, caterers, and food banks across 195+ countries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  className="group relative flex flex-col overflow-hidden rounded-[26px] border border-black/[0.08] bg-[#fbfbfd] shadow-xs hover:bg-white hover:border-black/[0.16] hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5 transition duration-200"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-zinc-100">
                    <img
                      src={m.image}
                      alt={m.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-semibold text-[#1d1d1f] shadow-xs">
                        {m.badge}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4">
                      <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-medium text-white">
                        {m.highlight}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-xs font-medium text-white/80">{m.tagline}</span>
                      <h3 className="text-xl font-semibold tracking-[-0.024em]">{m.title}</h3>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-7">
                    <p className="text-sm text-[#6e6e73] leading-relaxed tracking-[-0.01em]">
                      {m.desc}
                    </p>

                    <div className="mt-6 pt-5 border-t border-black/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-medium text-[#1d1d1f]">
                        <Icon className="h-4 w-4 text-emerald-600" />
                        <span>Global Engine Active</span>
                      </div>

                      <Link
                        href={m.href}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#1d1d1f] px-5 py-2 text-xs font-semibold text-white hover:bg-[#333336] transition"
                      >
                        <span>Open {m.title}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global Environmental Impact Section */}
      <section className="py-20 bg-[#1d1d1f] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.04em] text-emerald-400">
              The Planetary Challenge
            </span>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.035em]">
              Small Daily Changes. Massive Global Impact.
            </h2>
            <p className="text-base text-[#86868b] leading-relaxed tracking-[-0.014em]">
              Globally, over 1.3 billion metric tons of edible food is lost each year, producing 8-10% of total
              global greenhouse gases. FoodSave turns surplus into immediate community nourishment across 195 countries.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="rounded-[22px] border border-white/[0.08] bg-white/[0.04] p-7 backdrop-blur-md">
              <span className="text-4xl font-semibold text-amber-300 tracking-[-0.03em]">25x</span>
              <h4 className="mt-2 text-sm font-semibold text-white">More Potent Methane</h4>
              <p className="mt-1 text-xs text-[#86868b] leading-relaxed">
                Decomposing food in landfills releases methane, 25 times more climate-damaging than CO₂.
              </p>
            </div>

            <div className="rounded-[22px] border border-white/[0.08] bg-white/[0.04] p-7 backdrop-blur-md">
              <span className="text-4xl font-semibold text-emerald-400 tracking-[-0.03em]">140L</span>
              <h4 className="mt-2 text-sm font-semibold text-white">Water Per Fruit</h4>
              <p className="mt-1 text-xs text-[#86868b] leading-relaxed">
                Freshwater lost with every agricultural fruit or vegetable tossed into municipal trash.
              </p>
            </div>

            <div className="rounded-[22px] border border-white/[0.08] bg-white/[0.04] p-7 backdrop-blur-md">
              <span className="text-4xl font-semibold text-white tracking-[-0.03em]">195</span>
              <h4 className="mt-2 text-sm font-semibold text-white">Nations Unified</h4>
              <p className="mt-1 text-xs text-[#86868b] leading-relaxed">
                Universal secular standards, multi-currency accounting, and zero-waste mutual aid.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#1d1d1f] shadow-lg hover:bg-[#f5f5f7] hover:scale-[1.01] transition duration-150"
            >
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Explore Surplus Food Near You</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
