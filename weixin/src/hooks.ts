import Taro from "@tarojs/taro";
import { useEffect, useRef, useState } from "react";
import { matchStatusBarColor } from "utils/device";
import { fetchLocationOnce } from "utils/location";

export function useMatchStatusTextColor(visible?: boolean) {
  const changedRef = useRef(false);
  useEffect(() => {
    if (changedRef.current) {
      matchStatusBarColor(visible ?? false);
    } else {
      changedRef.current = true;
    }
  }, [visible]);
}

export function useVirtualKeyboardVisible() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleKeyboardHeightChange = (res: { height: number }) => {
      setVisible(res.height > 0);
    };
    Taro.onKeyboardHeightChange(handleKeyboardHeightChange);
    return () => {
      Taro.offKeyboardHeightChange(handleKeyboardHeightChange);
    };
  }, []);

  return visible;
}

// Polls Taro.getLocation() on an interval to approximate realtime tracking.
// `active` is the only gate and must be driven by a user tap upstream — this
// hook never requests location on its own.
export function useLiveLocation(active: boolean, intervalMs = 5000) {
  const [location, setLocation] = useState<{
    latitude: string;
    longitude: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const hasFixRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;

    const poll = async () => {
      setLoading(!hasFixRef.current);
      const result = await fetchLocationOnce();
      if (cancelled) return;
      setLoading(false);
      if (result) {
        hasFixRef.current = true;
        setLocation(result);
      }
    };

    poll();
    const id = setInterval(poll, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [active, intervalMs]);

  return { location, loading };
}

export function useToBeImplemented() {
  return () =>
    Taro.showToast({
      title: "Chức năng dành cho các bên tích hợp phát triển...",
      icon: "none",
    });
}
