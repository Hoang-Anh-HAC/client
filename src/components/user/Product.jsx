import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import { Button, Skeleton, Image, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/helpers";
import { InboxOutlined } from "@ant-design/icons";

const Product = ({
  category,
  brand,
  series,
  itemSize,
  page,
  limit,
  setTotalProducts,
  options,
  onViewAllImages,
  sortType,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      if (!category?._id) {
        setLoading(false);
        setTotalProducts(0);
        return;
      }

      try {
        const queryParams = new URLSearchParams();

        queryParams.append("categoryID", category._id);

        if (brand?._id) {
          queryParams.append("brandID", brand._id);
        }

        if (series) {
          queryParams.append("seriesID", series);
        }

        if (options?.length > 0) {
          queryParams.append("optionIDs", options.toString());
        }

        queryParams.append("page", page);
        queryParams.append("limit", limit);
        queryParams.append("sort", sortType);

        const response = await axios.get(`/product?${queryParams.toString()}`);

        console.log(queryParams.toString());

        if (response.data?.products?.length === 0) {
          setError("Không có sản phẩm trong danh mục này.");
          setProducts([]);
          setTotalProducts(0);
        } else if (response.data?.products) {
          setProducts(response.data.products);
          setTotalProducts(response.data.totalProducts);
        } else {
          setError("Đã xảy ra lỗi khi tải sản phẩm.");
          setProducts([]);
          setTotalProducts(0);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("Không có sản phẩm trong danh mục này.");
        } else {
          console.error("Error fetching products:", error);
          setError("Đã xảy ra lỗi khi tải sản phẩm.");
        }
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category?._id, brand?._id, series, page, limit, options, sortType]);

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
      {products.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center min-h-[300px]">
          <InboxOutlined className="text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg text-gray-600">Sản phẩm đang cập nhật</h3>
        </div>
      ) : (
        products.map((product) => (
          <div
            key={product._id}
            className="border-[1px] border-gray-300 rounded-sm flex flex-col h-[220px] min-[380px]:h-[280px] xs:h-[300px] sm:h-[350px] w-full max-w-[180px] min-[380px]:max-w-[200px] xs:max-w-[220px] sm:max-w-full hover:border-grey  cursor-pointer overflow-hidden group"
            onClick={() => handleProductClick(product)}
          >
            <div className="flex items-center justify-center bg-gray-100 relative h-[130px] min-[380px]:h-[160px] xs:h-[180px] sm:h-[220px] w-full overflow-hidden min-[380px]:p-2 xs:p-3">
              <Image
                src={product.images?.[0]?.url || "/placeholder-image.png"}
                alt={product.title}
                className="p-6 w-full h-full object-contain transition-transform duration-300 ease-in-out transform group-hover:scale-110"
                preview={false}
              />
            </div>

            <div className="flex flex-col justify-between h-[90px] min-[380px]:h-[120px] xs:h-[120px] p-2 min-[380px]:p-3 xs:p-4 relative">
              <p className="text-[16px] min-[380px]:text-[14px] xs:text-base font-medium   line-clamp-2 text-red-600">
                {product.productID}
              </p>
              <p className="text-[16px] min-[380px]:text-[14px] xs:text-base font-normal line-clamp-2">
                {product.title}
              </p>

              <div>
                <p className="text-[20px] min-[380px]:text-[19px] xs:text-xl font-semibold text-primary xs:mb-2">
                  {formatPrice(product.prices)}
                </p>
              </div>

              <div className="absolute bottom-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
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
        ))
      )}
    </>
  );
};

export default Product;
