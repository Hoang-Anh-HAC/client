import React, { useState, useEffect } from "react";
import CategoryItems from "./CategoryItems";
import BrandCategory from "./BrandCategory";
import { useData } from "../../contexts/DataContext";
import { useNavigate } from "react-router-dom";

const CategoryList = ({ onClose }) => {
  const { categories } = useData();
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    console.log("Category clicked, closing list...");
    navigate(`/product-list/${category.slug}`);
    onClose?.();
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
            onClick={handleCategoryClick}
          />
        ))}

      {hoveredCategory && window.innerWidth > 768 && (
        <div className="absolute top-0 left-[305px] z-20">
          <BrandCategory
            category={hoveredCategory}
            onMouseLeave={handleMouseLeave}
            onSelectBrand={(brandSlug) => {
              navigate(`/product-list/${hoveredCategory.slug}/${brandSlug}`);
              onClose?.();
            }}
          />
        </div>
      )}

      {selectedCategory && window.innerWidth <= 768 && (
        <div className="absolute top-0 left-0 w-full z-20">
          <BrandCategory
            category={selectedCategory}
            onMouseLeave={() => setSelectedCategory(null)}
            onSelectBrand={(brandSlug) => {
              navigate(`/product-list/${selectedCategory.slug}/${brandSlug}`);
              onClose?.();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryList;
