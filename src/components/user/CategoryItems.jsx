import React from "react";
import { useNavigate } from "react-router-dom";

const CategoryItems = ({ category, onMouseEnter }) => {
  const navigate = useNavigate();

  return (
    <li
      key={category._id}
      className="py-2 px-4 flex justify-between items-center hover:bg-secondary cursor-pointer"
      onMouseEnter={onMouseEnter}
      onClick={() => navigate(`product-list/${category.slug}`)}
    >
      <div className="flex items-center">
        <img
          src={category.icon[0].url}
          alt={category.title}
          className="h-6 w-6"
        />
        <p className="font-light text-sm ml-[10px]">{category.title}</p>
      </div>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </div>
    </li>
  );
};

export default CategoryItems;
