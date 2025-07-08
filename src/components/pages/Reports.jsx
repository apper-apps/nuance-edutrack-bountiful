import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";

const Reports = () => {
  const { setSidebarOpen } = useOutletContext();
  const [reportData, setReportData] = useState({
    students: [],
    grades: [],
    attendance: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState("overview");
  const [selectedGrade, setSelectedGrade] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [students, grades, attendance] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ]);
      setReportData({ students, grades, attendance });
    } catch (err) {
      setError(err.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStudentGradeAverage = (studentId) => {
    const studentGrades = reportData.grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return 0;
    const total = studentGrades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0);
    return Math.round(total / studentGrades.length);
  };

  const getStudentAttendanceRate = (studentId) => {
    const studentAttendance = reportData.attendance.filter(a => a.studentId === studentId);
    if (studentAttendance.length === 0) return 0;
    const presentCount = studentAttendance.filter(a => a.status === "present").length;
    return Math.round((presentCount / studentAttendance.length) * 100);
  };

  const getGradeDistribution = () => {
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    reportData.students.forEach(student => {
      const average = getStudentGradeAverage(student.Id);
      if (average >= 90) distribution.A++;
      else if (average >= 80) distribution.B++;
      else if (average >= 70) distribution.C++;
      else if (average >= 60) distribution.D++;
      else distribution.F++;
    });
    return distribution;
  };

  const getAttendanceStats = () => {
    const totalRecords = reportData.attendance.length;
    const presentCount = reportData.attendance.filter(a => a.status === "present").length;
    const absentCount = reportData.attendance.filter(a => a.status === "absent").length;
    const lateCount = reportData.attendance.filter(a => a.status === "late").length;
    
    return {
      present: totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0,
      absent: totalRecords > 0 ? Math.round((absentCount / totalRecords) * 100) : 0,
      late: totalRecords > 0 ? Math.round((lateCount / totalRecords) * 100) : 0
    };
  };

  const filteredStudents = selectedGrade === "all" 
    ? reportData.students 
    : reportData.students.filter(s => s.gradeLevel === parseInt(selectedGrade));

  const downloadReport = () => {
    // Mock download functionality
    const csvContent = "data:text/csv;charset=utf-8,Name,Grade,Average,Attendance\n" +
      filteredStudents.map(student => 
        `${student.name},${student.gradeLevel},${getStudentGradeAverage(student.Id)}%,${getStudentAttendanceRate(student.Id)}%`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `student-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col h-screen">
        <Header
          title="Reports"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="flex-1 p-6">
          <Loading variant="cards" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col h-screen">
        <Header
          title="Reports"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="flex-1 p-6">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

  const gradeDistribution = getGradeDistribution();
  const attendanceStats = getAttendanceStats();

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Header
        title="Reports"
        onMenuClick={() => setSidebarOpen(true)}
        actions={
          <Button onClick={downloadReport}>
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Report Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Report Type:</label>
              <Select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-40"
              >
                <option value="overview">Overview</option>
                <option value="grades">Grades</option>
                <option value="attendance">Attendance</option>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Grade Level:</label>
              <Select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-32"
              >
                <option value="all">All Grades</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </Select>
            </div>
          </div>

          {selectedReport === "overview" && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Students</p>
                        <p className="text-2xl font-bold text-primary-600">{filteredStudents.length}</p>
                      </div>
                      <ApperIcon name="Users" className="h-8 w-8 text-primary-500" />
                    </div>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Avg Attendance</p>
                        <p className="text-2xl font-bold text-green-600">{attendanceStats.present}%</p>
                      </div>
                      <ApperIcon name="Calendar" className="h-8 w-8 text-green-500" />
                    </div>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">A Students</p>
                        <p className="text-2xl font-bold text-accent-600">{gradeDistribution.A}</p>
                      </div>
                      <ApperIcon name="Award" className="h-8 w-8 text-accent-500" />
                    </div>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Grades</p>
                        <p className="text-2xl font-bold text-secondary-600">{reportData.grades.length}</p>
                      </div>
                      <ApperIcon name="GraduationCap" className="h-8 w-8 text-secondary-500" />
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Grade Distribution */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
                <div className="grid grid-cols-5 gap-4">
                  {Object.entries(gradeDistribution).map(([grade, count]) => (
                    <div key={grade} className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{count}</div>
                      <div className="text-sm text-gray-600">Grade {grade}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {selectedReport === "grades" && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Grade Report</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2">Student</th>
                      <th className="text-left py-2">Grade Level</th>
                      <th className="text-left py-2">Average</th>
                      <th className="text-left py-2">Letter Grade</th>
                      <th className="text-left py-2">Total Grades</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => {
                      const average = getStudentGradeAverage(student.Id);
                      const letterGrade = average >= 90 ? "A" : average >= 80 ? "B" : average >= 70 ? "C" : average >= 60 ? "D" : "F";
                      const gradeCount = reportData.grades.filter(g => g.studentId === student.Id).length;
                      
                      return (
                        <tr key={student.Id} className="border-b border-gray-100">
                          <td className="py-2">{student.name}</td>
                          <td className="py-2">{student.gradeLevel}</td>
                          <td className="py-2">{average}%</td>
                          <td className="py-2">
                            <Badge variant={letterGrade === "A" ? "success" : letterGrade === "F" ? "error" : "primary"}>
                              {letterGrade}
                            </Badge>
                          </td>
                          <td className="py-2">{gradeCount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {selectedReport === "attendance" && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Attendance Report</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2">Student</th>
                      <th className="text-left py-2">Grade Level</th>
                      <th className="text-left py-2">Attendance Rate</th>
                      <th className="text-left py-2">Total Days</th>
                      <th className="text-left py-2">Present</th>
                      <th className="text-left py-2">Absent</th>
                      <th className="text-left py-2">Late</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => {
                      const attendanceRate = getStudentAttendanceRate(student.Id);
                      const studentAttendance = reportData.attendance.filter(a => a.studentId === student.Id);
                      const present = studentAttendance.filter(a => a.status === "present").length;
                      const absent = studentAttendance.filter(a => a.status === "absent").length;
                      const late = studentAttendance.filter(a => a.status === "late").length;
                      
                      return (
                        <tr key={student.Id} className="border-b border-gray-100">
                          <td className="py-2">{student.name}</td>
                          <td className="py-2">{student.gradeLevel}</td>
                          <td className="py-2">
                            <Badge variant={attendanceRate >= 90 ? "success" : attendanceRate >= 75 ? "warning" : "error"}>
                              {attendanceRate}%
                            </Badge>
                          </td>
                          <td className="py-2">{studentAttendance.length}</td>
                          <td className="py-2">{present}</td>
                          <td className="py-2">{absent}</td>
                          <td className="py-2">{late}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;