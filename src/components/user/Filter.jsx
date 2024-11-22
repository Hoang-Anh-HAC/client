import React, { useEffect, useState } from "react";
import { Collapse, Checkbox, Spin } from "antd";
import axios from "../../utils/axiosConfig";

const Filter = ({
  filterData,
  onFilterChange,
  selectedTags = [],
  isMobile = false,
  onTempFilterChange = null,
}) => {
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState({});
  const [selectedOptions, setSelectedOptions] = useState(selectedTags);
  const [tempSelectedOptions, setTempSelectedOptions] = useState(selectedTags);

  useEffect(() => {
    if (isMobile) {
      setTempSelectedOptions(selectedTags);
    } else {
      setSelectedOptions(selectedTags);
    }
  }, [selectedTags, isMobile]);

  useEffect(() => {
    setOptions({});
    setSelectedOptions([]);
  }, [filterData]);

  const fetchOptions = async (filterID) => {
    setLoading((prev) => ({ ...prev, [filterID]: true }));
    try {
      const response = await axios.get(`/option?filterID=${filterID}`);
      setOptions((prev) => ({
        ...prev,
        [filterID]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching options:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [filterID]: false }));
    }
  };

  const handleOptionChange = (optionId, optionTitle, filterTitle) => {
    if (isMobile) {
      const newOptions = tempSelectedOptions.some((opt) => opt.id === optionId)
        ? tempSelectedOptions.filter((opt) => opt.id !== optionId)
        : [
            ...tempSelectedOptions,
            { id: optionId, title: optionTitle, filterTitle },
          ];

      setTempSelectedOptions(newOptions);
      onTempFilterChange?.(newOptions);
    } else {
      const newOptions = selectedOptions.some((opt) => opt.id === optionId)
        ? selectedOptions.filter((opt) => opt.id !== optionId)
        : [
            ...selectedOptions,
            { id: optionId, title: optionTitle, filterTitle },
          ];

      setSelectedOptions(newOptions);
      onFilterChange(newOptions);
    }
  };

  const handleClearFilterOptions = (filterId) => {
    const filterOptions = options[filterId] || [];
    if (isMobile) {
      const newTempOptions = tempSelectedOptions.filter(
        (opt) => !filterOptions.some((filterOpt) => filterOpt._id === opt.id)
      );
      setTempSelectedOptions(newTempOptions);
      onTempFilterChange?.(newTempOptions);
    } else {
      const newSelectedOptions = selectedOptions.filter(
        (opt) => !filterOptions.some((filterOpt) => filterOpt._id === opt.id)
      );
      setSelectedOptions(newSelectedOptions);
      onFilterChange(newSelectedOptions);
    }
  };

  const getIsChecked = (optionId) => {
    if (isMobile) {
      return tempSelectedOptions?.some((opt) => opt.id === optionId);
    }
    return selectedOptions?.some((opt) => opt.id === optionId);
  };

  if (!filterData || !Array.isArray(filterData)) {
    return null;
  }

  const items = filterData.map((filter) => ({
    key: filter._id,
    label: (
      <div className="flex justify-between items-center w-full">
        <div className="font-semibold">{filter.title}</div>
        {options[filter._id]?.some((option) =>
          selectedOptions.some((opt) => opt.id === option._id)
        ) && (
          <span
            className="cursor-pointer hover:underline text-primary text-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleClearFilterOptions(filter._id);
            }}
          >
            Bỏ chọn
          </span>
        )}
      </div>
    ),
    children: loading[filter._id] ? (
      <div className="flex justify-center py-2">
        <Spin size="small" />
      </div>
    ) : (
      <div className="grid gap-2">
        {options[filter._id]?.map((option) => (
          <Checkbox
            key={option._id}
            className="text-sm"
            checked={getIsChecked(option._id)}
            onChange={() =>
              handleOptionChange(option._id, option.title, filter.title)
            }
          >
            {option.title}
          </Checkbox>
        ))}
      </div>
    ),
    onItemClick: () => {
      if (!options[filter._id]) {
        fetchOptions(filter._id);
      }
    },
  }));

  return <Collapse items={items} ghost expandIconPosition="end" />;
};

export default Filter;
