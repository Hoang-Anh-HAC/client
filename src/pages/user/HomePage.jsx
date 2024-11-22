import React, { useState, useEffect } from "react";
import { Carousel } from "antd";
import ProductCategory from "../../components/user/ProductCategory";
import useCategories from "../../hooks/useCategories";
import { useData } from "../../contexts/DataContext";
import CategoryList from "../../components/user/CategoryList";

const slides = [
  {
    img: "https://res.cloudinary.com/hac-cloud/image/upload/v1729672645/Ch%C6%B0a_c%C3%B3_t%C3%AAn_1000_x_500_px_d6livc.png",
  },
  {
    img: "https://res.cloudinary.com/hac-cloud/image/upload/v1729823229/Cisco-Research-Shows-IT-Eager-to-Adopt-Artificial-Intelligence_-Intent-based-Networking_iykbly.jpg",
  },
  {
    img: "https://res.cloudinary.com/hac-cloud/image/upload/v1729823062/aruba-central-header_godnin.jpg",
  },
];

const HomePage = () => {
  const { categories } = useData();

  return (
    <div className="bg-secondary w-full min-h-screen">
      <div className="flex pt-[10px] justify-center w-full px-2 sm:px-4">
        <div className="flex flex-col xl:flex-row max-w-[1200px] w-full gap-2">
          <div className="relative bg-white w-full xl:w-[300px] hidden xl:block">
            <CategoryList />
          </div>

          <div className="relative w-full xl:w-[890px] h-[200px] sm:h-[250px] md:h-[350px] lg:h-[450px]">
            <Carousel arrows infinite={false} autoplay>
              {slides.map((slide, index) => (
                <div key={index}>
                  <img
                    src={slide.img}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[450px] object-cover"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-2 px-2 sm:px-4">
        <div className="flex max-w-[1200px] w-full">
          <img
            className="w-full h-[100px] sm:h-[150px] md:h-[200px] lg:h-[250px] object-cover"
            src="https://res.cloudinary.com/hac-cloud/image/upload/v1729820582/ims8nxm1mnfev6x4drrv.png"
            alt="Banner"
          />
        </div>
      </div>

      <div className="flex justify-center px-4">
        <div className="w-full max-w-[1200px]">
          <div className="grid grid-cols-1 gap-4">
            {categories.map((category) => (
              <ProductCategory
                category={category}
                key={category._id}
                itemSize={200}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
