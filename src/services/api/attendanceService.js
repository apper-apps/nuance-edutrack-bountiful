import attendanceData from "@/services/mockData/attendance.json";

class AttendanceService {
  constructor() {
    this.attendance = [...attendanceData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.attendance]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const record = this.attendance.find(a => a.Id === id);
        if (record) {
          resolve({ ...record });
        } else {
          reject(new Error("Attendance record not found"));
        }
      }, 200);
    });
  }

  async getByStudentId(studentId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const studentAttendance = this.attendance.filter(a => a.studentId === studentId);
        resolve([...studentAttendance]);
      }, 250);
    });
  }

  async getByDate(date) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const dateStr = new Date(date).toISOString().split('T')[0];
        const dateAttendance = this.attendance.filter(a => 
          new Date(a.date).toISOString().split('T')[0] === dateStr
        );
        resolve([...dateAttendance]);
      }, 250);
    });
  }

  async create(attendanceData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRecord = {
          Id: Math.max(...this.attendance.map(a => a.Id)) + 1,
          ...attendanceData,
          date: new Date(attendanceData.date).toISOString()
        };
        this.attendance.push(newRecord);
        resolve({ ...newRecord });
      }, 400);
    });
  }

  async update(id, attendanceData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.attendance.findIndex(a => a.Id === id);
        if (index !== -1) {
          this.attendance[index] = { 
            ...this.attendance[index], 
            ...attendanceData,
            date: new Date(attendanceData.date).toISOString()
          };
          resolve({ ...this.attendance[index] });
        } else {
          reject(new Error("Attendance record not found"));
        }
      }, 400);
    });
  }

  async updateByStudentAndDate(studentId, date, status, reason = "") {
    return new Promise((resolve) => {
      setTimeout(() => {
        const dateStr = new Date(date).toISOString().split('T')[0];
        const existingIndex = this.attendance.findIndex(a => 
          a.studentId === studentId && 
          new Date(a.date).toISOString().split('T')[0] === dateStr
        );

        if (existingIndex !== -1) {
          this.attendance[existingIndex] = {
            ...this.attendance[existingIndex],
            status,
            reason
          };
          resolve({ ...this.attendance[existingIndex] });
        } else {
          const newRecord = {
            Id: Math.max(...this.attendance.map(a => a.Id)) + 1,
            studentId,
            date: new Date(date).toISOString(),
            status,
            reason
          };
          this.attendance.push(newRecord);
          resolve({ ...newRecord });
        }
      }, 400);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.attendance.findIndex(a => a.Id === id);
        if (index !== -1) {
          const deletedRecord = this.attendance.splice(index, 1)[0];
          resolve(deletedRecord);
        } else {
          reject(new Error("Attendance record not found"));
        }
      }, 300);
    });
  }
}

export const attendanceService = new AttendanceService();