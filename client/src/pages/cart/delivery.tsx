import { ElasticTextarea } from "components/elastic-textarea";
import { ListRenderer } from "components/list-renderer";
import React, { FC, Suspense } from "react";
import { Box, Icon, Radio, Text } from "zmp-ui";
import { DeliveryAddressPicker } from "./delivery-address-picker";
import { PersonPicker, RequestPersonPickerPhone } from "./person-picker";
import { RequestStorePickerLocation, StorePicker } from "./store-picker";
import { TimePicker } from "./time-picker";
import { useRecoilState } from "recoil";
import { fulfillmentTypeState, orderNoteState } from "state";

export const Delivery: FC = () => {
  const [note, setNote] = useRecoilState(orderNoteState);
  const [fulfillmentType, setFulfillmentType] = useRecoilState(
    fulfillmentTypeState,
  );

  return (
    <Box className="space-y-3 px-4">
      <Text.Header>Hình thức nhận hàng</Text.Header>
      <Radio.Group
        className="grid grid-cols-2"
        name="fulfillmentType"
        options={[
          { value: "pickup", label: "Tự đến lấy" },
          { value: "delivery", label: "Giao hàng" },
        ]}
        value={fulfillmentType}
        onChange={(value: string) =>
          setFulfillmentType(value as "pickup" | "delivery")
        }
      />
      <ListRenderer
        items={[
          {
            left: <Icon icon="zi-location" className="my-auto" />,
            right:
              fulfillmentType === "delivery" ? (
                <DeliveryAddressPicker />
              ) : (
                <Suspense fallback={<RequestStorePickerLocation />}>
                  <StorePicker />
                </Suspense>
              ),
          },
          {
            left: <Icon icon="zi-clock-1" className="my-auto" />,
            right: (
              <Box flex className="space-x-2">
                <Box className="flex-1 space-y-[2px]">
                  <TimePicker />
                  <Text size="xSmall" className="text-gray">
                    Thời gian nhận hàng
                  </Text>
                </Box>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
          {
            left: <Icon icon="zi-user" className="my-auto" />,
            right: <RequestPersonPickerPhone />,
          },
          {
            left: <Icon icon="zi-note" className="my-auto" />,
            right: (
              <Box flex>
                <ElasticTextarea
                  placeholder="Nhập ghi chú..."
                  className="border-none px-0 w-full focus:outline-none"
                  maxRows={4}
                  value={note}
                  onChange={(e) => setNote(e.currentTarget.value)}
                />
              </Box>
            ),
          },
        ]}
        limit={4}
        renderLeft={(item) => item.left}
        renderRight={(item) => item.right}
      />
    </Box>
  );
};
