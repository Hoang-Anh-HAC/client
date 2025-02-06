import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Breadcrumb, Spin, Pagination, Button, Tag, Select } from "antd";
import axios from "../../utils/axiosConfig";
import Product from "../../components/user/Product";
import ProductBrandFilter from "../../components/user/ProductBrandFilter";
import ProductSeriesFilter from "../../components/user/ProductSeriesFilter";
import FilterOption from "../../components/user/Filter";
import Filter from "../../components/user/Filter";

function ProductList() {
  const { categorySlug, brandSlug } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [filters, setFilters] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [series, setSeries] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tempSelectedTags, setTempSelectedTags] = useState([]);
  const [sortType, setSortType] = useState("default");

  const itemsPerPage = 16;

  useEffect(() => {
    setSelectedBrand(null);
    setSelectedSeries(null);
    setBrand(null);
    setCurrentPage(1);
    setOptions([]);
    setSelectedTags([]);
    setSortType("default");
  }, [categorySlug]);

  const fetchCategory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`category/${categorySlug}`);
      setCategory(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching category:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [categorySlug]);

  const fetchBrand = useCallback(async (brandSlug) => {
    if (!brandSlug) return null;
    try {
      const response = await axios.get(`brand/${brandSlug}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching brand:", error);
      return null;
    }
  }, []);

  const handleBrandSelect = async (brand) => {
    setCurrentPage(1);
    const fetchedBrand = await fetchBrand(brand.slug);
    if (fetchedBrand) {
      setSelectedBrand(fetchedBrand);
      setBrand(fetchedBrand);
    }
  };

  useEffect(() => {
    fetchCategory();
    if (brandSlug) {
      fetchBrand(brandSlug).then((fetchedBrand) => {
        setSelectedBrand(fetchedBrand);
        setBrand(fetchedBrand);
      });
    } else {
      setSelectedBrand(null);
    }
  }, [fetchCategory, brandSlug]);

  useEffect(() => {
    fetchBrand();
  }, [fetchBrand]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSeriesSelect = (series) => {
    setSelectedSeries(series);
    setCurrentPage(1);
  };

  const handleOptionClick = (optionID) => {
    setOptions((prevOptions) => {
      const newOptions = prevOptions.includes(optionID)
        ? prevOptions.filter((id) => id !== optionID)
        : [...prevOptions, optionID];
      setCurrentPage(1);
      return newOptions;
    });
  };

  const handleFilterChange = (selectedOptions) => {
    setOptions(selectedOptions.map((opt) => opt.id));
    setSelectedTags(selectedOptions);
    setCurrentPage(1);
    setShowMobileFilter(false);
  };

  const handleTempFilterChange = (selectedOptions) => {
    setTempSelectedTags(selectedOptions);
  };

  const handleApplyFilter = () => {
    setOptions(tempSelectedTags.map((opt) => opt.id));
    setSelectedTags(tempSelectedTags);
    setCurrentPage(1);
    setShowMobileFilter(false);
  };

  const handleSortChange = (value) => {
    setSortType(value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin tip="Loading filters..." />
      </div>
    );
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalProducts);

  const sortOptions = [
    { label: "Thứ tự mặc định", value: "default" },
    { label: "Giá thấp đến cao", value: "price_asc" },
    { label: "Giá cao đến thấp", value: "price_desc" },
    { label: "Sản phẩm nổi bật", value: "featured" },
  ];

  const breadcrumbItems = [
    {
      title: <Link to="/">Trang Chủ</Link>,
    },
    {
      title: category ? (
        <Link
          to={`/product-list/${category.slug}`}
          onClick={() => {
            setSelectedBrand(null);
            setSelectedSeries(null);
            setBrand(null);
            setCurrentPage(1);
            setOptions([]);
            setSelectedTags([]);
            setSortType("default");
          }}
          className={!brandSlug ? "font-bold text-black" : ""}
        >
          {category.title}
        </Link>
      ) : (
        "Loading category..."
      ),
    },
    ...(selectedBrand
      ? [
          {
            title: selectedBrand.title,
            className: "text-gray-500 font-semibold",
          },
        ]
      : []),
  ];

  return (
    <div className="w-full bg-secondary grid justify-center items-center px-4 lg:px-8">
      <div className="flex w-full xl:w-[1200px] py-3">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="w-full flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
            />
          </svg>
          Bộ lọc
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 w-full xl:w-[1200px] gap-4">
        <div
          className={`${
            showMobileFilter
              ? "fixed inset-0 z-50 bg-white overflow-y-auto"
              : "hidden"
          } lg:relative lg:block lg:bg-white lg:col-span-1 lg:rounded lg:pt-2 lg:mb-2 lg:h-full`}
        >
          <div className="flex justify-between items-center lg:hidden mb-4 p-4">
            <h3 className="font-semibold text-lg">Bộ lọc</h3>
            <Button onClick={() => setShowMobileFilter(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>

          <div className="flex flex-col h-[calc(100vh-120px)] lg:h-auto">
            <div className="flex-1 overflow-y-auto px-2">
              <ProductBrandFilter
                categoryId={category?._id}
                onSelectBrand={handleBrandSelect}
                selectedBrand={selectedBrand}
                setSelectedSeries={setSelectedSeries}
              />

              <ProductSeriesFilter
                category={category}
                brand={selectedBrand}
                selectedSeries={selectedSeries}
                setSelectedSeries={handleSeriesSelect}
              />

              {category && (
                <Filter
                  filterData={category.filterIDs}
                  onFilterChange={handleFilterChange}
                  selectedTags={selectedTags}
                  isMobile={showMobileFilter}
                  onTempFilterChange={handleTempFilterChange}
                />
              )}
            </div>

            <div
              className={`${
                showMobileFilter
                  ? "sticky bottom-0 p-4 border-t bg-white"
                  : "hidden"
              }`}
            >
              <Button
                type="primary"
                onClick={handleApplyFilter}
                className="w-full h-10"
              >
                Áp dụng ({tempSelectedTags.length} bộ lọc)
              </Button>
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-4 bg-white p-4 lg:p-6 gap-2 h-full rounded">
          {selectedTags.length > 0 && (
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Đã chọn {selectedTags.length} bộ lọc
                </div>
                <Button
                  type="link"
                  danger
                  className="text-sm p-0"
                  onClick={() => {
                    setSelectedTags([]);
                    setOptions([]);
                  }}
                >
                  Xóa tất cả
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Tag
                    key={tag.id}
                    closable
                    onClose={() => {
                      const newTags = selectedTags.filter(
                        (t) => t.id !== tag.id
                      );
                      setSelectedTags(newTags);
                      setOptions(newTags.map((t) => t.id));
                    }}
                  >
                    {tag.filterTitle}: {tag.title}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {totalProducts > 0 && !loading && !error && (
            <div className="flex flex-col sm:flex-row justify-between text-sm mb-4">
              <div className="flex gap-2 mb-4 sm:mb-0 items-center">
                <div>Sắp xếp theo:</div>
                <Select
                  value={sortType}
                  onChange={handleSortChange}
                  options={sortOptions}
                  className="w-[200px]"
                />
              </div>

              <div className="text-sm">
                Hiển thị {startItem} - {endItem} trong tổng {totalProducts} kết
                quả
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 min-[380px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2 min-[380px]:gap-3 justify-items-center">
            <Product
              category={category}
              selectedBrand={selectedBrand}
              series={selectedSeries}
              page={currentPage}
              limit={itemsPerPage}
              setTotalProducts={setTotalProducts}
              options={options}
              sortType={sortType}
            />
          </div>

          {totalProducts > itemsPerPage && !loading && !error && (
            <Pagination
              align="center"
              current={currentPage}
              total={totalProducts}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
              className="mt-4"
              showSizeChanger={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
