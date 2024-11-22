import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import { Button, Skeleton, Image } from "antd";
import { useNavigate } from "react-router-dom";

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

        const response = await axios.get(`/product?${queryParams.toString()}`);

        // Kiểm tra dữ liệu trả về từ API
        if (response.data?.products?.length === 0) {
          setError("Không có sản phẩm trong danh mục này.");
          setProducts([]);
        } else if (response.data?.products) {
          setProducts(response.data.products);
          setTotalProducts(response.data.totalProducts);
        } else {
          setError("Đã xảy ra lỗi khi tải sản phẩm.");
          setProducts([]);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("Không có sản phẩm trong danh mục này.");
        } else {
          console.error("Error fetching products:", error);
          setError("Đã xảy ra lỗi khi tải sản phẩm.");
        }
        setProducts([]); // Đảm bảo reset danh sách sản phẩm khi lỗi
      } finally {
        setLoading(false); // Đảm bảo set loading về false dù xảy ra bất kỳ lỗi nào
      }
    };

    fetchProducts();
  }, [category?._id, brand?._id, series, page, limit, options]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Skeleton />
      </div>
    );

  if (error) return <p>{error}</p>;

  return (
    <>
      {products.length === 0 ? (
        <p>Sản phẩm đang cập nhật...</p>
      ) : (
        products.map((product) => (
          <div
            key={product._id}
            className="flex flex-col h-[180px] min-[380px]:h-[250px] xs:h-[280px] sm:h-[300px] w-full max-w-[150px] min-[380px]:max-w-[180px] xs:max-w-[200px] sm:max-w-full border-[1px] hover:border-black rounded-md cursor-pointer overflow-hidden group"
            onClick={() => {
              navigate(`/product/${product.slug}`);
            }}
          >
            <div className="relative h-[100px] min-[380px]:h-[140px] xs:h-[160px] sm:h-[180px] w-full overflow-hidden p-1 min-[380px]:p-2 xs:p-3">
              <Image
                src={product.images?.[0]?.url || "/placeholder-image.png"}
                alt={product.title}
                className="w-full h-full object-contain transition-transform duration-300 ease-in-out transform group-hover:scale-110"
                preview={false}
              />
            </div>

            <div className="flex flex-col justify-between h-[80px] min-[380px]:h-[110px] xs:h-[120px] p-1 min-[380px]:p-2 xs:p-3">
              <h3 className="text-[9px] min-[380px]:text-xs xs:text-sm font-normal line-clamp-2">
                {product.title}
              </h3>

              <div>
                <p className="text-[10px] min-[380px]:text-sm xs:text-md font-bold text-primary mb-1 xs:mb-2">
                  {product.prices}
                </p>
                <Button
                  color="primary"
                  variant="outlined"
                  className="w-full h-[20px] min-[380px]:h-[28px] xs:h-[32px] text-[9px] min-[380px]:text-xs xs:text-sm"
                >
                  Xem Ngay
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default Product;
