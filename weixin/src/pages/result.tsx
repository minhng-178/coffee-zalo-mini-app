import Taro from "@tarojs/taro";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { Box, Button, Header, Page, Text } from "components/ui";
import { useResetRecoilState } from "recoil";
import { cartState } from "state";
import { IconPaymentFail, IconPaymentSuccess } from "components/payment-icon";
import { useNavigate } from "utils/navigation";

interface RenderResultProps {
  title: string;
  message: string;
  icon: ReactNode;
}

// Simplified relative to the original, which polled Payment.checkTransaction
// in a loop every 3s while the transaction was pending. preview.tsx now
// navigates here only after Taro.requestPayment() has already definitively
// resolved or rejected, so there's no pending/loading phase to poll for —
// the outcome is read directly from the "status" query param Taro/WeChat
// already parses out of the navigated-to URL.
const CheckoutResultPage: FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"success" | "fail">();
  const clearCart = useResetRecoilState(cartState);

  useEffect(() => {
    const params = Taro.getCurrentInstance().router?.params ?? {};
    const nextStatus = params.status === "success" ? "success" : "fail";
    setStatus(nextStatus);
    if (nextStatus === "success") {
      clearCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!status) {
    return null;
  }

  const result: RenderResultProps =
    status === "success"
      ? {
          title: "Thanh toán thành công",
          message:
            "Đơn hàng của bạn đã được thanh toán thành công. Đơn hàng của bạn sẽ được xử lý trong thời gian sớm nhất.",
          icon: <IconPaymentSuccess />,
        }
      : {
          title: "Thanh toán thất bại",
          message: "Có lỗi trong quá trình xử lý, vui lòng kiểm tra lại hoặc liên hệ Shop để được hỗ trợ",
          icon: <IconPaymentFail />,
        };

  return (
    <Page className="flex flex-col bg-white">
      <Header title="Kết quả thanh toán" />
      <Box className="p-6 space-y-3 flex-1 flex flex-col justify-center items-center text-center">
        <Box className="p-4">{result.icon}</Box>
        <Text size="xLarge" className="font-medium">
          {result.title}
        </Text>
        <Text className="text-[#6F7071]">{result.message}</Text>
      </Box>
      <Box className="p-4">
        <Button fullWidth onClick={() => navigate("/", { replace: true })}>
          {status === "success" ? "Hoàn tất" : "Đóng"}
        </Button>
      </Box>
    </Page>
  );
};

export default CheckoutResultPage;
