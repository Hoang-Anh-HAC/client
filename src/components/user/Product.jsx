import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import { Button, Skeleton, Image, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/helpers";
import { InboxOutlined } from "@ant-design/icons";

const Product = ({
  category,
  series,
  page,
  limit,
  setTotalProducts,
  options,
  sortType,
  selectedBrand,
  relatedProducts,
  layoutType,
  recentProduct,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        if (category) {
          queryParams.append("categoryID", category._id);
        }

        if (Array.isArray(relatedProducts) && relatedProducts.length > 0) {
          relatedProducts.forEach((productID) =>
            queryParams.append("productID", productID)
          );
        }

        if (selectedBrand?._id) {
          queryParams.append("brandID", selectedBrand._id);
        }

        if (series) {
          queryParams.append("seriesID", series);
        }
        if (options?.length > 0) {
          queryParams.append("optionIDs", options);
        }
        queryParams.append("page", page);
        queryParams.append("limit", limit);
        queryParams.append("sort", sortType);

        const response = await axios.get(`/product?${queryParams.toString()}`);

        console.log(response.data);
        if (response.data?.products?.length === 0) {
          setError("Không có sản phẩm trong danh mục này.");
          setProducts([]);
          setTotalProducts(0);
          return;
        } else {
          let filteredProducts = recentProduct
            ? response.data.products.filter(
                (product) => product._id !== recentProduct
              )
            : response.data.products;
          setProducts(filteredProducts);
          setTotalProducts(response.data.totalProducts);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("Không có sản phẩm trong danh mục này.");
        } else {
          console.error("Error fetching products:", error);
          setError("Đã xảy ra lỗi khi tải sản phẩm.");
        }
        setProducts();
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    category,
    selectedBrand,
    series,
    options,
    relatedProducts,
    page,
    limit,
    sortType,
  ]);

  const handleProductClick = async (product) => {
    try {
      await axios.put(`/product/${product.slug}/views`);
      navigate(`/product/${product.slug}`);
    } catch (error) {
      console.error("Error updating views:", error);
      navigate(`/product/${product.slug}`);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Skeleton />
      </div>
    );

  if (error) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center min-h-[300px]">
        <InboxOutlined className="text-4xl text-gray-400 mb-4" />
        <h3 className="text-lg text-gray-600">
          Không có sản phẩm trong danh mục này
        </h3>
      </div>
    );
  }

  return (
    <>
      {products &&
        products.map((product) => (
          <div
            key={product._id}
            className={`border-[1px] border-gray-300 rounded-sm flex ${
              layoutType === "horizontal"
                ? "flex-row items-center gap-2 p-2 sm:p-3 w-full max-w-[500px]"
                : "flex-col max-w-[250px]"
            } h-auto hover:border-grey cursor-pointer overflow-hidden group`}
            onClick={() => handleProductClick(product)}
          >
            {/* Image Section */}
            <div
              className={`flex items-center justify-center bg-gray-100 relative ${
                layoutType === "horizontal"
                  ? "h-[80px] w-[80px] sm:h-[100px] sm:w-[100px]"
                  : "h-[130px] min-[380px]:h-[160px] xs:h-[180px] sm:h-[220px] w-full"
              } overflow-hidden`}
            >
              {product.images.length ? (
                <Image
                  src={product.images?.[0]?.url || "/placeholder-image.png"}
                  alt={product.title}
                  className="p-4 w-full h-full object-contain transition-transform duration-300 ease-in-out transform group-hover:scale-110"
                  preview={false}
                />
              ) : (
                <div className=" p-4 w-full h-full object-contain transition-transform duration-300 ease-in-out transform group-hover:scale-110 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div
              className={`flex flex-col justify-between ${
                layoutType === "horizontal"
                  ? "flex-1"
                  : "p-2 min-[380px]:p-3 xs:p-4"
              } relative`}
            >
              <p className="text-[12px] sm:text-[14px] font-medium line-clamp-2 text-red-600">
                {product.productID}
              </p>
              <p className="text-[14px] sm:text-[16px] font-normal line-clamp-2">
                {product.title}
              </p>
              <div>
                <p className="text-[16px] sm:text-[18px] font-semibold text-primary">
                  Liên hệ
                </p>
              </div>

              {/* Hover Arrow */}
              <div className="absolute bottom-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`${
                    layoutType === "horizontal" ? "w-5 h-5" : "size-4"
                  } text-gray-600`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default Product;
