import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { studentService } from "@/services/api/studentService";
import { attendanceService } from "@/services/api/attendanceService";

const Attendance = () => {
  const { setSidebarOpen } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [studentsData, attendanceData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll()
      ]);
      setStudents(studentsData.filter(s => s.status === "active"));
      setAttendance(attendanceData);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateAttendance = async (studentId, date, status) => {
    try {
      await attendanceService.updateByStudentAndDate(studentId, date, status);
      
      // Update local state
setAttendance(prev => {
        const dateStr = date;
        const existingIndex = prev.findIndex(a => 
          a.student_id === studentId && 
          new Date(a.date).toISOString().split('T')[0] === dateStr
        );

        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            status
          };
          return updated;
        } else {
          return [...prev, {
Id: Math.max(...prev.map(a => a.Id)) + 1,
            student_id: studentId,
            date: new Date(date).toISOString(),
            status,
            reason: ""
          }];
        }
      });

      toast.success("Attendance updated successfully!");
    } catch (err) {
      toast.error("Failed to update attendance");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col h-screen">
        <Header
          title="Attendance"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="flex-1 p-6">
          <Loading variant="table" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col h-screen">
        <Header
          title="Attendance"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="flex-1 p-6">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Header
        title="Attendance"
        onMenuClick={() => setSidebarOpen(true)}
      />
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {students.length === 0 ? (
            <Empty
              title="No active students found"
              message="You need to add active students before you can track attendance."
              icon="Calendar"
            />
          ) : (
            <AttendanceGrid
              students={students}
              attendance={attendance}
              onUpdateAttendance={handleUpdateAttendance}
              selectedDate={selectedDate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;