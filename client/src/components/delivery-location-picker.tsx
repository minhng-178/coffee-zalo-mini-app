import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import React, { FC, useEffect, useRef } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { userIcon } from "components/store-map";
import { Icon } from "zmp-ui";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER: [number, number] = [10.7970481, 106.647743];

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
  const mapRef = useRef<L.Map | null>(null);

  return (
    <div className="relative overflow-hidden" style={{ height }}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={16}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController mapRef={mapRef} />
        <CenterTracker onMoveEnd={onCenterChange} />
        <FlyToTarget mapRef={mapRef} target={flyTo} />
        <FlyToFirstFix mapRef={mapRef} liveLocation={liveLocation} />
        {liveLocation && (
          <Marker
            position={[
              Number(liveLocation.latitude),
              Number(liveLocation.longitude),
            ]}
            icon={userIcon}
          >
            <Popup>Vị trí của bạn</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Fixed center pin: purely visual (pointer-events-none) so it never
          steals touch/drag gestures from Leaflet's own pan handling — same
          reasoning as MapClickHandler in store-map.tsx, listening on the map
          instance instead of fighting it for the same gesture. Needs an
          explicit z-index: Leaflet's internal panes (marker pane is z-index
          600) otherwise paint over a plain z-index:auto sibling regardless
          of DOM order. */}
      <div className="pointer-events-none absolute inset-0 z-[1000] flex items-center justify-center -mt-5">
        <img src={markerIcon} className="w-[25px] h-[41px]" alt="" />
      </div>

      {/* Floating controls, Grab/Shopee-style: custom round buttons instead
          of Leaflet's default top-left zoom control (disabled above via
          zoomControl={false}). Pinch-to-zoom stays on (touchZoom defaults
          to true). */}
      <div className="absolute right-2 bottom-2 z-[1000] flex flex-col items-center gap-2">
        <button
          type="button"
          className="bg-white rounded-full shadow p-2"
          onClick={() => mapRef.current?.zoomIn()}
          aria-label="Phóng to"
        >
          <Icon icon="zi-plus-circle" />
        </button>
        <button
          type="button"
          className="bg-white rounded-full shadow p-2"
          onClick={() => mapRef.current?.zoomOut()}
          aria-label="Thu nhỏ"
        >
          <Icon icon="zi-minus-circle" />
        </button>
        <button
          type="button"
          className="bg-white rounded-full shadow p-2"
          onClick={() => {
            if (liveLocation) {
              mapRef.current?.flyTo(
                [Number(liveLocation.latitude), Number(liveLocation.longitude)],
                mapRef.current.getZoom()
              );
            } else {
              onRequestLocation();
            }
          }}
          aria-label="Vị trí của tôi"
        >
          {locating ? (
            <span className="block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <Icon icon="zi-location" />
          )}
        </button>
      </div>
    </div>
  );
};

const MapController: FC<{
  mapRef: React.MutableRefObject<L.Map | null>;
}> = ({ mapRef }) => {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
};

const CenterTracker: FC<{
  onMoveEnd: (center: { lat: number; long: number }) => void;
}> = ({ onMoveEnd }) => {
  const map = useMapEvent("moveend", () => {
    const center = map.getCenter();
    onMoveEnd({ lat: center.lat, long: center.lng });
  });
  return null;
};

const FlyToTarget: FC<{
  mapRef: React.MutableRefObject<L.Map | null>;
  target?: { lat: number; long: number; key: number } | null;
}> = ({ mapRef, target }) => {
  useEffect(() => {
    if (target) {
      mapRef.current?.flyTo([target.lat, target.long], 16);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.key]);
  return null;
};

// Flies to the user's location the first time a fix arrives after being
// requested, without re-centering on every subsequent 5s poll tick (which
// would fight the user's own map exploration).
const FlyToFirstFix: FC<{
  mapRef: React.MutableRefObject<L.Map | null>;
  liveLocation?: { latitude: string; longitude: string } | null;
}> = ({ mapRef, liveLocation }) => {
  const hasFlownRef = useRef(false);

  useEffect(() => {
    if (!liveLocation) {
      hasFlownRef.current = false;
      return;
    }
    if (hasFlownRef.current) {
      return;
    }
    hasFlownRef.current = true;
    mapRef.current?.flyTo(
      [Number(liveLocation.latitude), Number(liveLocation.longitude)],
      16
    );
  }, [liveLocation, mapRef]);

  return null;
};
