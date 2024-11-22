import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb, Spin, Pagination, Segmented, Button, Tag } from "antd";
import axios from "../../utils/axiosConfig";
import Product from "../../components/user/Product";
import ProductBrandFilter from "../../components/user/ProductBrandFilter";
import ProductSeriesFilter from "../../components/user/ProductSeriesFilter";
import FilterOption from "../../components/user/Filter";
import Filter from "../../components/user/Filter";

function ProductList() {
  const { categorySlug, brandSlug } = useParams();

  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(1);
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [filters, setFilters] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [series, setSeries] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const itemsPerPage = 25;

  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [selectedTags, setSelectedTags] = useState([]);
  const [tempSelectedTags, setTempSelectedTags] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`category/${categorySlug}`);
        setCategory(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categorySlug]);

  useEffect(() => {
    // Reset filter options và tags khi category thay đổi
    setOptions([]);
    setSelectedTags([]);
  }, [categorySlug]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setCurrentPage(1);
  };

  const handleSeriesSelect = (series) => {
    setSelectedSeries(series);
    setCurrentPage(1);
  };

  const handleOptionClick = (optionID) => {
    setOptions((prevOptions) => {
      if (prevOptions.includes(optionID)) {
        return prevOptions.filter((id) => id !== optionID);
      } else {
        return [...prevOptions, optionID];
      }
    });
    setCurrentPage(1);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin tip="Loading filters..." />
      </div>
    );
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalProducts);

  const segmentedOptions = [
    { label: "Thứ tự mặc định", value: "" },
    { label: "Sản phẩm mới", value: "newProduct" },
    { label: "Sản phẩm bán chạy", value: "mostPopular" },
    { label: "Sản phẩm nổi bật", value: "featuredProduct" },
  ];

  return (
    <div className="w-full bg-secondary grid justify-center items-center px-4 lg:px-8">
      <div className="flex w-full xl:w-[1200px] py-3">
        <Breadcrumb
          items={[
            { title: <a href="/">Trang Chủ</a> },
            { title: category ? category.title : "Loading category..." },
            ...(selectedBrand ? [{ title: selectedBrand.title }] : []),
          ]}
        />
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

          <div className="flex flex-col sm:flex-row justify-between text-sm mb-4">
            <div className="flex flex-col gap-2 mb-4 sm:mb-0">
              <div>Sắp xếp theo:</div>
              <div className="overflow-x-auto">
                <Segmented
                  options={segmentedOptions}
                  className="min-w-[300px] sm:min-w-0"
                />
              </div>
            </div>

            <div className="text-sm">
              Hiển thị {startItem} - {endItem} trong tổng {totalProducts} kết
              quả
            </div>
          </div>

          <div className="grid grid-cols-2 min-[380px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2 min-[380px]:gap-3 justify-items-center">
            <Product
              category={category}
              brand={selectedBrand}
              series={selectedSeries}
              page={currentPage}
              limit={itemsPerPage}
              setTotalProducts={setTotalProducts}
              options={options}
            />
          </div>

          {totalProducts > itemsPerPage && (
            <Pagination
              align="center"
              current={currentPage}
              total={totalProducts}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
              className="mt-4"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
