import { Sheet } from "components/fullscreen-sheet";
import { DeliveryLocationPicker } from "components/delivery-location-picker";
import { ListItem } from "components/list-item";
import { useLiveLocation } from "hooks";
import { debounce } from "lodash";
import React, { FC, useCallback, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { deliveryAddressState, requestLocationTriesState } from "state";
import { AddressSuggestion, reverseGeocode, searchAddress } from "utils/location";
import { Box, Button, Icon, Input, Text } from "components/ui";

export const DeliveryAddressPicker: FC = () => {
  const [address, setAddress] = useRecoilState(deliveryAddressState);
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState(address);
  const [liveActive, setLiveActive] = useState(false);
  const setRequestLocationTries = useSetRecoilState(requestLocationTriesState);
  const { location, loading } = useLiveLocation(liveActive, 5000);
  const editedSinceMoveRef = useRef(false);
  const [geocoding, setGeocoding] = useState(false);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [flyTarget, setFlyTarget] = useState<{
    lat: number;
    long: number;
    key: number;
  } | null>(null);

  const close = () => {
    setVisible(false);
    setLiveActive(false);
    setQuery("");
    setSuggestions([]);
  };

  const handleCenterChange = async ({ lat, long }: { lat: number; long: number }) => {
    editedSinceMoveRef.current = false;
    setGeocoding(true);
    const result = await reverseGeocode(lat, long);
    setGeocoding(false);
    if (result && !editedSinceMoveRef.current) {
      setDraft(result);
    }
  };

  const runSearch = useCallback(
    debounce(async (q: string) => {
      if (!q.trim()) {
        setSuggestions([]);
        setSearching(false);
        return;
      }
      setSearching(true);
      const results = await searchAddress(q);
      setSearching(false);
      setSuggestions(results);
    }, 400),
    [],
  );

  const selectSuggestion = (suggestion: AddressSuggestion) => {
    editedSinceMoveRef.current = false;
    setDraft(suggestion.displayName);
    setQuery("");
    setSuggestions([]);
    setFlyTarget({
      lat: suggestion.lat,
      long: suggestion.long,
      key: Date.now(),
    });
  };

  const requestLocation = () => {
    setLiveActive(true);
    setRequestLocationTries((r) => r + 1);
  };

  return (
    <>
      <ListItem
        onClick={() => {
          setDraft(address);
          setVisible(true);
        }}
        title={address || "Nhập địa chỉ giao hàng"}
        subtitle="Địa chỉ giao hàng"
      />
      <Sheet title="Địa chỉ giao hàng" visible={visible} onClose={close} height="92vh" unmountOnClose>
        <Box className="flex flex-col flex-1 min-h-0">
          <Box className="relative px-4 pb-2 flex-none">
            <Input.Search
              value={query}
              onChange={(e) => {
                const value = e.currentTarget.value;
                setQuery(value);
                runSearch(value);
              }}
              placeholder="Tìm kiếm địa chỉ..."
              clearable
              allowClear
            />
            {query.trim() !== "" && (suggestions.length > 0 || searching) && (
              <Box className="absolute left-4 right-4 top-full z-[1100] bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searching && (
                  <Text size="xSmall" className="text-gray p-3">
                    Đang tìm...
                  </Text>
                )}
                {!searching &&
                  suggestions.map((suggestion, index) => (
                    <Box
                      key={`${suggestion.lat}-${suggestion.long}-${index}`}
                      flex
                      className="items-start space-x-2 px-3 py-2 border-b last:border-b-0 border-black/5"
                      onClick={() => selectSuggestion(suggestion)}
                    >
                      <Icon icon="zi-location" className="mt-[2px] text-gray" />
                      <Text size="small" className="flex-1">
                        {suggestion.displayName}
                      </Text>
                    </Box>
                  ))}
              </Box>
            )}
          </Box>
          <Box className="relative flex-1 min-h-0">
            <DeliveryLocationPicker
              liveLocation={location}
              locating={liveActive && loading && !location}
              onRequestLocation={requestLocation}
              onCenterChange={handleCenterChange}
              flyTo={flyTarget}
              height="100%"
            />
          </Box>
          <Box className="space-y-3 p-4 flex-none">
            <Box className="relative">
              <Input
                placeholder="Nhập địa chỉ giao hàng"
                value={draft}
                onChange={(e) => {
                  editedSinceMoveRef.current = true;
                  setDraft(e.currentTarget.value);
                }}
              />
              {geocoding && (
                <Text size="xSmall" className="absolute right-2 top-2 text-gray">
                  Đang tìm địa chỉ...
                </Text>
              )}
            </Box>
            <Button
              variant="primary"
              type="highlight"
              fullWidth
              disabled={!draft.trim()}
              onClick={() => {
                setAddress(draft.trim());
                close();
              }}
            >
              Lưu
            </Button>
          </Box>
        </Box>
      </Sheet>
    </>
  );
};
