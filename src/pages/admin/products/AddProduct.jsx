import React, { useState, useEffect } from "react";
import {
  Select,
  Button,
  Upload,
  message,
  Spin,
  Image,
  Checkbox,
  Card,
  Divider,
} from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import axios from "../../../utils/axiosConfig";
import AddProductInput from "../../../components/admin/forms/AddProductInput";
import { useNavigate } from "react-router-dom";
import { ADMIN_RANDOM_CODE_URL } from "../../../constants/adminConstants";
import CustomTextArea from "../../../components/admin/forms/CustomTextArea";

const { Option } = Select;

function AddProduct() {
  const [product, setProduct] = useState({
    productID: "",
    title: "",
    description: "",
    prices: "",
    quantity: 0,
    images: [],
    categoryID: "",
    brandID: "",
    seriesID: "",
    optionIDs: [],
    specifications: [
      {
        title: "",
        details: "",
      },
    ],
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [series, setSeries] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [filters, setFilters] = useState([]);

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [priceAvailable, setPriceAvailable] = useState("true");

  const selectedCategoryID = product.categoryID;
  const selectedBrandID = product.brandID;

  const navigate = useNavigate();

  const fetchCategory = async () => {
    try {
      const categoriesResponse = await axios.get("category");
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      message.error("Không thể tải dữ liệu từ server.");
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedCategoryID.length > 0) {
          const brandResponse = await axios.get(
            `brand?categoryIDs=${selectedCategoryID}`
          );
          setBrands(brandResponse.data);
        }

        if (selectedCategoryID.length > 0 && selectedBrandID.length > 0) {
          const seriesResponse = await axios.get(
            `series?categoryID=${selectedCategoryID}&brandID=${selectedBrandID}`
          );
          setSeries(seriesResponse.data);
        }

        if (selectedCategoryID.length > 0) {
          const selectedCategory = categories.find(
            (category) => category._id === selectedCategoryID
          );

          if (selectedCategory) {
            const filters = selectedCategory.filterIDs.map((filter) => ({
              id: filter._id,
              title: filter.title,
              options: [],
            }));

            const url = `option?${filters
              .map((filter) => `filterID=${filter.id}`)
              .join("&")}`;

            const optionResponse = await axios.get(url);
            const fetchedOptions = optionResponse.data;
            const updatedFilters = filters.map((filter) => {
              const optionsForFilter = fetchedOptions.filter(
                (option) => option.filterID === filter.id
              );

              return {
                ...filter,
                options: optionsForFilter,
              };
            });

            setFilters(updatedFilters);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        message.error("Không thể tải dữ liệu từ server.");
      }
    };

    if (selectedCategoryID.length > 0) {
      fetchData();
    }
  }, [selectedCategoryID, selectedBrandID, categories]);

  const validateForm = () => {
    const requiredFields = [
      "title",
      "productID",
      "categoryID",
      "brandID",
      "prices",
      "quantity",
      "description",
    ];

    const missingFields = requiredFields.filter((field) => !product[field]);

    if (product.specifications.some((spec) => !spec.title || !spec.details)) {
      message.error("Vui lòng điền đầy đủ thông số kỹ thuật.");
      return false;
    }

    if (missingFields.length > 0) {
      message.error(`Vui lòng điền đầy đủ: ${missingFields.join(", ")}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoadingSubmit(true);

    try {
      const uploadedImages = [];
      for (const file of fileList) {
        if (file.status === "pending") {
          console.log(file);

          const formData = new FormData();
          formData.append("images", file.file);
          const token = localStorage.getItem("adminToken");
          const response = await axios.put("product/upload", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const { url, public_id } = response.data[0];
          uploadedImages.push({ url, public_id });
        } else {
          uploadedImages.push({ url: file.url, public_id: file.public_id });
        }
      }

      const priceToSubmit = product.prices ? product.prices : "Liên hệ";

      const token = localStorage.getItem("adminToken");
      if (!token) {
        message.error("Bạn chưa đăng nhập hoặc token không tồn tại.");
        return;
      }

      const response = await axios.post(
        "product",
        {
          ...product,
          prices: priceToSubmit,
          images: uploadedImages,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        message.success("Sản phẩm đã được lưu thành công!");
        setProduct({
          productID: "",
          title: "",
          description: "",
          prices: "",
          quantity: 0,
          images: [],
          categoryID: "",
          brandID: "",
          seriesID: "",
          filterIDs: [],
          specifications: [{ title: "", details: "" }],
        });

        setFileList([]);
        localStorage.removeItem("productData");
        localStorage.removeItem("fileList");
      } else {
        message.error("Không thể lưu sản phẩm. Xin thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
      message.error("Có lỗi xảy ra khi lưu sản phẩm.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Image
  const handleImageUpload = (file) => {
    const newImage = {
      uid: Date.now(),
      name: file.name,
      status: "pending",
      url: URL.createObjectURL(file),
      file: file,
    };
    setFileList((prevFileList) => [...prevFileList, newImage]);
    return false;
  };

  const handleRemoveImage = (uid) => {
    setFileList((prevFileList) =>
      prevFileList.filter((file) => file.uid !== uid)
    );
  };

  //Handle Change

  const handlePriceAvailableChange = (value) => {
    setPriceAvailable(value);
    if (value === "false") {
      setProduct((prevProduct) => ({
        ...prevProduct,
        prices: "",
      }));
    }
  };

  const handleSelectChange = (field, value) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      [field]: value,
      ...(field === "categoryID" && { optionIDs: [] }),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSpecificationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSpecifications = [...product.specifications];
    updatedSpecifications[index] = {
      ...updatedSpecifications[index],
      [name]: value,
    };
    setProduct((prevProduct) => ({
      ...prevProduct,
      specifications: updatedSpecifications,
    }));
  };

  const handleAddSpecification = () => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      specifications: [
        ...prevProduct.specifications,
        { title: "", details: "" },
      ],
    }));
  };

  const handleRemoveSpecification = (index) => {
    const updatedSpecifications = product.specifications.filter(
      (_, i) => i !== index
    );
    setProduct((prevProduct) => ({
      ...prevProduct,
      specifications: updatedSpecifications,
    }));
  };

  const handleFilterSelected = (optionID) => {
    setProduct((prevProduct) => {
      const { optionIDs } = prevProduct;

      const newOptionIDs = optionIDs.includes(optionID)
        ? optionIDs.filter((id) => id !== optionID)
        : [...optionIDs, optionID];

      return {
        ...prevProduct,
        optionIDs: newOptionIDs,
      };
    });
  };

  const navigateBack = () => {
    navigate(`/${ADMIN_RANDOM_CODE_URL}/manage-product`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <Card className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={navigateBack}
              type="text"
              className="hover:bg-gray-100"
            >
              Quay lại
            </Button>
            <h1 className="text-2xl font-bold m-0">Thêm Sản Phẩm Mới</h1>
          </div>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loadingSubmit}
            className="bg-blue-500"
          >
            Lưu Sản Phẩm
          </Button>
        </div>
      </Card>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-2">
          <Card title="Thông Tin Cơ Bản" className="mb-6">
            <div className="space-y-4">
              <AddProductInput
                label="Tên Sản Phẩm"
                name="title"
                type="text"
                placeholder="Nhập Tên Sản Phẩm"
                value={product.title}
                onChange={handleInputChange}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <AddProductInput
                  label="Mã Sản Phẩm"
                  name="productID"
                  type="text"
                  placeholder="Nhập Mã Sản Phẩm"
                  value={product.productID}
                  onChange={handleInputChange}
                  required
                />
                <AddProductInput
                  label="Số Lượng"
                  name="quantity"
                  type="number"
                  value={product.quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">
                    Có Giá Hay Không:
                  </label>
                  <Select
                    defaultValue="true"
                    className="w-full"
                    onChange={handlePriceAvailableChange}
                  >
                    <Option value="true">Có</Option>
                    <Option value="false">Không</Option>
                  </Select>
                </div>
                <AddProductInput
                  label="Giá Sản Phẩm"
                  name="prices"
                  type="text"
                  placeholder="Nhập Giá Sản Phẩm"
                  value={product.prices}
                  onChange={handleInputChange}
                  disabled={priceAvailable === "false"}
                />
              </div>
            </div>
          </Card>

          {/* Description & Specifications */}
          <Card title="Mô Tả & Thông Số Kỹ Thuật" className="mb-6">
            <CustomTextArea
              label="Mô Tả"
              name="description"
              value={product.description}
              onChange={handleInputChange}
              placeholder="Nhập mô tả sản phẩm..."
              className="mb-4"
            />

            <Divider />

            <div className="specifications-section">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Thông Số Kỹ Thuật</h3>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={handleAddSpecification}
                >
                  Thêm Thông Số
                </Button>
              </div>

              {product.specifications.map((spec, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="title"
                      value={spec.title}
                      onChange={(e) => handleSpecificationChange(index, e)}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Tiêu đề"
                    />
                    <div className="flex gap-2">
                      <textarea
                        name="details"
                        value={spec.details}
                        onChange={(e) => handleSpecificationChange(index, e)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Chi tiết"
                        rows={3}
                      />
                      <Button
                        danger
                        icon={<MinusOutlined />}
                        onClick={() => handleRemoveSpecification(index)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Categories & Images */}
        <div className="lg:col-span-1">
          <Card title="Phân Loại" className="mb-6">
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Danh Mục:</label>
                <Select
                  onChange={(value) => handleSelectChange("categoryID", value)}
                  placeholder="Chọn Danh Mục"
                  className="w-full"
                >
                  {categories.map((category) => (
                    <Option key={category._id} value={category._id}>
                      {category.title}
                    </Option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Thương Hiệu:</label>
                <Select
                  onChange={(value) => handleSelectChange("brandID", value)}
                  placeholder="Chọn Thương Hiệu"
                  className="w-full"
                >
                  {brands.map((brand) => (
                    <Option key={brand._id} value={brand._id}>
                      {brand.title}
                    </Option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Dòng Sản Phẩm:</label>
                <Select
                  onChange={(value) => handleSelectChange("seriesID", value)}
                  placeholder="Chọn Dòng Sản Phẩm"
                  className="w-full"
                  showSearch
                >
                  {series.map((serie) => (
                    <Option key={serie._id} value={serie._id}>
                      {serie.title}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Bộ lọc */}
              {filters.map((filter) => (
                <div key={filter.id} className="mb-4">
                  <label className="block mb-2 font-medium">
                    {filter.title}:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {filter.options.map((option) => (
                      <Checkbox
                        key={option._id}
                        checked={product.optionIDs.includes(option._id)}
                        onChange={() => handleFilterSelected(option._id)}
                        className="border border-gray-300 rounded px-2 py-1 hover:bg-gray-100"
                      >
                        {option.title}
                      </Checkbox>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Hình Ảnh Sản Phẩm">
            <Upload
              beforeUpload={handleImageUpload}
              showUploadList={false}
              accept="image/*"
              className="mb-4"
            >
              <Button icon={<PlusOutlined />} block>
                Tải Hình Ảnh Lên
              </Button>
            </Upload>

            <div className="grid grid-cols-2 gap-2">
              {fileList.map((file) => (
                <div key={file.uid} className="relative group">
                  <Image
                    src={file.url}
                    alt={file.name}
                    className="w-full h-32 object-cover rounded"
                  />
                  <Button
                    danger
                    icon={<MinusOutlined />}
                    onClick={() => handleRemoveImage(file.uid)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
