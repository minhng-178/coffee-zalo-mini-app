import Taro from "@tarojs/taro";
import { Button } from "@tarojs/components";
import { ListItem } from "components/list-item";
import React, { FC } from "react";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { phoneState, userState } from "state";

export const PersonPicker: FC = () => {
  // Unlike Zalo's userInfo (which carried a display `name`), the WeChat
  // userState selector (state.ts) only resolves { openId } from the server
  // — there's no user-facing name to show, so this just displays the phone.
  useRecoilValueLoadable(userState);
  const phone = useRecoilValue(phoneState);

  return <ListItem title={phone} subtitle="Người nhận" />;
};

export const RequestPersonPickerPhone: FC = () => {
  const phone = useRecoilValueLoadable(phoneState);

  if (phone.state === "hasValue" && phone.contents) {
    return <PersonPicker />;
  }

  // WeChat only exposes the user's phone number through a tap on a real
  // native <button open-type="getPhoneNumber">, unlike Zalo's imperative
  // `retry((r) => r + 1)` flow this replaces — there's no equivalent way to
  // request it programmatically, and components/ui's Button is a plain View
  // with no native open-type support, so this must use Taro's native Button.
  const handleGetPhoneNumber = (event: any) => {
    const code = event?.detail?.code;
    if (!code) {
      // User declined, or the button was tapped before granting the
      // required privacy authorization — nothing to do.
      return;
    }
    // TODO: send event.detail.code to a new server endpoint that decrypts it
    // via session_key (see server/src/wechatSessionStore.js) — not
    // implemented yet, phoneState stays false until then.
    Taro.showToast({ title: "Đã nhận mã, chờ máy chủ xử lý...", icon: "none" });
  };

  return (
    <Button
      openType="getPhoneNumber"
      onGetPhoneNumber={handleGetPhoneNumber}
      className="!bg-transparent !border-none !p-0 !m-0 !leading-none !w-full !text-left !min-h-0 !h-auto"
      style={{ background: "transparent" }}
    >
      <ListItem title="Chọn người nhận" subtitle="Yêu cầu truy cập số điện thoại" />
    </Button>
  );
};
