import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../utils/axiosConfig";
import {
  Button,
  Input,
  Select,
  Spin,
  Card,
  Tooltip,
  Empty,
  Image,
  Tag,
  Popconfirm,
  Pagination,
  message,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { ADMIN_RANDOM_CODE_URL } from "../../../constants/adminConstants";

const { Option } = Select;

function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const itemsPerPage = 20;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `product?page=${currentPage}&limit=${itemsPerPage}`
        );

        const { products, totalProducts } = data;

        if (Array.isArray(products)) {
          setProducts(products);
          setFilteredProducts(products);
          setTotalProducts(totalProducts);
        } else {
          throw new Error("Unexpected data format.");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        message.error("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  useEffect(() => {
    const fetchBrandsAndCategories = async () => {
      try {
        const [brandsResponse, categoriesResponse] = await Promise.all([
          axios.get("brand"),
          axios.get("category"),
        ]);
        setBrands(brandsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching brands and categories:", error);
        message.error("Failed to fetch brands or categories.");
      }
    };
    fetchBrandsAndCategories();
  }, []);

  const handleProductClick = (productSlug) => {
    navigate(`/${ADMIN_RANDOM_CODE_URL}/manage-product/product/${productSlug}`);
  };

  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem("adminToken");
    setLoadingDelete(productId);
    try {
      const product = products.find((product) => product._id === productId);

      if (product?.images) {
        await Promise.all(
          product.images.map((image) =>
            axios.delete(`product/delete-img/${image.public_id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );
      }

      await axios.delete(`product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedProducts = products.filter(
        (product) => product._id !== productId
      );
      setProducts(updatedProducts);
      setFilteredProducts((prevFiltered) =>
        prevFiltered.filter((product) => product._id !== productId)
      );

      message.success("Xóa Sản Phẩm Thành Công");
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Failed to delete product. Please try again.");
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleBrandChange = (value) => setSelectedBrand(value);

  const handleCategoryChange = (value) => setSelectedCategory(value);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Sản Phẩm</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() =>
              navigate(`/${ADMIN_RANDOM_CODE_URL}/manage-product/add-product`)
            }
            className="bg-blue-500 hover:bg-blue-600"
          >
            Thêm Sản Phẩm
          </Button>
        </div>

        <Card className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Tìm theo ID hoặc tên sản phẩm"
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchTerm}
              onChange={handleSearch}
            />

            <Select
              placeholder="Chọn Thương Hiệu"
              onChange={handleBrandChange}
              allowClear
              className="w-full"
            >
              {brands.map((brand) => (
                <Option key={brand._id} value={brand._id}>
                  {brand.title}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Chọn Danh Mục"
              allowClear
              onChange={handleCategoryChange}
              className="w-full"
            >
              {categories.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.title}
                </Option>
              ))}
            </Select>

            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={() => {
                const filtered = products.filter((product) => {
                  const matchesSearchTerm =
                    product.title
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    product.productID
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());
                  const matchesBrand = selectedBrand
                    ? product.brandID === selectedBrand
                    : true;
                  const matchesCategory = selectedCategory
                    ? product.categoryID === selectedCategory
                    : true;
                  return matchesSearchTerm && matchesBrand && matchesCategory;
                });
                setFilteredProducts(filtered);
              }}
              className="w-full"
            >
              Lọc Sản Phẩm
            </Button>
          </div>
        </Card>

        <Card className="shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Spin size="large" tip="Đang tải sản phẩm..." />
            </div>
          ) : filteredProducts.length === 0 ? (
            <Empty description="Không tìm thấy sản phẩm nào" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="p-3 border rounded-lg hover:shadow-md transition-all duration-300 bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 flex-shrink-0">
                      {product.images.length ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.title}
                          className="w-full h-full object-cover rounded"
                          preview={false}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            No image
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium mb-1 truncate">
                        {product.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="text-gray-500">
                          ID: {product.productID}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Tooltip title="Chỉnh sửa">
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleProductClick(product.slug)}
                          className="flex items-center text-blue-500 hover:text-blue-600"
                        />
                      </Tooltip>

                      <Tooltip title="Xóa">
                        <Popconfirm
                          title="Bạn có chắc muốn xóa?"
                          onConfirm={() => handleDeleteProduct(product._id)}
                        >
                          <Button
                            type="text"
                            size="small"
                            icon={<DeleteOutlined />}
                            loading={loadingDelete === product._id}
                            className="flex items-center text-red-500 hover:text-red-600"
                          />
                        </Popconfirm>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                current={currentPage}
                total={totalProducts}
                pageSize={itemsPerPage}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} của ${total} sản phẩm`
                }
                className="text-sm"
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default ManageProduct;
