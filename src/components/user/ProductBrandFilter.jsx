import React, { useEffect, useState } from "react";
import { Collapse, Radio, Spin, Alert } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import { useData } from "../../contexts/DataContext";

const ProductBrandFilter = ({
  categoryId,
  onSelectBrand,
  selectedBrand,
  setSelectedSeries,
}) => {
  const { categorySlug, brandSlug } = useParams();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    const fetchBrands = async () => {
      setLoading(true);
      try {
        const responseBrand = await axios.get(
          `/brand?categoryIDs=${categoryId}`
        );

        setBrands(responseBrand.data);
      } catch (error) {
        setError("Error loading brands. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [categoryId]);

  const handleBrandChange = (e) => {
    const selectedBrandSlug = e.target.value;
    const selectedBrand = brands.find(
      (brand) => brand.slug === selectedBrandSlug
    );
    onSelectBrand(selectedBrand);
    setSelectedSeries(null);

    const newPath = selectedBrandSlug
      ? `/product-list/${categorySlug}/${selectedBrandSlug}`
      : `/product-list/${categorySlug}`;

    navigate(newPath);
  };

  const handleRemoveBrandSelected = () => {
    navigate(`/product-list/${categorySlug}`);
    onSelectBrand(null);
    setSelectedSeries(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  const items = [
    {
      key: "1",
      label: <div className="font-semibold">Thương Hiệu</div>,
      extra: brandSlug && (
        <span
          className="cursor-pointer hover:underline text-primary"
          onClick={handleRemoveBrandSelected}
        >
          Bỏ chọn
        </span>
      ),
      children: (
        <Radio.Group
          onChange={handleBrandChange}
          value={brandSlug}
          className="w-full space-y-2"
        >
          <div className="grid grid-cols-2 gap-2">
            {brands.length > 0 ? (
              brands.map((brand) => (
                <Radio key={brand._id} value={brand.slug}>
                  {brand.title}
                </Radio>
              ))
            ) : (
              <div>Không có thương hiệu nào cho danh mục này.</div>
            )}
          </div>
        </Radio.Group>
      ),
    },
  ];

  return (
    <Collapse
      defaultActiveKey={["1"]}
      ghost
      expandIconPosition="end"
      items={items}
    />
  );
};

export default ProductBrandFilter;
