import React from "react";
import { Footer } from "antd/es/layout/layout";
import { Button } from "antd";

const footerItems = [
  {
    title: "VỀ HAC",
    items: [
      "Giới thiệu công ty",
      "Thông tin đối tác",
      "Thông tin tuyển dụng",
      "Thông tin liên hệ",
    ],
  },
  {
    title: "Chính sách công ty",
    items: [
      "Chính sách bảo mật",
      "Điều khoản sử dụng",
      "Chính sách đổi trả",
      "Chính sách vận chuyển",
    ],
  },
  {
    title: "CÔNG TY TNHH PHÁT TRIỂN CNTT HOÀNG ANH",
    items: [
      {
        text: "Địa chỉ: 74/28 Trương Quốc Dung, Phường 10, Quận Phú Nhuận, TP.HCM",
        link: "https://maps.app.goo.gl/bFiENRyY6cftbT5v6",
      },
      `Điện thoại: (028) 399 70 399`,
      `Hotline: 0908 30 13 13 (Mr. Trung Trần) & 0902 438 800 (Mr. Trung Nguyễn)`,
      `Email: trungtran@hac.com.vn hoặc trungnguyen@hac.com.vn`,
    ],
  },
];

function FooterLayout() {
  return (
    <Footer className="mt-3 bg-white">
      <div className="max-w-[1200px] w-full mx-auto px-4">
        <div className="max-w-[1200px] mx-auto border-b pb-4 sm:pb-8 mb-4 sm:mb-8">
          <div className="text-center bg-gray-50 py-4 sm:py-8 rounded-lg">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 px-2">
              YÊU CẦU BÁO GIÁ VÀ HỖ TRỢ KỸ THUẬT
            </h2>
            <Button
              type="primary"
              size="large"
              className="bg-[#1e3a8a] hover:bg-[#1e4620] w-40 sm:w-48 h-10 sm:h-12 text-sm sm:text-base"
            >
              GỬI YÊU CẦU HỖ TRỢ
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {footerItems.map((section, index) => (
            <div
              key={index}
              className={`space-y-2 sm:space-y-3 ${
                index === 2 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <label className="block uppercase font-bold text-sm sm:text-base mb-2 sm:mb-3">
                {section.title}
              </label>
              <div className="flex flex-col space-y-1 sm:space-y-2">
                {section.items.map((item, itemIndex) => (
                  <span
                    key={itemIndex}
                    className="text-gray-600 hover:text-gray-900 text-sm sm:text-base cursor-pointer"
                    onClick={() => {
                      if (typeof item === "object" && item.link) {
                        window.open(item.link, "_blank");
                      }
                    }}
                  >
                    {typeof item === "object" ? item.text : item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Footer>
  );
}

export default FooterLayout;
