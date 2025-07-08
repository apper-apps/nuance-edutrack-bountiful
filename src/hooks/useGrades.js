import { useState, useEffect } from "react";
import { gradeService } from "@/services/api/gradeService";

export const useGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGrades = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await gradeService.getAll();
      setGrades(data);
    } catch (err) {
      setError(err.message || "Failed to load grades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrades();
  }, []);

  return {
    grades,
    loading,
    error,
    refetch: loadGrades
  };
};