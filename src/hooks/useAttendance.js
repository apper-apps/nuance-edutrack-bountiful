import { useState, useEffect } from "react";
import { attendanceService } from "@/services/api/attendanceService";

export const useAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await attendanceService.getAll();
      setAttendance(data);
    } catch (err) {
      setError(err.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  return {
    attendance,
    loading,
    error,
    refetch: loadAttendance
  };
};