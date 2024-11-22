import React from "react";
import { useData } from "../../contexts/DataContext";
import { useNavigate } from "react-router-dom";

const MobileCategoryList = ({ onClose }) => {
  const { categories } = useData();
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    // Điều hướng đến trang category
    navigate(`/product-list/${category.slug}`);
    // Đóng menu mobile
    onClose();
  };

  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-medium">Danh mục sản phẩm</h2>
        <button onClick={onClose} className="text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Categories List */}
      <div className="overflow-y-auto h-[calc(100vh-64px)]">
        {categories?.map((category) => (
          <div
            key={category._id}
            className="flex items-center justify-between p-4 border-b border-gray-100 active:bg-gray-50"
            onClick={() => handleCategoryClick(category)}
          >
            <div className="flex items-center space-x-3">
              {category.icon && (
                <img
                  src={category.icon[0]?.url}
                  alt={category.title}
                  className="w-6 h-6 object-contain"
                />
              )}
              <span className="text-gray-700">{category.title}</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileCategoryList;
