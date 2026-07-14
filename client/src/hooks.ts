import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { matchStatusBarColor } from "utils/device";
import { fetchLocationOnce } from "utils/location";
import { EventName, events, Payment } from "zmp-sdk";
import { useNavigate, useSnackbar } from "zmp-ui";

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

const originalScreenHeight = window.innerHeight;

export function useVirtualKeyboardVisible() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const detectKeyboardOpen = () => {
      setVisible(window.innerHeight + 160 < originalScreenHeight);
    };
    window.addEventListener("resize", detectKeyboardOpen);
    return () => {
      window.removeEventListener("resize", detectKeyboardOpen);
    };
  }, []);

  return visible;
}

export const useHandlePayment = () => {
  const navigate = useNavigate();
  useEffect(() => {
    events.on(EventName.OpenApp, (data) => {
      if (data?.path) {
        navigate(data?.path, {
          state: data,
        });
      }
    });

    events.on(EventName.OnDataCallback, (resp) => {
      const { appTransID, eventType } = resp;
      if (appTransID || eventType === "PAY_BY_CUSTOM_METHOD") {
        navigate("/result", {
          state: resp,
        });
      }
    });

    events.on(EventName.PaymentClose, (data = {}) => {
      const { zmpOrderId } = data;
      navigate("/result", {
        state: { data: { zmpOrderId } },
      });
    });
  }, []);
};

// Polls zmp-sdk's one-shot getLocation() on an interval to approximate
// realtime tracking (zmp-sdk 2.39.9 has no watch/subscribe location API).
// `active` is the only gate and must be driven by a user tap upstream —
// this hook never requests location on its own.
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
  const snackbar = useSnackbar();
  return () =>
    snackbar.openSnackbar({
      type: "success",
      text: "Chức năng dành cho các bên tích hợp phát triển...",
    });
}
