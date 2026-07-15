import { getLocation } from "zmp-sdk";
import { wait } from "./async";

export async function fetchLocationOnce(): Promise<
  { latitude: string; longitude: string } | false
> {
  try {
    const { latitude, longitude, token } = await getLocation({
      fail: console.warn,
    });
    if (latitude && longitude) {
      return { latitude, longitude };
    }
    if (token) {
      console.warn(
        "Sử dụng token này để truy xuất vị trí chính xác của người dùng",
        token
      );
      console.warn(
        "Chi tiết tham khảo: ",
        "https://mini.zalo.me/blog/thong-bao-thay-doi-luong-truy-xuat-thong-tin-nguoi-dung-tren-zalo-mini-app"
      );
      console.warn("Giả lập vị trí mặc định: VNG Campus");
      return {
        latitude: "10.7287",
        longitude: "106.7317",
      };
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// Nominatim's usage policy caps public requests at ~1/sec; this throttle
// keeps reverse/forward geocode calls (drag-end, search-as-you-type) under
// that ceiling, shared across both request types.
const NOMINATIM_MIN_INTERVAL_MS = 1100;
let lastNominatimRequestAt = 0;

async function throttleNominatim() {
  const elapsed = Date.now() - lastNominatimRequestAt;
  if (elapsed < NOMINATIM_MIN_INTERVAL_MS) {
    await wait(NOMINATIM_MIN_INTERVAL_MS - elapsed);
  }
  lastNominatimRequestAt = Date.now();
}

export async function reverseGeocode(
  lat: number,
  long: number
): Promise<string | null> {
  await throttleNominatim();

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}`
    );
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data?.display_name ?? null;
  } catch (error) {
    console.warn("Reverse geocode lỗi", error);
    return null;
  }
}

export interface AddressSuggestion {
  displayName: string;
  lat: number;
  long: number;
}

export async function searchAddress(
  query: string
): Promise<AddressSuggestion[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  await throttleNominatim();

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
        trimmed
      )}&countrycodes=vn&limit=5`
    );
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    return (data ?? []).map((item: { display_name: string; lat: string; lon: string }) => ({
      displayName: item.display_name,
      lat: Number(item.lat),
      long: Number(item.lon),
    }));
  } catch (error) {
    console.warn("Tìm địa chỉ lỗi", error);
    return [];
  }
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

export function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export function displayDistance(d) {
  return `${d.toFixed(1)} km`; // Return distance with 2 decimal places
}
