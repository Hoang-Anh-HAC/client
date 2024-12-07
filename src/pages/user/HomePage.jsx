import React, { useState, useEffect } from "react";
import { Carousel, Modal } from "antd";
import ProductCategory from "../../components/user/ProductCategory";
import useCategories from "../../hooks/useCategories";
import { useData } from "../../contexts/DataContext";
import CategoryList from "../../components/user/CategoryList";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const slides = [
  {
    img: "/images/banner/banner-slide-01.png",
    alt: "Banner slide 1",
  },
  {
    img: "/images/banner/banner-slide-02.png",
    alt: "Banner slide 2",
  },
  {
    img: "/images/banner/banner-slide-03.jpg",
    alt: "Banner slide 3",
  },
  {
    img: "/images/banner/banner-slide-04.png",
    alt: "Banner slide 4",
  },
];

// Custom arrows components
const CustomArrow = ({ type, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        absolute top-1/2 -translate-y-1/2 z-10
        ${type === "prev" ? "left-4" : "right-4"}
        w-8 h-8 flex items-center justify-center
        bg-white/70 hover:bg-white
        rounded-full shadow-lg
        transition-all duration-300
        opacity-0 group-hover:opacity-100
        hover:scale-110
      `}
    >
      {type === "prev" ? (
        <LeftOutlined className="text-lg text-primary" />
      ) : (
        <RightOutlined className="text-lg text-primary" />
      )}
    </button>
  );
};

const HomePage = () => {
  const { categories } = useData();
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-secondary w-full min-h-screen">
      <Modal
        title={
          <div className="text-center text-2xl font-bold text-primary">
            Chào mừng đến với Hoàng Anh Technology
          </div>
        }
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={700}
      >
        <div className="p-4 space-y-4">
          <div className="text-center mb-6">
            <img
              src="/images/hac-logo/logo-pri.png"
              alt="Logo"
              className="w-32 mx-auto mb-4"
            />
          </div>

          <p className="text-lg text-gray-700 text-center">
            Chúng tôi là nhà phân phối chuyên nghiệp các thiết bị mạng và giải
            pháp CNTT hàng đầu tại Việt Nam
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="font-bold text-xl text-primary mb-2">10+ Năm</div>
              <div className="text-gray-600">Kinh nghiệm trong ngành</div>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="font-bold text-xl text-primary mb-2">1000+</div>
              <div className="text-gray-600">Dự án thành công</div>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleModalClose}
              className="bg-primary text-white px-8 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Khám phá ngay
            </button>
          </div>
        </div>
      </Modal>

      <div className="flex pt-[10px] justify-center w-full px-2 sm:px-4">
        <div className="flex flex-col xl:flex-row max-w-[1200px] w-full gap-2">
          <div className="relative bg-white w-full xl:w-[300px] hidden xl:block shadow">
            <CategoryList />
          </div>

          <div className="relative w-full xl:w-[890px] group shadow">
            <Carousel
              arrows
              autoplay
              dots={true}
              infinite
              speed={500}
              autoplaySpeed={3000}
              prevArrow={<CustomArrow type="prev" />}
              nextArrow={<CustomArrow type="next" />}
            >
              {slides.map((slide, index) => (
                <div key={index}>
                  <img
                    src={slide.img}
                    alt={slide.alt}
                    className="w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[450px] object-cover"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-2 px-2 sm:px-4">
        <div className="flex max-w-[1200px] w-full shadow">
          <img
            className="w-full h-[100px] sm:h-[150px] md:h-[200px] lg:h-[250px] object-cover"
            src="/images/banner/home-banner.png"
            alt="Banner"
          />
        </div>
      </div>

      <div className="flex justify-center px-4">
        <div className="w-full max-w-[1200px]">
          <div className="grid grid-cols-1 ">
            {categories.map((category) => (
              <ProductCategory
                category={category}
                key={category._id}
                itemSize={200}
                gridCols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              />
            ))}
          </div>

          <div className="space-y-2 pt-2">
            <div className="bg-white p-8  shadow-md">
              <h2 className="text-2xl font-semibold text-primary mb-8 text-center">
                <span className="border-b-2 border-primary pb-2">
                  Đối Tác Của Chúng Tôi
                </span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                <div className="group relative overflow-hidden rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                  <img
                    src="/images/partners/logo-cisco.png"
                    alt="Cisco"
                    className="h-16 w-auto object-contain mx-auto filter grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110"
                  />
                </div>
                <div className="group relative overflow-hidden rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                  <img
                    src="/images/partners/logo-aruba.png"
                    alt="Aruba"
                    className="h-16 w-auto object-contain mx-auto filter grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110"
                  />
                </div>
                <div className="group relative overflow-hidden rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                  <img
                    src="/images/partners/logo-hpe.png"
                    alt="HP"
                    className="h-16 w-auto object-contain mx-auto filter grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110"
                  />
                </div>
                <div className="group relative overflow-hidden rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                  <img
                    src="/images/partners/logo-dell.png"
                    alt="Dell"
                    className="h-16 w-auto object-contain mx-auto filter grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="bg-white p-6 shadow-sm text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Sản Phẩm Chính Hãng
                </h3>
                <p className="text-gray-600">
                  100% sản phẩm được nhập khẩu chính hãng, có giấy tờ đầy đủ
                </p>
              </div>

              <div className="bg-white p-6 shadow-sm shadow-primary/10  text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Hỗ Trợ</h3>
                <p className="text-gray-600">
                  Đội ngũ kỹ thuật chuyên nghiệp, hỗ trợ khách hàng
                </p>
              </div>

              <div className="bg-white p-6 shadow-sm text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Giá Cả Cạnh Tranh
                </h3>
                <p className="text-gray-600">
                  Cam kết giá tốt nhất thị trường cho sản phẩm chính hãng
                </p>
              </div>
            </div>
            <div className="bg-primary text-white p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">1000+</div>
                  <div className="text-sm opacity-80">Dự án hoàn thành</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">50+</div>
                  <div className="text-sm opacity-80">Đối tác tin cậy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">100%</div>
                  <div className="text-sm opacity-80">Khách hàng hài lòng</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6  shadow-sm mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  Về Chúng Tôi
                </h2>
                <p className="text-gray-600 mb-4">
                  Hoàng Anh Technology là nhà phân phối chuyên nghiệp các thiết
                  bị mạng và giải pháp CNTT hàng đầu tại Việt Nam. Chúng tôi tự
                  hào là đối tác của các thương hiệu công nghệ hàng đầu thế
                  giới.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
                    <span className="text-2xl font-bold text-primary">10+</span>
                    <span className="text-sm text-gray-600">
                      Năm Kinh Nghiệm
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
                    <span className="text-2xl font-bold text-primary">
                      1000+
                    </span>
                    <span className="text-sm text-gray-600">Khách Hàng</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
                    <span className="text-2xl font-bold text-primary">50+</span>
                    <span className="text-sm text-gray-600">Đối Tác</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  Liên Hệ
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium">Địa chỉ:</p>
                      <p className="text-gray-600">
                        74/28 Trương Quốc Dung, Phường 10, Quận Phú Nhuận,
                        TP.HCM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium">Hotline:</p>
                      <p className="text-gray-600">028 399 70 399</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium">Email:</p>
                      <p className="text-gray-600">info@hoanganh.tech</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
