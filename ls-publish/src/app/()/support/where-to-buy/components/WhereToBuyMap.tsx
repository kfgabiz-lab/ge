"use client";

import { useEffect, useRef, useState } from "react";
import type { WhereToBuyLocation } from "@/data/support/whereToBuyContent";
import { whereToBuyPage } from "@/data/support/whereToBuyContent";
import {
  getGoogleMapsApiKey,
  loadGoogleMaps,
} from "@/lib/googleMaps/loadGoogleMaps";
import WhereToBuyMapPlaceholder from "./WhereToBuyMapPlaceholder";

type WhereToBuyMapProps = {
  locations: WhereToBuyLocation[];
  activeLocation: WhereToBuyLocation;
  onLocationSelect?: (locationId: string) => void;
};

const mapFillStyle = {
  width: "100%",
  height: "100%",
  minHeight: "inherit",
} as const;

const MOBILE_MAP_MAX_WIDTH = 780;

function useMobileMapPlaceholder() {
  const [usePlaceholder, setUsePlaceholder] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_MAP_MAX_WIDTH}px)`);
    const sync = () => setUsePlaceholder(mediaQuery.matches);

    sync();
    mediaQuery.addEventListener("change", sync);

    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  return usePlaceholder;
}

export default function WhereToBuyMap({
  locations,
  activeLocation,
  onLocationSelect,
}: WhereToBuyMapProps) {
  const apiKey = getGoogleMapsApiKey();
  const usePlaceholder = useMobileMapPlaceholder();
  const mapCanvasRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (usePlaceholder || !apiKey || !mapCanvasRef.current) {
      return;
    }

    let cancelled = false;

    loadGoogleMaps(apiKey)
      .then((maps) => {
        if (cancelled || !mapCanvasRef.current) {
          return;
        }

        const bounds = new maps.LatLngBounds();
        locations.forEach((location) => {
          bounds.extend({ lat: location.lat, lng: location.lng });
        });

        const map = new maps.Map(mapCanvasRef.current, {
          center: whereToBuyPage.mapDefaultCenter,
          zoom: whereToBuyPage.mapDefaultZoom,
          disableDefaultUI: true,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: false,
          streetViewControl: false,
          gestureHandling: "greedy",
        });

        if (locations.length > 1) {
          map.fitBounds(bounds);
        }

        mapRef.current = map;
        setMapReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setMapError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey, locations, usePlaceholder]);

  useEffect(() => {
    if (usePlaceholder) {
      return;
    }

    const map = mapRef.current;
    if (!mapReady || !map || !window.google?.maps) {
      return;
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const maps = window.google.maps;

    locations.forEach((location) => {
      const isActive = location.id === activeLocation.id;
      const isBrand = Boolean(location.brandPin);
      const iconUrl = isBrand
        ? whereToBuyPage.mapBrandPinImage
        : whereToBuyPage.mapPinImage;

      const marker = new maps.Marker({
        map,
        position: { lat: location.lat, lng: location.lng },
        title: location.name,
        zIndex: isActive ? 3 : 1,
        icon: {
          url: iconUrl,
          scaledSize: new maps.Size(isBrand ? 34 : 24, isBrand ? 48 : 34),
          anchor: new maps.Point(isBrand ? 17 : 12, isBrand ? 48 : 34),
        },
      });

      marker.addListener("click", () => {
        onLocationSelect?.(location.id);
      });

      markersRef.current.push(marker);
    });

    map.panTo({ lat: activeLocation.lat, lng: activeLocation.lng });
    map.setZoom(whereToBuyPage.mapActiveZoom);
  }, [activeLocation, locations, mapReady, onLocationSelect, usePlaceholder]);

  if (usePlaceholder) {
    return (
      <WhereToBuyMapPlaceholder
        ariaLabel={`Map showing distributor locations near ${activeLocation.name}`}
      />
    );
  }

  if (!apiKey || mapError) {
    return (
      <div
        style={mapFillStyle}
        role="img"
        aria-label={`Map showing distributor locations near ${activeLocation.name}`}
      />
    );
  }

  return (
    <div className="support_where_to_buy_map" style={mapFillStyle}>
      <div
        ref={mapCanvasRef}
        className="support_where_to_buy_map__canvas"
        style={mapFillStyle}
        role="application"
        aria-label={`Map showing distributor locations near ${activeLocation.name}`}
      />
    </div>
  );
}
