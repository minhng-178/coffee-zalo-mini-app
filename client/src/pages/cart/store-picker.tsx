import { Sheet } from "components/fullscreen-sheet";
import { ListItem } from "components/list-item";
import { StoreMap } from "components/store-map";
import React, { FC, useState } from "react";
import { createPortal } from "react-dom";
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from "recoil";
import {
  locationState,
  nearbyStoresState,
  requestLocationTriesState,
  selectedStoreIndexState,
  selectedStoreState,
} from "state";
import { Store } from "types/delivery";
import { displayDistance } from "utils/location";

export const StorePicker: FC = () => {
  const [visible, setVisible] = useState(false);
  const nearbyStores = useRecoilValueLoadable(nearbyStoresState);
  const location = useRecoilValue(locationState);
  const setSelectedStoreIndex = useSetRecoilState(selectedStoreIndexState);
  const selectedStore = useRecoilValue(selectedStoreState);

  if (!selectedStore) {
    return <RequestStorePickerLocation />;
  }

  const selectStore = (index: number) => {
    setSelectedStoreIndex(index);
    setVisible(false);
  };

  return (
    <>
      <ListItem
        onClick={() => setVisible(true)}
        title={selectedStore.name}
        subtitle={selectedStore.address}
      />
      <div className="rounded-lg overflow-hidden mt-2">
        <StoreMap
          stores={[selectedStore]}
          selectedStoreId={selectedStore.id}
          onSelectStore={() => setVisible(true)}
          onMapClick={() => setVisible(true)}
          height={140}
          compact
        />
      </div>
      {nearbyStores.state === "hasValue" &&
        createPortal(
          <Sheet
            title="Các cửa hàng ở gần bạn"
            visible={visible}
            onClose={() => setVisible(false)}
            autoHeight
            unmountOnClose
          >
            <StoreMap
              stores={nearbyStores.contents}
              userLocation={location || undefined}
              selectedStoreId={selectedStore?.id}
              onSelectStore={selectStore}
            />
            <div className="py-2">
              {nearbyStores.contents.map(
                (store: Store & { distance?: number }, i) => (
                  <ListItem
                    key={store.id}
                    onClick={() => selectStore(i)}
                    title={
                      store.distance
                        ? `${store.name} - ${displayDistance(store.distance)}`
                        : store.name
                    }
                    subtitle={store.address}
                    className={`px-4 py-2 ${
                      store.id === selectedStore?.id ? "bg-primary/5" : ""
                    }`}
                  />
                ),
              )}
            </div>
          </Sheet>,
          document.body,
        )}
    </>
  );
};

export const RequestStorePickerLocation: FC = () => {
  const retry = useSetRecoilState(requestLocationTriesState);
  return (
    <ListItem
      onClick={() => retry((r) => r + 1)}
      title="Chọn cửa hàng"
      subtitle="Yêu cầu truy cập vị trí"
    />
  );
};
