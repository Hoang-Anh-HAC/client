import React, { useEffect, useState } from "react";
import { Collapse, Spin, Alert, Radio } from "antd";
import axios from "../../utils/axiosConfig";

const ProductSeriesFilter = ({
  category,
  brand,
  selectedSeries,
  setSelectedSeries,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [series, setSeries] = useState([]);
  const [activeKey, setActiveKey] = useState(["1"]);

  useEffect(() => {
    const fetchSeries = async () => {
      if (!category?._id || !brand?._id) {
        setSeries([]);
        setSelectedSeries(null);
        return;
      }

      try {
        setLoading(true);
        const params = new URLSearchParams();

        params.append("categoryID", category._id);
        params.append("brandID", brand._id);

        const response = await axios.get(`series?${params.toString()}`);
        setSeries(response.data.data);
        setSelectedSeries(null);
      } catch (error) {
        console.error("Error fetching series:", error);
        setError(error.message);
        setSeries([]);
        setSelectedSeries(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [category?._id, brand?._id]);

  if (!category?._id || !brand?._id) {
    return null;
  }

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

  const handleRadioChange = (e) => {
    setSelectedSeries(e.target.value);
  };

  const handleClearSelection = () => {
    setSelectedSeries(null);
  };

  const items = [
    {
      key: "1",
      label: <div className="font-semibold">Series</div>,
      extra: selectedSeries && (
        <span
          className="cursor-pointer hover:underline text-primary ml-2"
          onClick={handleClearSelection}
        >
          Bỏ chọn
        </span>
      ),
      children: (
        <Radio.Group
          options={
            series &&
            series.map((serie) => ({
              label: <div className="text-sm">{serie.title}</div>,
              value: serie._id,
            }))
          }
          onChange={handleRadioChange}
          value={selectedSeries}
          className="grid gap-2"
        />
      ),
    },
  ];

  return (
    <div>
      {series && series.length > 0 ? (
        <Collapse
          activeKey={activeKey}
          onChange={(key) => setActiveKey(key)}
          ghost
          expandIconPosition="end"
          items={items}
        />
      ) : null}
    </div>
  );
};

export default ProductSeriesFilter;
