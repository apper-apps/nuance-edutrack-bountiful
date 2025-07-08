import studentsData from "@/services/mockData/students.json";

class StudentService {
  constructor() {
    this.students = [...studentsData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.students]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const student = this.students.find(s => s.Id === id);
        if (student) {
          resolve({ ...student });
        } else {
          reject(new Error("Student not found"));
        }
      }, 200);
    });
  }

  async create(studentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newStudent = {
          Id: Math.max(...this.students.map(s => s.Id)) + 1,
          ...studentData,
          enrollmentDate: new Date(studentData.enrollmentDate).toISOString()
        };
        this.students.push(newStudent);
        resolve({ ...newStudent });
      }, 400);
    });
  }

  async update(id, studentData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.students.findIndex(s => s.Id === id);
        if (index !== -1) {
          this.students[index] = { 
            ...this.students[index], 
            ...studentData,
            enrollmentDate: new Date(studentData.enrollmentDate).toISOString()
          };
          resolve({ ...this.students[index] });
        } else {
          reject(new Error("Student not found"));
        }
      }, 400);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.students.findIndex(s => s.Id === id);
        if (index !== -1) {
          const deletedStudent = this.students.splice(index, 1)[0];
          resolve(deletedStudent);
        } else {
          reject(new Error("Student not found"));
        }
      }, 300);
    });
  }

  async getByGradeLevel(gradeLevel) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredStudents = this.students.filter(s => s.gradeLevel === gradeLevel);
        resolve([...filteredStudents]);
      }, 250);
    });
  }

  async search(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredStudents = this.students.filter(s => 
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.email.toLowerCase().includes(query.toLowerCase())
        );
        resolve([...filteredStudents]);
      }, 200);
    });
  }
}

export const studentService = new StudentService();