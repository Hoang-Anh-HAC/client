import React, { useEffect, useState } from "react";
import axios from "../../../utils/axiosConfig";
import { message, Input, Button, Select, Spin, List } from "antd";

const { Option } = Select;

function ManageSeries() {
  const [series, setSeries] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editedSeries, setEditedSeries] = useState({
    title: "",
    brandID: "",
    categoryID: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentSeriesId, setCurrentSeriesId] = useState(null);
  const [loading, setLoading] = useState(false);
  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchSeries(), fetchBrands(), fetchCategories()]);
    };
    fetchData();
  }, []);

  const fetchSeries = async () => {
    try {
      const { data } = await axios.get("/series", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setSeries(data);
    } catch (error) {
      console.error("Error fetching series:", error);
      message.error("Failed to fetch series.");
    }
  };

  const fetchBrands = async () => {
    try {
      const { data } = await axios.get("/brand");
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
      message.error("Failed to fetch brands.");
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/category");
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to fetch categories.");
    }
  };

  const handleSubmit = async (method, url, data) => {
    setLoading(true);
    try {
      await axios[method](url, data, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      fetchSeries();
      message.success(
        `${method === "post" ? "Series added" : "Series updated"} successfully!`
      );
      resetForm();
    } catch (error) {
      console.error(
        `Error ${method === "post" ? "adding" : "updating"} series:`,
        error
      );
      message.error(
        `Failed to ${method === "post" ? "add" : "update"} series.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddSeries = () => {
    handleSubmit("post", "/series", editedSeries);
  };

  const handleUpdateSeries = () => {
    handleSubmit("put", `/series/${currentSeriesId}`, editedSeries);
  };

  const handleEditSeries = (series) => {
    setEditedSeries({
      title: series.title,
      brandID: series.brandID,
      categoryID: series.categoryID,
    });
    setIsEditing(true);
    setCurrentSeriesId(series._id);
  };

  const handleDeleteSeries = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/series/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setSeries((prev) => prev.filter((s) => s._id !== id));
      message.success("Series deleted successfully!");
    } catch (error) {
      console.error("Error deleting series:", error);
      message.error("Failed to delete series.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditedSeries({ title: "", brandID: "", categoryID: "" });
    setIsEditing(false);
    setCurrentSeriesId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Quản lý Series</h1>

      <div className="bg-white p-4 mb-6 border rounded">
        <h2 className="text-lg font-medium mb-4">
          {isEditing ? "Chỉnh sửa Series" : "Thêm Series Mới"}
        </h2>

        <div className="space-y-3">
          <Input
            placeholder="Tên Series"
            value={editedSeries.title}
            onChange={(e) =>
              setEditedSeries({ ...editedSeries, title: e.target.value })
            }
          />

          <Select
            className="w-full"
            placeholder="Chọn Thương hiệu"
            value={editedSeries.brandID || undefined}
            onChange={(value) =>
              setEditedSeries({ ...editedSeries, brandID: value })
            }
            showSearch
            optionFilterProp="children"
          >
            {brands.map((brand) => (
              <Option key={brand._id} value={brand._id}>
                {brand.title}
              </Option>
            ))}
          </Select>

          <Select
            className="w-full"
            placeholder="Chọn Danh mục"
            value={editedSeries.categoryID || undefined}
            onChange={(value) =>
              setEditedSeries({ ...editedSeries, categoryID: value })
            }
            showSearch
            optionFilterProp="children"
          >
            {categories.map((category) => (
              <Option key={category._id} value={category._id}>
                {category.title}
              </Option>
            ))}
          </Select>

          <div className="flex gap-2">
            <Button
              onClick={isEditing ? handleUpdateSeries : handleAddSeries}
              type="primary"
              loading={loading}
            >
              {isEditing ? "Cập nhật" : "Thêm mới"}
            </Button>
            {isEditing && <Button onClick={resetForm}>Hủy</Button>}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 border rounded">
        <h2 className="text-lg font-medium mb-4">Danh sách Series</h2>

        <Spin spinning={loading}>
          <List
            itemLayout="horizontal"
            dataSource={series}
            renderItem={(s) => (
              <List.Item
                actions={[
                  <Button onClick={() => handleEditSeries(s)} type="link">
                    Sửa
                  </Button>,
                  <Button
                    onClick={() => handleDeleteSeries(s._id)}
                    type="link"
                    danger
                  >
                    Xóa
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={s.title}
                  description={
                    <div>
                      <div>
                        Thương hiệu:{" "}
                        {brands.find((b) => b._id === s.brandID)?.title ||
                          "N/A"}
                      </div>
                      <div>
                        Danh mục:{" "}
                        {categories.find((c) => c._id === s.categoryID)
                          ?.title || "N/A"}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Spin>
      </div>
    </div>
  );
}

export default ManageSeries;
