import Taro from "@tarojs/taro";
import { Map } from "@tarojs/components";
import React, { FC, useEffect, useMemo, useRef } from "react";
import { Store } from "types/delivery";
import markerIcon from "static/marker-icon.png";

export interface StoreMapProps {
  stores: (Store & { distance?: number })[];
  userLocation?: { latitude: string | number; longitude: string | number };
  selectedStoreId?: number;
  onSelectStore: (index: number) => void;
  onMapClick?: () => void;
  height?: number | string;
  // Note: Taro/WeChat's native <Map> doesn't expose per-gesture toggles the
  // way Leaflet did (dragging/zoomControl/touchZoom/doubleClickZoom), so
  // `compact` no longer disables interaction — the map stays fully
  // interactive in both modes. See report for details.
  compact?: boolean;
}

const MAP_ID = "storeMap";

export const StoreMap: FC<StoreMapProps> = ({
  stores,
  userLocation,
  selectedStoreId,
  onSelectStore,
  onMapClick,
  height = 260,
}) => {
  const didFit = useRef(false);

  const markers = useMemo(() => {
    const storeMarkers = stores.map((store, index) => ({
      id: index,
      latitude: store.lat,
      longitude: store.long,
      iconPath: markerIcon,
      width: 25,
      height: 41,
      callout: {
        content: store.name,
        display: "BYCLICK" as const,
      },
    }));
    if (userLocation) {
      // Native map markers have no CSS divIcon equivalent — reuse the same
      // pin asset for the user's own location, distinguished only by its
      // callout text (visual simplification vs. the original's styled dot).
      storeMarkers.push({
        id: -1,
        latitude: Number(userLocation.latitude),
        longitude: Number(userLocation.longitude),
        iconPath: markerIcon,
        width: 25,
        height: 41,
        callout: {
          content: "Vị trí của bạn",
          display: "BYCLICK" as const,
        },
      });
    }
    return storeMarkers;
  }, [stores, userLocation]);

  const center = {
    latitude: stores[0]?.lat ?? 10.7970481,
    longitude: stores[0]?.long ?? 106.647743,
  };

  useEffect(() => {
    if (didFit.current) return;
    // Focus tightly on the selected store (falling back to the first store)
    // plus the user's location, rather than fitting all stores — otherwise a
    // far-away store zooms the map out to a city/country-wide view.
    const focusStore =
      stores.find((store) => store.id === selectedStoreId) ?? stores[0];
    if (!focusStore) return;
    didFit.current = true;
    const points = [{ latitude: focusStore.lat, longitude: focusStore.long }];
    if (userLocation) {
      points.push({
        latitude: Number(userLocation.latitude),
        longitude: Number(userLocation.longitude),
      });
    }
    // Taro's H5 platform has no native map context — createMapContext is a
    // "temporarily not supported" stub there that returns a rejected promise
    // instead of a real context, so only weapp gets a usable `includePoints`.
    // Guard both shapes: call it when available, and swallow the H5 stub's
    // rejection so it doesn't surface as an unhandled promise rejection.
    const ctx = Taro.createMapContext(MAP_ID);
    if (typeof ctx?.includePoints === "function") {
      ctx.includePoints({ points, padding: [24, 24, 24, 24] });
    } else if (typeof (ctx as unknown as Promise<unknown>)?.catch === "function") {
      (ctx as unknown as Promise<unknown>).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stores, userLocation, selectedStoreId]);

  return (
    <Map
      id={MAP_ID}
      longitude={center.longitude}
      latitude={center.latitude}
      scale={16}
      markers={markers as any}
      onError={(event) => console.error("Map error", event)}
      onTap={onMapClick}
      onMarkerTap={(event) => {
        const markerId = Number(event.detail.markerId);
        if (markerId >= 0) {
          onSelectStore(markerId);
        }
      }}
      style={{ width: "100%", height }}
    />
  );
};
