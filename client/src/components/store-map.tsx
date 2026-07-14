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
import { Store } from "types/delivery";

// react-leaflet's bundler resolves Leaflet's default marker icon URLs relative
// to the page, which breaks under Vite. Point them at the bundled assets instead.
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const selectedStoreIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [31, 51],
  iconAnchor: [15, 51],
  popupAnchor: [1, -44],
  className: "store-map-marker--selected",
});

export const userIcon = L.divIcon({
  className: "store-map-user-marker",
  html: '<span class="store-map-user-marker__dot"></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export interface StoreMapProps {
  stores: (Store & { distance?: number })[];
  userLocation?: { latitude: string | number; longitude: string | number };
  selectedStoreId?: number;
  onSelectStore: (index: number) => void;
  onMapClick?: () => void;
  height?: number | string;
  compact?: boolean;
}

export const StoreMap: FC<StoreMapProps> = ({
  stores,
  userLocation,
  selectedStoreId,
  onSelectStore,
  onMapClick,
  height = 260,
  compact = false,
}) => {
  return (
    <MapContainer
      center={[stores[0]?.lat ?? 10.7970481, stores[0]?.long ?? 106.647743]}
      zoom={16}
      scrollWheelZoom={false}
      dragging={!compact}
      zoomControl={!compact}
      touchZoom={!compact}
      doubleClickZoom={!compact}
      style={{ height, width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds
        stores={stores}
        userLocation={userLocation}
        selectedStoreId={selectedStoreId}
      />
      {onMapClick && <MapClickHandler onClick={onMapClick} />}
      {userLocation && (
        <Marker
          position={[Number(userLocation.latitude), Number(userLocation.longitude)]}
          icon={userIcon}
        >
          <Popup>Vị trí của bạn</Popup>
        </Marker>
      )}
      {stores.map((store, index) => (
        <Marker
          key={store.id}
          position={[store.lat, store.long]}
          // Passing `icon={undefined}` (instead of omitting the prop) makes
          // react-leaflet overwrite Leaflet's default marker icon with
          // undefined, crashing Marker._initIcon — so spread it in only when set.
          {...(store.id === selectedStoreId ? { icon: selectedStoreIcon } : {})}
          eventHandlers={{ click: () => onSelectStore(index) }}
        >
          <Popup>{store.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

// Wrapping the map in a DOM `onClick` doesn't work: Leaflet stops
// propagation on its own click handling (markers, tap-to-click on touch
// devices), so the native event never bubbles up to React. Listening on
// the Leaflet map instance itself is the only click hook that reliably
// fires.
const MapClickHandler: FC<{ onClick: () => void }> = ({ onClick }) => {
  useMapEvent("click", onClick);
  return null;
};

const FitBounds: FC<
  Pick<StoreMapProps, "stores" | "userLocation" | "selectedStoreId">
> = ({ stores, userLocation, selectedStoreId }) => {
  const map = useMap();
  const didFit = useRef(false);

  useEffect(() => {
    if (didFit.current) return;
    // Focus tightly on the selected store (falling back to the first store)
    // plus the user's location, rather than fitting all stores — otherwise a
    // far-away store zooms the map out to a city/country-wide view.
    const focusStore =
      stores.find((store) => store.id === selectedStoreId) ?? stores[0];
    if (!focusStore) return;
    didFit.current = true;
    const points: L.LatLngExpression[] = [[focusStore.lat, focusStore.long]];
    if (userLocation) {
      points.push([Number(userLocation.latitude), Number(userLocation.longitude)]);
    }
    if (points.length === 1) {
      map.setView(points[0], 16);
    } else {
      map.fitBounds(L.latLngBounds(points), { padding: [24, 24], maxZoom: 16 });
    }
  }, [stores, userLocation, selectedStoreId, map]);

  return null;
};
