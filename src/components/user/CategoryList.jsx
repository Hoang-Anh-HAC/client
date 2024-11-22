import React, { useState } from "react";
import CategoryItems from "./CategoryItems";
import BrandCategory from "./BrandCategory";
import { useData } from "../../contexts/DataContext";

const CategoryList = () => {
  const { categories } = useData();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(
      selectedCategory?._id === category._id ? null : category
    );
  };

  const handleMouseEnter = (category) => {
    if (window.innerWidth > 768) {
      setHoveredCategory(category);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 768) {
      setHoveredCategory(null);
    }
  };

  return (
    <div
      className="w-[300px] h-[450px] z-100 bg-white "
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="pt-4 pb-2 px-4 font-semibold">Danh mục sản phẩm</h2>
      {categories &&
        categories.length > 0 &&
        categories.map((category) => (
          <CategoryItems
            key={category._id}
            category={category}
            onMouseEnter={() => handleMouseEnter(category)}
            onClick={() => handleCategoryClick(category)}
          />
        ))}

      {hoveredCategory && window.innerWidth > 768 && (
        <div className="absolute top-0 left-[305px] z-20">
          <BrandCategory
            category={hoveredCategory}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      )}

      {selectedCategory && window.innerWidth <= 768 && (
        <div className="absolute top-0 left-0 w-full z-20">
          <BrandCategory
            category={selectedCategory}
            onMouseLeave={() => setSelectedCategory(null)}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryList;
