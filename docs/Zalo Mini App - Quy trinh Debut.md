# Quy trình debut một Zalo Mini App (tài khoản doanh nghiệp)

> Phạm vi: toàn bộ hành trình từ tạo tài khoản đến khi Mini App được Zalo duyệt và phát hành công khai, áp dụng cho đăng ký dưới **tài khoản doanh nghiệp/tổ chức**.

## Tổng quan quy trình

Zalo Platform Document Hub mô tả quy trình gồm 4 giai đoạn chính: **Tạo → Xác thực → Xây dựng → Phát hành** ([nguồn](https://docs.zaloplatforms.com/docs/MA/intro/getting-started)).

---

## Bước 1 — Tạo Zalo App và Mini App

Kiến trúc: một **Zalo App** (đăng ký tại `developers.zalo.me`) có thể chứa nhiều **Mini App** bên trong nó.

1. Đăng nhập `developers.zalo.me` bằng tài khoản Zalo cá nhân, tạo Zalo App.
2. Vào **Settings** của Zalo App và kích hoạt để người dùng bên ngoài có thể truy cập.
3. Sang cổng quản lý riêng `mini.zalo.me/developers` → chọn Zalo App vừa tạo → **"Tạo Mini App"** → điền thông tin bắt buộc → xác nhận.
4. Hệ thống cấp một **Mini App ID**, dùng cho toàn bộ các bước cấu hình/build sau này.

⚠️ **Lưu ý quan trọng từ tài liệu gốc**: thông tin khai báo lúc tạo Mini App rất khó sửa sau đó — muốn đổi phải mở **ticket hỗ trợ** và chờ Zalo xác nhận lại. Vì vậy nên chuẩn bị kỹ tên, mô tả, danh mục dịch vụ trước khi tạo.

*Nguồn: [Getting Started](https://docs.zaloplatforms.com/docs/MA/intro/getting-started)*

---

## Bước 2 — Xác thực (verification)

Theo **Zalo Mini App Developer Program Agreement — Mini App Verification**, chương trình xác thực nhằm "đảm bảo độ tin cậy, định danh chính chủ" và tuân thủ pháp luật, bảo vệ người dùng khỏi gian lận. **Từ 15/10/2025**, mọi thương nhân ("Đối Tác") phải hoàn thành xác thực để được hoạt động hợp pháp trên nền tảng.

Quy trình gồm **hai bước xác thực**:

**Bước 2.1 — Xác thực bắt buộc (chủ sở hữu)**, áp dụng cho tất cả Mini App, phân theo loại hình đăng ký:

| Loại hình | Giấy tờ/điều kiện cần |
|---|---|
| Cá nhân | Tài khoản Zalo đã **eKYC thành công** |
| Doanh nghiệp/Hộ kinh doanh | **OA doanh nghiệp** đã xác thực, **hoặc** giấy chứng nhận đăng ký kinh doanh kèm giấy tờ tùy thân người đại diện pháp luật |
| Cơ quan nhà nước/Đơn vị sự nghiệp | OA cơ quan nhà nước/tiện ích công |

**Bước 2.2 — Xác thực bổ sung (giấy phép ngành nghề)**, chỉ áp dụng cho Mini App thuộc **ngành nghề kinh doanh có điều kiện**: tài chính (bảo hiểm, ngân hàng, trung gian thanh toán), y tế (dược phẩm, bệnh viện, phòng khám), giáo dục, bất động sản, thương mại có điều kiện (mỹ phẩm, thực phẩm, đồ uống có cồn, vàng bạc đá quý...), F&B, giao thông vận tải, viễn thông, điện lực, cấp nước, truyền thông. Mỗi ngành có yêu cầu giấy tờ riêng — ví dụ ngành thực phẩm cần **Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm**, ngành rượu cần một trong các giấy phép phân phối/bán buôn/bán lẻ/bán tiêu dùng tại chỗ.

**Thời gian xét duyệt**: 3–5 ngày làm việc sau khi nhận đủ hồ sơ hợp lệ, rõ ràng và chính xác; nền tảng có thể yêu cầu bổ sung nếu cần thẩm định thêm. Ngay cả Mini App **không** thuộc danh mục ngành nghề có điều kiện vẫn có thể bị yêu cầu bổ sung tài liệu nếu thuộc ngành mới, có tính năng đặc thù, hoặc cần chứng minh quyền sở hữu trí tuệ/thương hiệu.

Lưu ý pháp lý: nền tảng không chịu trách nhiệm pháp lý phát sinh từ hoạt động kinh doanh của Đối Tác, nhưng có thể đóng vai trò trung gian hỗ trợ liên hệ cơ quan nhà nước khi cần.

**Kênh hỗ trợ theo loại hình**:
- Cơ quan nhà nước → OA "Zalo chuyển đổi số" hoặc email `minicqnn@zalo.me`
- Tài chính/ngân hàng/bảo hiểm → `support@fiza.ai`
- Các loại hình còn lại → `cskh@zaloplatforms.com`

Riêng mục **KYB – Nộp giấy tờ doanh nghiệp** trong Open APIs là một luồng khác, **chỉ áp dụng cho "Đối tác giải pháp"** đã ký thỏa thuận hợp tác chính thức với Zalo (solution partner tier) để được cấp quyền API mở rộng — không phải quy trình xác thực tiêu chuẩn ở Bước 2 này.

*Nguồn: [Getting Started](https://docs.zaloplatforms.com/docs/MA/intro/getting-started), [Open APIs — Tổng quan](https://docs.zaloplatforms.com/docs/MA/openApis/intro), [Mini App Verification (Developer Program Agreement)](https://miniapp.zaloplatforms.com/documents/zalo-mini-app-developer-program-agreement/mini-app-verification/)*

---

## Bước 3 — Cài đặt công cụ phát triển

Trang **DevTools** tổng hợp hai công cụ chính thức, mỗi công cụ có nhóm trang con giống nhau (Cài đặt → Đăng nhập/Tạo dự án → Khởi động → Xuất bản):

| Công cụ | Mô tả |
|---|---|
| **Zalo Mini App Extension** | Tiện ích mở rộng cho **Visual Studio Code**, cho phép init, start, build, deploy dự án trực tiếp trong IDE. |
| **Zalo Mini App CLI** | Công cụ dòng lệnh, có thêm bước **Đăng nhập** riêng trước khi tạo dự án — phù hợp cho luồng làm việc không dùng VS Code hoặc tích hợp vào CI/CD. |

Tài liệu không đề cập đến "simulator" như một công cụ tách biệt.

### Cài đặt Extension (2 phương án)
1. Trong VS Code: mở tab **Extensions**, tìm từ khóa `Zalo Mini App Extension`, nhấn **Install**.
2. Từ trang VS Code Marketplace: tìm extension, nhấn **Install** để tải và cài trực tiếp.

Sau khi cài, extension mặc định nằm ở **primary sidebar**, có thể chuyển sang **secondary sidebar** để dùng song song với Explorer/Search/Run and Debug.

Nếu cần tích hợp thanh toán trong Mini App, còn có **Checkout SDK** riêng.

**Yêu cầu môi trường**: cài **phiên bản mới nhất** của Zalo Mini App Extension, và **Node.js bản LTS từ v14 trở lên**.

*Nguồn: [Zalo Mini App Extension — Install](https://docs.zaloplatforms.com/docs/MA/devtools/ext/install), [Checkout SDK](https://docs.zaloplatforms.com/docs/MA/checkoutSdk/intro), [Devtools — Tổng quan](https://miniapp.zaloplatforms.com/documents/devtools/)*

---

## Bước 4 — Xây dựng và kiểm thử

Hai lựa chọn xây dựng:

| Lựa chọn | Mô tả |
|---|---|
| **Dùng đối tác giải pháp** | Đối tác tư vấn, xây dựng hộ Mini App, tận dụng ưu đãi Zalo/đối tác dành riêng cho nhóm này. Danh sách đối tác tại `miniforbusiness.zalo.me`. |
| **Tự xây dựng** | Theo trình tự: xin quyền (permission) → build bằng VSCode extension → tích hợp API → tích hợp Checkout SDK → tuân thủ UI/UX guideline → tham khảo troubleshooting → kiểm thử. |

**Xin quyền (permission)**: mọi quyền truy cập thiết bị/dữ liệu người dùng (camera, vị trí, số điện thoại, quét QR...) được phân theo 4 nhóm — User Device, User Information, Zalo, Mini App — và một số quyền cần **Zalo phê duyệt riêng** qua "Mini App Center" (chọn quyền → mô tả lý do kèm hình ảnh minh hoạ → gửi duyệt). Nguyên tắc khuyến nghị: chỉ xin quyền thực sự cần thiết tại đúng thời điểm sử dụng.

**Đăng nhập extension trước khi deploy**: cần liên kết project với đúng Mini App ID, đăng nhập bằng tài khoản **Admin hoặc Developer** qua quét QR trong extension.

**Loại bản deploy** khi test:
- **Development**: mỗi lần deploy sẽ ghi đè bản trước, không lưu lịch sử — phù hợp test nhanh.
- **Testing**: được đánh số phiên bản, lưu trong "Quản lý phiên bản", có mô tả thay đổi để dễ rollback.

*Nguồn: [Getting Started](https://docs.zaloplatforms.com/docs/MA/intro/getting-started), [Request Permission](https://docs.zaloplatforms.com/docs/MA/intro/request-permission), [Ext — Deploy](https://docs.zaloplatforms.com/docs/MA/devtools/ext/deploy)*

---

## Bước 5 — Nộp xét duyệt và phát hành (Zalo's approval process)

Đây là bước trả lời trực tiếp câu hỏi "có approval nào từ công ty (Zalo) hay không" — **có, bắt buộc**.

### Quy trình nộp duyệt
1. Vào **Zalo Mini App Management Page** (`mini.zalo.me/developers`) → **Quản lý phiên bản** → **Danh sách phiên bản**.
2. Với phiên bản đang ở trạng thái **Testing**, gửi **yêu cầu xét duyệt**.
3. Trạng thái chuyển sang **"Chờ xét duyệt"** — đội ngũ Zalo review dựa trên chính sách Mini App.
4. Nếu đạt, trạng thái chuyển **"Đã duyệt"** → nhà phát triển chọn **Publish** để phát hành cho toàn bộ người dùng Zalo.

### Tiêu chí Zalo xét duyệt (chi tiết từ Zalo Mini App Censorship Policy)

**1. Logo**: phải chính chủ, không giả mạo logo ứng dụng/nhãn hàng khác; phù hợp chức năng Mini App; không chứa số điện thoại hoặc QR code; nên có nền trong suốt.

**2. Tên Mini App**: phản ánh đúng chức năng thực tế; không viết hoa toàn bộ; không dùng danh từ chung; không chứa các từ như "App", "Zalo", ký tự đặc biệt hoặc emoji; cần có tiền tố/hậu tố phân biệt đơn vị sở hữu.

**3. Mô tả**: chính xác với chức năng, đối tượng, mục đích sử dụng; không chứa liên kết hoặc nội dung vi phạm pháp luật/thuần phong mỹ tục.

**4. Nội dung bị cấm/hạn chế**:
- Không điều hướng người dùng ra ứng dụng khác hoặc đăng nhập bên thứ ba (trừ hiển thị Chính sách bảo mật dạng popup).
- Cấm tự ý gắn banner quảng cáo kiếm tiền.
- Cấm mua bán vật phẩm ảo trong game, tiền điện tử/NFT chưa cấp phép.
- Tính năng **rút tiền/trả thưởng** bị coi là vi phạm.
- Cấm tính năng mạng xã hội (đăng post, like, comment) hoặc cạnh tranh trực tiếp với sản phẩm Zalo (Zing MP3, Zalo Video).
- Nội dung không lỗi font, hình ảnh hiển thị đầy đủ; chính sách/điều khoản phải nêu rõ tên đơn vị kinh doanh, không chung chung.

**5. Hiệu suất**: mọi tính năng phải hoạt động thật, không ở trạng thái Demo; không treo máy hoặc màn hình trắng/tối; **Largest Contentful Paint (LCP) dưới 2.5 giây**, **PageLoad Time dưới 1.5 giây**.

**6. Xin quyền người dùng**: không ép xin quyền ngay khi vào app, phải có ngữ cảnh rõ ràng; cho phép từ chối cấp quyền mà vẫn dùng được tính năng không liên quan; cấm giả mạo giao diện xin quyền của nền tảng; không bắt buộc đăng ký/đăng nhập tài khoản (trừ trường hợp nội bộ tổ chức).

**7. Bảo mật & quyền riêng tư**: cấm thu thập dữ liệu cá nhân không có sự đồng ý rõ ràng; cấm chia sẻ dữ liệu bên thứ ba nếu không thông báo/xin phép; cấm chứa mã độc hoặc liên kết dẫn đến mã độc.

**8. Checkout SDK**: bắt buộc tích hợp nếu có phát sinh đơn hàng/thanh toán và hiển thị giá trực tiếp; nếu chưa dùng SDK thì phải ẩn giá và chuyển chức năng mua hàng thành "Liên hệ"/"Tư vấn".

Bắt buộc dùng cơ chế **Authentication chuẩn của Zalo** để định danh người dùng.

### Thời gian xét duyệt (SLA) và duy trì hoạt động
- **SLA xét duyệt**: Mini App được kiểm duyệt trong vòng **3 ngày làm việc**, không tính Thứ 7/Chủ Nhật.
- **Duy trì hoạt động sau khi Publish**: phải xác thực qua Zalo OA hoặc giấy phép hợp lệ; tính năng chính phải ổn định theo phiên bản đã phát hành; yêu cầu tối thiểu **10 lượt truy cập/tháng**. Nếu vi phạm tiêu chí trong 3 tháng liên tiếp, cần khắc phục để tránh bị hạn chế hiển thị.
- Ngành đặc thù (Dược, Mỹ phẩm, Thực phẩm chức năng...) cần bổ sung giấy tờ xác thực liên quan, tương tự Bước 2.2.

**Khoảng trống còn lại**: tài liệu công khai **không mô tả quy trình resubmit cụ thể** khi bị từ chối (có nộp lại ngay được không, phản hồi lý do chi tiết ra sao) — chỉ hướng dẫn liên hệ hỗ trợ theo từng loại hình:
- Cơ quan nhà nước → OA "Zalo chuyển đổi số" hoặc email `minicqnn@zalo.me`
- Tài chính/ngân hàng/bảo hiểm → `support@fiza.ai`
- Các loại hình còn lại → `cskh@zaloplatforms.com`

Toàn bộ quá trình duyệt dựa trên **Zalo Mini App Developer Program Agreement** — nên đọc kỹ trước khi nộp để tránh vi phạm điều khoản dẫn đến bị từ chối hoặc gỡ app sau này.

*Nguồn: [Publish Mini Program](https://docs.zaloplatforms.com/docs/MA/intro/public-mini-program), [Developer Program Agreement](https://mini.zalo.me/documents/zalo-mini-app-developer-program-agreement/), [Zalo Mini App Censorship Policy](https://miniapp.zaloplatforms.com/documents/zalo-mini-app-censorship-policy/)*

---

## Sau khi phát hành

Có thể gửi thông báo tới người dùng qua **OA** và **ZNS** (Zalo Notification Service) để quảng bá Mini App vừa lên sóng.

*Nguồn: [Getting Started](https://docs.zaloplatforms.com/docs/MA/intro/getting-started), [Giới thiệu ZBS Template Message](https://docs.zaloplatforms.com/docs/ZBS/bat-dau/gioi-thieu-zbs-template-message)*

---

## Tóm tắt trả lời 3 câu hỏi ban đầu

| Câu hỏi | Trả lời ngắn gọn |
|---|---|
| **Cần cài đặt gì?** | **Zalo Mini App Extension** (VS Code) hoặc **Zalo Mini App CLI** — cả hai đều hỗ trợ đủ luồng cài đặt/tạo dự án/khởi động/xuất bản; Checkout SDK nếu có thanh toán. Dùng bản Extension mới nhất và Node.js LTS từ v14 trở lên. |
| **Đăng ký tài khoản thế nào?** | Tạo Zalo App tại `developers.zalo.me` → tạo Mini App con tại `mini.zalo.me/developers` → xác thực **bắt buộc** theo loại hình (cá nhân: eKYC; doanh nghiệp: OA hoặc giấy đăng ký kinh doanh + giấy tờ người đại diện) trong 3–5 ngày làm việc, cộng xác thực **bổ sung** giấy phép ngành nghề nếu thuộc lĩnh vực có điều kiện (tài chính, y tế, F&B...). Bắt buộc từ 15/10/2025. |
| **Có bước approval từ công ty (Zalo) không?** | **Có.** Mọi phiên bản Testing phải nộp xét duyệt trên Management Page, Zalo review theo Censorship Policy (logo, tên, mô tả, hiệu suất LCP < 2.5s, bảo mật, Checkout SDK...) trong SLA **3 ngày làm việc**, chỉ khi ở trạng thái "Đã duyệt" mới được Publish ra công khai. |

## Nguồn tham khảo

- [Getting Started — Quy trình triển khai](https://docs.zaloplatforms.com/docs/MA/intro/getting-started)
- [Request Permission](https://docs.zaloplatforms.com/docs/MA/intro/request-permission)
- [Zalo Mini App Extension — Install](https://docs.zaloplatforms.com/docs/MA/devtools/ext/install)
- [Zalo Mini App Extension — Deploy](https://docs.zaloplatforms.com/docs/MA/devtools/ext/deploy)
- [Public Mini Program (Xuất bản)](https://docs.zaloplatforms.com/docs/MA/intro/public-mini-program)
- [Open APIs — Tổng quan (KYB)](https://docs.zaloplatforms.com/docs/MA/openApis/intro)
- [Checkout SDK — Intro](https://docs.zaloplatforms.com/docs/MA/checkoutSdk/intro)
- [Zalo Mini App Developer Program Agreement](https://mini.zalo.me/documents/zalo-mini-app-developer-program-agreement/)
- [Mini App Verification](https://miniapp.zaloplatforms.com/documents/zalo-mini-app-developer-program-agreement/mini-app-verification/)
- [Devtools — Tổng quan](https://miniapp.zaloplatforms.com/documents/devtools/)
- [Zalo Mini App Censorship Policy](https://miniapp.zaloplatforms.com/documents/zalo-mini-app-censorship-policy/)
