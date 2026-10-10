"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CommunityLocationItem, FoodListingItem } from "@/types";

interface LeafletMapInnerProps {
  center: [number, number];
  zoom?: number;
  userLocation: {
    latitude: number;
    longitude: number;
    city: string;
    neighborhood?: string;
    displayName?: string;
    accuracy?: number;
  } | null;
  fridges: CommunityLocationItem[];
  listings: FoodListingItem[];
  selectedItem: {
    id: string;
    type: "fridge" | "listing";
    lat: number;
    lng: number;
    title: string;
  } | null;
  onSelectFridge: (item: CommunityLocationItem) => void;
  onSelectListing: (item: FoodListingItem) => void;
  onRecenterUser?: () => void;
  isTrackingLive?: boolean;
}

export default function LeafletMapInner({
  center,
  zoom = 13,
  userLocation,
  fridges,
  listings,
  selectedItem,
  onSelectFridge,
  onSelectListing,
  onRecenterUser,
  isTrackingLive = false,
}: LeafletMapInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!containerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: false,
      attributionControl: false,
    });

    // High-resolution OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.control
      .attribution({
        position: "bottomright",
        prefix: false,
      })
      .addAttribution('&copy; <a href="https://openstreetmap.org" class="text-[10px] text-gray-500">OSM</a>')
      .addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // Run once on mount

  // Fly to selected item or center when updated
  useEffect(() => {
    if (!mapRef.current) return;
    const targetLat = selectedItem?.lat ?? center[0];
    const targetLng = selectedItem?.lng ?? center[1];

    if (targetLat && targetLng && !isNaN(targetLat) && !isNaN(targetLng)) {
      mapRef.current.flyTo([targetLat, targetLng], 15, {
        animate: true,
        duration: 0.9,
      });
    }
  }, [selectedItem, center]);

  // Handle live tracking position updates
  useEffect(() => {
    if (!mapRef.current || !isTrackingLive || !userLocation) return;
    if (userLocation.latitude && userLocation.longitude) {
      mapRef.current.panTo([userLocation.latitude, userLocation.longitude], {
        animate: true,
        duration: 0.5,
      });
    }
  }, [userLocation?.latitude, userLocation?.longitude, isTrackingLive]);

  // Render markers whenever fridges, listings, selectedItem, or userLocation change
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    const group = markersLayerRef.current;
    group.clearLayers();
    userMarkerRef.current = null;

    // 1. Precise User Location with Accuracy Halo Circle
    if (
      userLocation &&
      userLocation.latitude &&
      userLocation.longitude &&
      !isNaN(userLocation.latitude)
    ) {
      const uLat = userLocation.latitude;
      const uLng = userLocation.longitude;
      const accuracyRadius = userLocation.accuracy ? Math.max(12, userLocation.accuracy) : 25;

      // Draw GPS Accuracy Confidence Halo Circle
      const accuracyCircle = L.circle([uLat, uLng], {
        radius: accuracyRadius,
        color: "#2563eb",
        weight: 1.5,
        opacity: 0.55,
        fillColor: "#3b82f6",
        fillOpacity: 0.12,
        dashArray: "3, 4",
      });
      group.addLayer(accuracyCircle);

      // Custom High-Precision Radar Pin
      const userIcon = L.divIcon({
        className: "custom-user-radar-pin",
        html: `
          <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;width:100%;height:100%;border-radius:50%;background:#3b82f6;opacity:0.4;animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="width:16px;height:16px;border-radius:50%;background:#2563eb;border:3px solid white;box-shadow:0 2px 8px rgba(37,99,235,0.45);display:flex;align-items:center;justify-content:center;">
              <div style="width:4px;height:4px;border-radius:50%;background:white;"></div>
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      const userMarker = L.marker([uLat, uLng], {
        icon: userIcon,
        zIndexOffset: 1000,
      });

      userMarker.bindPopup(`
        <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;padding:6px;min-width:190px;font-size:12px;">
          <div style="display:inline-flex;align-items:center;gap:4px;padding:2px 7px;border-radius:10px;background:#dbeafe;color:#1e40af;font-size:10px;font-weight:700;text-transform:uppercase;">
            <span>🎯 Your Real-Time Position</span>
          </div>
          <h4 style="margin:5px 0 2px 0;font-weight:600;font-size:13px;color:#1d1d1f;">
            ${userLocation.displayName || userLocation.city}
          </h4>
          <p style="margin:0 0 5px 0;color:#6e6e73;font-size:11px;">
            ${uLat.toFixed(5)}° N, ${uLng.toFixed(5)}° E
          </p>
          <div style="padding-top:4px;border-top:1px solid #f3f4f6;font-size:11px;color:#2563eb;font-weight:600;">
            Precision Radius: ±${Math.round(userLocation.accuracy || 15)}m
          </div>
        </div>
      `);

      group.addLayer(userMarker);
      userMarkerRef.current = userMarker;
    }

    // 2. Community Fridges (Emerald Pin 🧊)
    fridges.forEach((fridge) => {
      if (!fridge.latitude || !fridge.longitude) return;

      const isSelected = selectedItem?.id === fridge.id;
      const fridgeIcon = L.divIcon({
        className: "custom-map-fridge-pin",
        html: `
          <div style="
            display:flex;align-items:center;justify-content:center;
            width:${isSelected ? "40px" : "32px"};
            height:${isSelected ? "40px" : "32px"};
            background:${isSelected ? "#065f46" : "#047857"};
            color:white;border-radius:50%;
            box-shadow:0 ${isSelected ? "6px 16px rgba(6,95,70,0.45)" : "3px 10px rgba(0,0,0,0.25)"};
            border:${isSelected ? "3px solid white" : "2px solid white"};
            cursor:pointer;
            transition:transform 0.2s ease;
            font-size:${isSelected ? "18px" : "15px"};
          ">
            🧊
          </div>
        `,
        iconSize: isSelected ? [40, 40] : [32, 32],
        iconAnchor: isSelected ? [20, 20] : [16, 16],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([fridge.latitude, fridge.longitude], {
        icon: fridgeIcon,
      });

      marker.on("click", () => {
        onSelectFridge(fridge);
      });

      marker.bindPopup(`
        <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;padding:6px;min-width:180px;font-size:12px;">
          <div style="display:inline-block;padding:2px 6px;border-radius:10px;background:#d1fae5;color:#065f46;font-size:10px;font-weight:600;text-transform:uppercase;">
            Community Fridge
          </div>
          <h4 style="margin:4px 0 2px 0;font-weight:600;font-size:13px;color:#1d1d1f;">${fridge.name}</h4>
          <p style="margin:0 0 6px 0;color:#6e6e73;font-size:11px;">${fridge.address} • ${fridge.city}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;padding-top:6px;border-top:1px solid #f3f4f6;font-size:11px;">
            <span style="color:#047857;font-weight:600;">Stock: ${fridge.inventoryLevel}</span>
            <span style="color:#6e6e73;">${fridge.operatingHours}</span>
          </div>
        </div>
      `);

      group.addLayer(marker);
    });

    // 3. Food Surplus Listings (Amber Pin 🍱)
    listings.forEach((listing) => {
      if (!listing.latitude || !listing.longitude) return;

      const isSelected = selectedItem?.id === listing.id;
      const listingIcon = L.divIcon({
        className: "custom-map-listing-pin",
        html: `
          <div style="
            display:flex;align-items:center;justify-content:center;
            width:${isSelected ? "40px" : "32px"};
            height:${isSelected ? "40px" : "32px"};
            background:${isSelected ? "#b45309" : "#d97706"};
            color:white;border-radius:50%;
            box-shadow:0 ${isSelected ? "6px 16px rgba(180,83,9,0.45)" : "3px 10px rgba(0,0,0,0.25)"};
            border:${isSelected ? "3px solid white" : "2px solid white"};
            cursor:pointer;
            transition:transform 0.2s ease;
            font-size:${isSelected ? "18px" : "15px"};
          ">
            🍱
          </div>
        `,
        iconSize: isSelected ? [40, 40] : [32, 32],
        iconAnchor: isSelected ? [20, 20] : [16, 16],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([listing.latitude, listing.longitude], {
        icon: listingIcon,
      });

      marker.on("click", () => {
        onSelectListing(listing);
      });

      marker.bindPopup(`
        <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;padding:6px;min-width:180px;font-size:12px;">
          <div style="display:inline-block;padding:2px 6px;border-radius:10px;background:#fef3c7;color:#92400e;font-size:10px;font-weight:600;text-transform:uppercase;">
            Surplus Donation
          </div>
          <h4 style="margin:4px 0 2px 0;font-weight:600;font-size:13px;color:#1d1d1f;">${listing.title}</h4>
          <p style="margin:0 0 4px 0;color:#6e6e73;font-size:11px;">From: ${listing.donorName} • ${listing.donorCity}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;padding-top:6px;border-top:1px solid #f3f4f6;font-size:11px;">
            <span style="color:#047857;font-weight:700;">${listing.price === 0 ? "100% Free" : `₹${listing.price}`}</span>
            <span style="color:#6e6e73;">Pickup: ${listing.pickupStartTime}-${listing.pickupEndTime}</span>
          </div>
        </div>
      `);

      group.addLayer(marker);
    });
  }, [fridges, listings, selectedItem, userLocation, onSelectFridge, onSelectListing]);

  const handleRecenter = () => {
    if (userLocation && userLocation.latitude && userLocation.longitude && mapRef.current) {
      mapRef.current.flyTo([userLocation.latitude, userLocation.longitude], 16, {
        animate: true,
        duration: 0.8,
      });
      if (userMarkerRef.current) {
        userMarkerRef.current.openPopup();
      }
      onRecenterUser?.();
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls: Zoom & Recenter on User GPS */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-1.5 shadow-md rounded-xl overflow-hidden bg-white/95 backdrop-blur-md border border-black/[0.08]">
        {/* Recenter to User GPS */}
        {userLocation && (
          <>
            <button
              type="button"
              onClick={handleRecenter}
              title="Center on my exact location"
              aria-label="Center on my location"
              className="w-8 h-8 flex items-center justify-center text-[#2563eb] hover:bg-blue-50 transition cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
              </svg>
            </button>
            <div className="h-[1px] bg-black/[0.08]" />
          </>
        )}

        <button
          type="button"
          onClick={() => mapRef.current?.zoomIn()}
          aria-label="Zoom in"
          className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#1d1d1f] hover:bg-black/[0.05] transition cursor-pointer"
        >
          +
        </button>
        <div className="h-[1px] bg-black/[0.08]" />
        <button
          type="button"
          onClick={() => mapRef.current?.zoomOut()}
          aria-label="Zoom out"
          className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#1d1d1f] hover:bg-black/[0.05] transition cursor-pointer"
        >
          −
        </button>
      </div>
    </div>
  );
}
