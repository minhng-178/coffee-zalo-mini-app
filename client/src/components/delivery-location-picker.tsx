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

export interface DeliveryLocationPickerProps {
  liveLocation?: { latitude: string; longitude: string } | null;
  onCenterChange: (center: { lat: number; long: number }) => void;
  height?: number | string;
}

export const DeliveryLocationPicker: FC<DeliveryLocationPickerProps> = ({
  liveLocation,
  onCenterChange,
  height = 220,
}) => {
  const mapRef = useRef<L.Map | null>(null);

  return (
    <div className="relative rounded-lg overflow-hidden" style={{ height }}>
      <MapContainer
        center={
          liveLocation
            ? [Number(liveLocation.latitude), Number(liveLocation.longitude)]
            : [10.7970481, 106.647743]
        }
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController mapRef={mapRef} />
        <CenterTracker onMoveEnd={onCenterChange} />
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

      {liveLocation && (
        <button
          type="button"
          className="absolute right-2 bottom-2 z-[1000] bg-white rounded-full shadow p-2"
          onClick={() => {
            const { latitude, longitude } = liveLocation;
            mapRef.current?.flyTo(
              [Number(latitude), Number(longitude)],
              mapRef.current.getZoom()
            );
          }}
        >
          <Icon icon="zi-location" />
        </button>
      )}
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
