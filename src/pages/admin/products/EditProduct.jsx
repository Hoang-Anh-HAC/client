import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFetchData } from "../../../hooks/useFetchData";
import axios from "../../../utils/axiosConfig";
import {
  message,
  Input,
  Button,
  Select,
  Upload,
  Form,
  Row,
  Col,
  Spin,
  Checkbox,
  Tabs,
} from "antd";
import {
  MinusOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useImageHandler } from "../../../hooks/useImageHandler";

function EditProduct() {
  const { productSlug } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const {
    fileList,
    isLoading: imageLoading,
    handleAddToFileList,
    handleRemoveFromFileList,
    handleRemoveFromServer,
    uploadImagesToServer,
  } = useImageHandler();

  // Fetch product data
  const {
    data: product,
    loading: productLoading,
    refetch: refetchProduct,
    setData: setProduct,
  } = useFetchData(`/product/${productSlug}`, [productSlug]);

  // Fetch categories
  const { data: categories = [], loading: categoriesLoading } =
    useFetchData("/category");

  // Fetch brands based on selected category
  const { data: brands = [], loading: brandsLoading } = useFetchData(
    product?.categoryID?._id
      ? `brand?categoryIDs=${product.categoryID._id}`
      : null,
    [product?.categoryID?._id]
  );

  // Fetch series based on selected category and brand
  const { data: series = [], loading: seriesLoading } = useFetchData(
    product?.categoryID?._id && product?.brandID?._id
      ? `series?categoryID=${product.categoryID._id}&brandID=${product.brandID._id}`
      : null,
    [product?.categoryID?._id, product?.brandID?._id]
  );

  // Thêm state để lưu trữ filters và options
  const [cachedFilters, setCachedFilters] = useState([]);

  // Chỉ fetch filters khi ở tab filters và chưa có cached data
  const { data: filters = [], setData: setFilters } = useFetchData(
    activeTab === "filters" &&
      product?.categoryID?._id &&
      cachedFilters.length === 0
      ? `filter?categoryID=${product.categoryID._id}`
      : null,
    [activeTab, product?.categoryID?._id]
  );

  // Cập nhật cachedFilters khi có filters mới
  useEffect(() => {
    if (filters?.length > 0) {
      setCachedFilters(filters);
    }
  }, [filters]);

  // Fetch options khi có filters và lưu vào cache
  useEffect(() => {
    const fetchOptions = async () => {
      // Kiểm tra nếu đã có options trong cache thì không fetch lại
      if (
        !cachedFilters?.length ||
        cachedFilters.some((filter) => filter.options)
      )
        return;

      try {
        const url = `option?${cachedFilters
          .map((filter) => `filterID=${filter._id}`)
          .join("&")}`;

        const { data: optionsData } = await axios.get(url);
        const updatedFilters = cachedFilters.map((filter) => ({
          ...filter,
          options: optionsData.filter(
            (option) => option.filterID === filter._id
          ),
        }));

        setCachedFilters(updatedFilters);
        setFilters(updatedFilters);
      } catch (error) {
        console.error("Lỗi khi tải options:", error);
        message.error("Không thể tải options");
      }
    };

    fetchOptions();
  }, [cachedFilters?.length]);

  // Save changes
  const handleSaveAll = async () => {
    if (!isEditing) {
      message.info("Không có thay đổi");
      return;
    }

    try {
      // Upload new images if any
      const newImages = await uploadImagesToServer();

      const updatedProduct = {
        ...product,
        images: [...product.images, ...newImages],
      };

      await axios.put(`/product/${product._id}`, updatedProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      setProduct(updatedProduct);
      setIsEditing(false);
      message.success("Lưu thành công!");
    } catch (error) {
      console.error("Lỗi:", error);
      message.error("Lỗi khi lưu thay đổi!");
    }
  };

  const handleFilterSelected = (optionId) => {
    setProduct((prev) => {
      const currentOptions = prev.optionIDs || [];
      const isSelected = currentOptions.some(
        (option) => option._id === optionId
      );

      const newOptions = isSelected
        ? currentOptions.filter((option) => option._id !== optionId)
        : [...currentOptions, { _id: optionId }];

      return {
        ...prev,
        optionIDs: newOptions,
      };
    });
    setIsEditing(true);
  };

  // Specification handling
  const handleSpecificationChange = useCallback(
    (index, field, value) => {
      setProduct((prev) => {
        const newSpecs = [...prev.specifications];
        newSpecs[index] = {
          ...newSpecs[index],
          [field]: value,
        };
        return {
          ...prev,
          specifications: newSpecs,
        };
      });
      setIsEditing(true);
    },
    [setProduct]
  );

  const handleAddSpecification = useCallback(() => {
    setProduct((prev) => ({
      ...prev,
      specifications: [
        ...(prev.specifications || []),
        { title: "", details: "" },
      ],
    }));
    setIsEditing(true);
  }, [setProduct]);

  const handleRemoveSpecification = useCallback(
    (index) => {
      setProduct((prev) => ({
        ...prev,
        specifications: prev.specifications.filter((_, i) => i !== index),
      }));
      setIsEditing(true);
    },
    [setProduct]
  );

  const handleValueChange = useCallback(
    (field, value) => {
      setProduct((prev) => {
        // Xử lý đặc biệt cho categoryID, brandID, và seriesID
        if (field === "categoryID") {
          return {
            ...prev,
            categoryID: { _id: value },
            brandID: null, // Reset brandID khi thay đổi category
            seriesID: null, // Reset seriesID khi thay đổi category
          };
        }

        if (field === "brandID") {
          return {
            ...prev,
            brandID: { _id: value },
            seriesID: null, // Reset seriesID khi thay đổi brand
          };
        }

        if (field === "seriesID") {
          return {
            ...prev,
            seriesID: { _id: value },
          };
        }

        // Xử lý cho các trường thông thường
        return {
          ...prev,
          [field]: value,
        };
      });
      setIsEditing(true);
    },
    [setProduct]
  );

  // Thay thế nhiều state loading riêng lẻ bằng một object
  const [loadingStates, setLoadingStates] = useState({
    page: false,
    image: false,
    save: false,
  });

  // Helper function để update loading state
  const setLoading = (key, value) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };

  // Kiểm tra tất cả các trạng thái loading
  const isPageLoading =
    productLoading ||
    categoriesLoading ||
    brandsLoading ||
    seriesLoading ||
    imageLoading;

  // Thêm hàm xử lý xóa ảnh trong EditProduct
  const handleImageRemove = async (publicId) => {
    const deletedId = await handleRemoveFromServer(publicId);
    if (deletedId) {
      setProduct((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.public_id !== publicId),
      }));
      setIsEditing(true);
    }
  };

  return (
    <Spin spinning={isPageLoading} tip="Đang tải...">
      <div className="p-5 max-w-3xl mx-auto">
        <h1 className="text-center text-2xl font-semibold mb-6">
          Chỉnh sửa sản phẩm
        </h1>

        {!product ? (
          <p className="text-center">Không tìm thấy sản phẩm</p>
        ) : (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <Tabs.TabPane tab="Thông tin cơ bản" key="basic">
              <Form layout="vertical">
                <Form.Item label="Tiêu đề">
                  <Input
                    value={product?.title}
                    onChange={(e) => handleValueChange("title", e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="Mã Sản Phẩm">
                  <Input
                    value={product.productID}
                    onChange={(e) =>
                      handleValueChange("productID", e.target.value)
                    }
                  />
                </Form.Item>

                <Form.Item label="Mô tả">
                  <Input.TextArea
                    value={product.description}
                    onChange={(e) =>
                      handleValueChange("description", e.target.value)
                    }
                  />
                </Form.Item>

                <Form.Item label="Giá">
                  <Input
                    value={product.prices}
                    onChange={(e) =>
                      handleValueChange("prices", e.target.value)
                    }
                  />
                </Form.Item>

                <Form.Item label="Số lượng">
                  <Input
                    type="number"
                    value={product.quantity}
                    onChange={(e) =>
                      handleValueChange("quantity", e.target.value)
                    }
                  />
                </Form.Item>

                <Form.Item label="Danh mục">
                  <Select
                    value={product?.categoryID?._id}
                    onChange={(value) => handleValueChange("categoryID", value)}
                    options={
                      categories?.map((category) => ({
                        value: category._id,
                        label: category.title,
                      })) || []
                    }
                    placeholder="Chọn danh mục"
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    loading={categoriesLoading}
                  />
                </Form.Item>

                <Form.Item label="Thương hiệu">
                  <Select
                    value={product?.brandID?._id}
                    onChange={(value) => handleValueChange("brandID", value)}
                    options={
                      brands?.map((brand) => ({
                        value: brand._id,
                        label: brand.title,
                      })) || []
                    }
                    placeholder="Chọn thương hiệu"
                    loading={brandsLoading}
                    disabled={!product?.categoryID}
                  />
                </Form.Item>

                <Form.Item label="Dòng sản phẩm">
                  <Select
                    value={product?.seriesID?._id}
                    onChange={(value) => handleValueChange("seriesID", value)}
                    options={
                      series?.map((serie) => ({
                        value: serie._id,
                        label: serie.title,
                      })) || []
                    }
                    placeholder="Chọn dòng sản phẩm"
                    loading={seriesLoading}
                    disabled={!product?.brandID}
                  />
                </Form.Item>

                <Form.Item label="Hình ảnh sản phẩm">
                  <Spin spinning={imageLoading} tip="Đang xử lý...">
                    <div className="flex flex-wrap gap-2">
                      {product?.images?.map((img) => (
                        <div
                          key={img.public_id}
                          className="relative flex items-center justify-center"
                        >
                          <img
                            src={img.url}
                            alt="product"
                            className="w-24 h-24 object-cover"
                          />
                          <Button
                            icon={<MinusOutlined />}
                            onClick={() => handleImageRemove(img.public_id)}
                            className="absolute top-0 right-0"
                            loading={imageLoading}
                          />
                        </div>
                      ))}

                      {fileList.map((file) => (
                        <div
                          key={file.uid}
                          className="relative flex items-center justify-center"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="w-24 h-24 object-cover"
                          />
                          <Button
                            icon={<MinusOutlined />}
                            onClick={() => handleRemoveFromFileList(file)}
                            className="absolute top-0 right-0"
                            loading={imageLoading}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-2">
                      <Upload
                        showUploadList={false}
                        beforeUpload={(file) => {
                          setIsEditing(true);
                          return handleAddToFileList(file);
                        }}
                        accept="image/*"
                        disabled={imageLoading}
                      >
                        <Button
                          icon={<PlusCircleOutlined />}
                          loading={imageLoading}
                        >
                          Tải lên hình ảnh
                        </Button>
                      </Upload>
                    </div>
                  </Spin>
                </Form.Item>

                <Form.Item label="Thông số kỹ thuật">
                  {product?.specifications &&
                    product.specifications.map((spec, index) => (
                      <Row key={index} gutter={16}>
                        <Col span={11}>
                          <Input
                            placeholder="Tiêu đề"
                            value={spec.title}
                            onChange={(e) =>
                              handleSpecificationChange(
                                index,
                                "title",
                                e.target.value
                              )
                            }
                          />
                        </Col>
                        <Col span={11}>
                          <Input
                            placeholder="Chi tiết"
                            value={spec.details}
                            onChange={(e) =>
                              handleSpecificationChange(
                                index,
                                "details",
                                e.target.value
                              )
                            }
                          />
                        </Col>
                        <Col span={2}>
                          <Button
                            icon={<MinusCircleOutlined />}
                            onClick={() => handleRemoveSpecification(index)}
                          />
                        </Col>
                      </Row>
                    ))}
                  <Button
                    type="dashed"
                    onClick={handleAddSpecification}
                    icon={<PlusCircleOutlined />}
                  >
                    Thêm thông số
                  </Button>
                </Form.Item>

                <Button
                  type="primary"
                  onClick={handleSaveAll}
                  disabled={!isEditing}
                >
                  Lưu
                </Button>
              </Form>
            </Tabs.TabPane>

            <Tabs.TabPane tab="Bộ lọc" key="filters">
              {activeTab === "filters" && (
                <div className="mt-4">
                  {!product?.categoryID ? (
                    <div className="text-center text-gray-500">
                      Vui lòng chọn danh mục trước
                    </div>
                  ) : cachedFilters && cachedFilters.length > 0 ? (
                    <>
                      <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                          <tr>
                            <th className="border border-gray-300 p-2">
                              Tên bộ lọc
                            </th>
                            <th className="border border-gray-300 p-2">
                              Tùy chọn
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {cachedFilters.map((filter) => (
                            <tr key={filter._id}>
                              <td className="border border-gray-300 p-2">
                                {filter.title}
                              </td>
                              <td className="border border-gray-300 p-2">
                                <ul className="grid grid-cols-4 gap-2">
                                  {filter.options?.map((option) => (
                                    <li key={option._id}>
                                      <Checkbox
                                        checked={product?.optionIDs?.some(
                                          (optionId) =>
                                            optionId._id === option._id
                                        )}
                                        onChange={() =>
                                          handleFilterSelected(option._id)
                                        }
                                      >
                                        {option.title}
                                      </Checkbox>
                                    </li>
                                  ))}
                                </ul>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <Button
                        type="primary"
                        onClick={handleSaveAll}
                        disabled={!isEditing}
                        className="mt-4"
                      >
                        Lưu thay đổi
                      </Button>
                    </>
                  ) : (
                    <div className="text-center text-gray-500">
                      Không có bộ lọc nào cho danh mục này
                    </div>
                  )}
                </div>
              )}
            </Tabs.TabPane>
          </Tabs>
        )}
      </div>
    </Spin>
  );
}

export default EditProduct;
