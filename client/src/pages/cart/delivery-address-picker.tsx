import { Sheet } from "components/fullscreen-sheet";
import { DeliveryLocationPicker } from "components/delivery-location-picker";
import { ListItem } from "components/list-item";
import { useLiveLocation } from "hooks";
import React, { FC, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { deliveryAddressState, requestLocationTriesState } from "state";
import { reverseGeocode } from "utils/location";
import { Box, Button, Input, Text } from "zmp-ui";

export const DeliveryAddressPicker: FC = () => {
  const [address, setAddress] = useRecoilState(deliveryAddressState);
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState(address);
  const [liveActive, setLiveActive] = useState(false);
  const setRequestLocationTries = useSetRecoilState(requestLocationTriesState);
  const { location, loading } = useLiveLocation(visible && liveActive, 5000);
  const editedSinceMoveRef = useRef(false);
  const [geocoding, setGeocoding] = useState(false);

  const close = () => {
    setVisible(false);
    setLiveActive(false);
  };

  const handleCenterChange = async ({
    lat,
    long,
  }: {
    lat: number;
    long: number;
  }) => {
    editedSinceMoveRef.current = false;
    setGeocoding(true);
    const result = await reverseGeocode(lat, long);
    setGeocoding(false);
    if (result && !editedSinceMoveRef.current) {
      setDraft(result);
    }
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
      {createPortal(
        <Sheet
          title="Địa chỉ giao hàng"
          visible={visible}
          onClose={close}
          autoHeight
        >
          <Box className="space-y-3" p={4}>
            {!liveActive && (
              <ListItem
                onClick={() => {
                  setLiveActive(true);
                  setRequestLocationTries((r) => r + 1);
                }}
                title="Dùng vị trí hiện tại"
                subtitle="Chọn vị trí giao hàng trên bản đồ"
              />
            )}
            {liveActive && loading && !location && (
              <Text size="xSmall" className="text-gray">
                Đang xác định vị trí của bạn...
              </Text>
            )}
            {liveActive && location && (
              <DeliveryLocationPicker
                liveLocation={location}
                onCenterChange={handleCenterChange}
              />
            )}
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
                <Text
                  size="xSmall"
                  className="absolute right-2 top-2 text-gray"
                >
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
        </Sheet>,
        document.body,
      )}
    </>
  );
};
