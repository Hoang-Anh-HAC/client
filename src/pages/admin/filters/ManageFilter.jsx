import React, { useEffect, useState } from "react";
import axios from "../../../utils/axiosConfig";
import { Input, Button, List, message, Card, Modal } from "antd";

function ManageOption() {
  const [filters, setFilters] = useState([]);
  const [filterTitle, setFilterTitle] = useState("");
  const [editingFilterId, setEditingFilterId] = useState(null);
  const [optionTitles, setOptionTitles] = useState({});
  const [editingOption, setEditingOption] = useState(null);
  const [modalOptionTitle, setModalOptionTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const adminToken = localStorage.getItem("adminToken");

  const fetchFilters = async () => {
    try {
      const response = await axios.get("/filter", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setFilters(response.data);
    } catch (error) {
      console.error("Error fetching filters:", error);
      message.error("Lỗi khi lấy danh sách filter");
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  const handleFilterSave = async () => {
    if (!filterTitle.trim()) {
      message.warning("Tiêu đề filter không được để trống");
      return;
    }

    try {
      if (editingFilterId) {
        const currentFilter = filters.find(
          (filter) => filter._id === editingFilterId
        );
        await axios.put(
          `/filter/${editingFilterId}`,
          { title: filterTitle, optionIDs: currentFilter.optionIDs },
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        setEditingFilterId(null);
      } else {
        await axios.post(
          "/filter",
          { title: filterTitle, optionIDs: [] },
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );
      }
      fetchFilters();
      setFilterTitle("");
    } catch (error) {
      console.error("Error creating/updating filter:", error);
      message.error("Lỗi khi thêm/cập nhật filter");
    }
  };

  const handleFilterDelete = async (filterID) => {
    try {
      await axios.delete(`/filter/${filterID}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      fetchFilters();
    } catch (error) {
      console.error("Error creating/updating filter:", error);
      message.error("Lỗi khi thêm/cập nhật filter");
    }
  };

  const handleOptionCreate = async (filterID) => {
    const newOptionTitle = optionTitles[filterID] || "";
    if (!newOptionTitle.trim()) {
      message.warning("Tên option không được để trống");
      return;
    }

    try {
      const response = await axios.post(
        `/option`,
        { title: newOptionTitle, filterID },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      message.success("Đã thêm option thành công");

      const newOption = response.data;
      setFilters((prevFilters) =>
        prevFilters.map((filter) =>
          filter._id === filterID
            ? {
                ...filter,
                optionIDs: [...filter.optionIDs, newOption],
              }
            : filter
        )
      );

      setOptionTitles((prev) => ({ ...prev, [filterID]: "" }));
    } catch (error) {
      console.error("Error creating option:", error);
      message.error("Lỗi khi thêm option");
    }
  };

  const handleOptionEdit = async () => {
    if (!editingOption) return;

    try {
      await axios.put(
        `/option/${editingOption._id}`,
        { title: modalOptionTitle },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      message.success("Đã cập nhật option thành công");
      setFilters((prevFilters) =>
        prevFilters.map((filter) =>
          filter._id === editingOption.filterID
            ? {
                ...filter,
                optionIDs: filter.optionIDs.map((option) =>
                  option._id === editingOption._id
                    ? { ...option, title: modalOptionTitle }
                    : option
                ),
              }
            : filter
        )
      );

      setEditingOption(null);
    } catch (error) {
      console.error("Error updating option:", error);
      message.error("Lỗi khi cập nhật option");
    }
  };

  const handleOptionDelete = async (optionId) => {
    try {
      await axios.delete(`/option/${optionId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      message.success("Đã xóa option thành công");

      fetchFilters();
    } catch (error) {
      console.error("Error deleting option:", error);
      message.error("Lỗi khi xóa option");
    }
  };

  const showEditModal = (option) => {
    setEditingOption(option);
    setModalOptionTitle(option.title);
  };

  const indexOfLastFilter = currentPage * itemsPerPage;
  const indexOfFirstFilter = indexOfLastFilter - itemsPerPage;
  const currentFilters = filters.slice(indexOfFirstFilter, indexOfLastFilter);
  const totalPages = Math.ceil(filters.length / itemsPerPage);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Quản lý Filter và Option
      </h1>

      <Card className="mb-8 shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Quản lý Filter
        </h2>
        <div className="flex gap-3 mb-4">
          <Input
            placeholder="Tiêu đề filter"
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
            className="flex-1"
            size="large"
          />
          <Button type="primary" onClick={handleFilterSave} size="large">
            {editingFilterId ? "Cập nhật Filter" : "Thêm Filter"}
          </Button>
        </div>

        <List
          bordered
          dataSource={currentFilters}
          className="bg-white rounded-lg"
          renderItem={(filter) => (
            <List.Item className="hover:bg-gray-50">
              <div className="flex flex-col w-full space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">
                    {filter.title}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleFilterDelete(filter._id)}
                      danger
                      className="hover:opacity-80"
                    >
                      Xóa
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingFilterId(filter._id);
                        setFilterTitle(filter.title);
                      }}
                      type="primary"
                      ghost
                    >
                      Chỉnh sửa
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {filter.optionIDs.length === 0 ? (
                    <span className="text-gray-500 italic">
                      Không có option nào.
                    </span>
                  ) : (
                    filter.optionIDs.map((option) => (
                      <div
                        key={option._id}
                        className="flex justify-between items-center border rounded-md p-2 hover:border-blue-400 transition-colors"
                      >
                        <p
                          className="truncate flex-1 mr-2"
                          title={option.title}
                        >
                          {option.title}
                        </p>
                        <div className="flex shrink-0">
                          <Button
                            type="text"
                            onClick={() => handleOptionDelete(option._id)}
                            className="text-red-500 hover:text-red-600"
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
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </Button>
                          <Button
                            type="text"
                            onClick={() =>
                              showEditModal({ ...option, filterID: filter._id })
                            }
                            className="text-blue-500 hover:text-blue-600"
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
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                              />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tên option mới"
                      value={optionTitles[filter._id] || ""}
                      onChange={(e) =>
                        setOptionTitles((prev) => ({
                          ...prev,
                          [filter._id]: e.target.value,
                        }))
                      }
                      className="flex-1"
                    />
                    <Button
                      type="primary"
                      onClick={() => handleOptionCreate(filter._id)}
                      className="flex items-center justify-center"
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
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />

        <div className="flex justify-between items-center mt-6">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            type="default"
            className="flex items-center gap-1"
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
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Trước
          </Button>
          <span className="text-gray-600">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            type="default"
            className="flex items-center gap-1"
          >
            Sau
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
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Button>
        </div>
      </Card>

      <Modal
        title="Chỉnh sửa Option"
        open={!!editingOption}
        onOk={handleOptionEdit}
        onCancel={() => setEditingOption(null)}
        className="rounded-lg"
      >
        <Input
          value={modalOptionTitle}
          onChange={(e) => setModalOptionTitle(e.target.value)}
          className="mt-2"
          size="large"
        />
      </Modal>
    </div>
  );
}

export default ManageOption;
