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
    title: "THÔNG TIN LIÊN HỆ",
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Company Info Column */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img
                src="/images/hac-logo/logo-sec.png"
                alt="HAC Logo"
                className="h-16 object-contain mb-2"
              />
              <h1 className="text-lg font-bold text-primary">
                CÔNG TY TNHH PHÁT TRIỂN CNTT HOÀNG ANH
              </h1>
              <p className="text-sm text-gray-600 mb-4">
                Mã số thuế: 0313519285
              </p>

              {/* Social Media Icons */}
              <div className="flex gap-3 mb-4">
                <a
                  href="#"
                  className="bg-gray-800 p-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <i className="fab fa-facebook-f text-white text-lg w-5 h-5 flex items-center justify-center"></i>
                </a>
                <a
                  href="#"
                  className="bg-gray-800 p-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <i className="fab fa-youtube text-white text-lg w-5 h-5 flex items-center justify-center"></i>
                </a>
                <a
                  href="#"
                  className="bg-gray-800 p-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <i className="fab fa-twitter text-white text-lg w-5 h-5 flex items-center justify-center"></i>
                </a>
                <a
                  href="#"
                  className="bg-gray-800 p-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <i className="fab fa-telegram text-white text-lg w-5 h-5 flex items-center justify-center"></i>
                </a>
                <a
                  href="#"
                  className="bg-gray-800 p-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <i className="fab fa-skype text-white text-lg w-5 h-5 flex items-center justify-center"></i>
                </a>
              </div>

              {/* Certification Badges */}
              <div className="flex gap-4">
                <img
                  src="/dathongbao.png"
                  alt="Đã thông báo Bộ Công Thương"
                  className="h-12 object-contain"
                />
                <img
                  src="/dmca.png"
                  alt="DMCA Protected"
                  className="h-12 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Rest of the footer content */}
          {footerItems.map((section, index) => (
            <div key={index} className="space-y-3">
              <label className="block uppercase font-bold text-sm sm:text-base">
                {section.title}
              </label>
              <div className="flex flex-col space-y-2">
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

        <div className="mt-8 pt-4 border-t text-center">
          <p className="text-sm text-gray-600">
            © 2024 HAC. All rights reserved.
          </p>
        </div>
      </div>
    </Footer>
  );
}

export default FooterLayout;
