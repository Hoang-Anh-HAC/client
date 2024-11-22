import React, { useState, useEffect } from "react";
import axios from "../utils/axiosConfig";

const useCategories = () => {
  const [categoriesFetch, setCategoriesFetch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`category/`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategoriesFetch(data);
      } catch (error) {
        setError(error);
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categoriesFetch, loading, error };
};

export default useCategories;
