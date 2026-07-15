import Taro from "@tarojs/taro";
import { Image, Map, View } from "@tarojs/components";
import React, { FC, useEffect, useRef, useState } from "react";
import { Icon } from "components/ui";
import markerIcon from "static/marker-icon.png";

const DEFAULT_CENTER = { latitude: 10.7970481, longitude: 106.647743 };
const MIN_SCALE = 3;
const MAX_SCALE = 20;
const MAP_ID = "deliveryLocationPickerMap";

export interface DeliveryLocationPickerProps {
  liveLocation?: { latitude: string; longitude: string } | null;
  /** True while a GPS fix has been requested but hasn't arrived yet. */
  locating?: boolean;
  /** Called when the user taps the locate button and there's no fix yet. */
  onRequestLocation: () => void;
  onCenterChange: (center: { lat: number; long: number }) => void;
  /** Bumping `key` flies the map to {lat, long}, e.g. after picking a search suggestion. */
  flyTo?: { lat: number; long: number; key: number } | null;
  height?: number | string;
}

export const DeliveryLocationPicker: FC<DeliveryLocationPickerProps> = ({
  liveLocation,
  locating = false,
  onRequestLocation,
  onCenterChange,
  flyTo,
  height = 220,
}) => {
  const [scale, setScale] = useState(16);
  const ctxRef = useRef<Taro.MapContext | null>(null);
  const hasFlownRef = useRef(false);

  useEffect(() => {
    ctxRef.current = Taro.createMapContext(MAP_ID);
  }, []);

  // Bumping `flyTo.key` flies the map to {lat, long} — same trigger pattern
  // as the original's Leaflet `flyTo`.
  useEffect(() => {
    if (flyTo) {
      ctxRef.current?.moveToLocation({
        longitude: flyTo.long,
        latitude: flyTo.lat,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyTo?.key]);

  // Flies to the user's location the first time a fix arrives after being
  // requested, without re-centering on every subsequent 5s poll tick (which
  // would fight the user's own map exploration).
  useEffect(() => {
    if (!liveLocation) {
      hasFlownRef.current = false;
      return;
    }
    if (hasFlownRef.current) {
      return;
    }
    hasFlownRef.current = true;
    ctxRef.current?.moveToLocation({
      longitude: Number(liveLocation.longitude),
      latitude: Number(liveLocation.latitude),
    });
  }, [liveLocation]);

  const handleRegionChange = (event: any) => {
    const { type, causedBy } = event.detail;
    if (type === "end" && causedBy === "drag") {
      ctxRef.current?.getCenterLocation({
        success: ({ longitude, latitude }) => {
          onCenterChange({ lat: latitude, long: longitude });
        },
      });
    }
  };

  const markers = liveLocation
    ? [
        {
          id: 0,
          latitude: Number(liveLocation.latitude),
          longitude: Number(liveLocation.longitude),
          iconPath: markerIcon,
          width: 25,
          height: 41,
          callout: {
            content: "Vị trí của bạn",
            display: "BYCLICK" as const,
          },
        },
      ]
    : [];

  return (
    <View className="relative overflow-hidden" style={{ height }}>
      <Map
        id={MAP_ID}
        longitude={DEFAULT_CENTER.longitude}
        latitude={DEFAULT_CENTER.latitude}
        scale={scale}
        markers={markers as any}
        onError={(event) => console.error("Map error", event)}
        onRegionChange={handleRegionChange}
        style={{ width: "100%", height: "100%" }}
      />

      {/* Fixed center pin: purely visual. Taro's Map is always rendered as a
          native platform layer on top of regular Views regardless of
          z-index/DOM order, so — unlike the Leaflet original, which needed
          pointer-events-none plus a z-index fight against Leaflet's own
          panes — this View never intercepts the map's drag gestures and
          needs no special handling. */}
      <View className="absolute inset-0 z-[1000] flex items-center justify-center -mt-5">
        <Image src={markerIcon} className="w-[25px] h-[41px]" mode="aspectFit" />
      </View>

      {/* Floating controls, Grab/Shopee-style. There's no zoomIn/zoomOut
          method on Taro's MapContext — zoom is purely the controlled `scale`
          prop, so the buttons mutate local state instead. */}
      <View className="absolute right-2 bottom-2 z-[1000] flex flex-col items-center gap-2">
        <View
          className="bg-white rounded-full shadow p-2"
          onClick={() => setScale((s) => Math.min(MAX_SCALE, s + 1))}
          aria-label="Phóng to"
        >
          <Icon icon="zi-plus-circle" />
        </View>
        <View
          className="bg-white rounded-full shadow p-2"
          onClick={() => setScale((s) => Math.max(MIN_SCALE, s - 1))}
          aria-label="Thu nhỏ"
        >
          <Icon icon="zi-minus-circle" />
        </View>
        <View
          className="bg-white rounded-full shadow p-2"
          onClick={() => {
            if (liveLocation) {
              ctxRef.current?.moveToLocation({
                longitude: Number(liveLocation.longitude),
                latitude: Number(liveLocation.latitude),
              });
            } else {
              onRequestLocation();
            }
          }}
          aria-label="Vị trí của tôi"
        >
          {locating ? (
            <View className="block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <Icon icon="zi-location" />
          )}
        </View>
      </View>
    </View>
  );
};
