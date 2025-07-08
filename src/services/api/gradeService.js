import gradesData from "@/services/mockData/grades.json";

class GradeService {
  constructor() {
    this.grades = [...gradesData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.grades]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const grade = this.grades.find(g => g.Id === id);
        if (grade) {
          resolve({ ...grade });
        } else {
          reject(new Error("Grade not found"));
        }
      }, 200);
    });
  }

  async getByStudentId(studentId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const studentGrades = this.grades.filter(g => g.studentId === studentId);
        resolve([...studentGrades]);
      }, 250);
    });
  }

  async create(gradeData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newGrade = {
          Id: Math.max(...this.grades.map(g => g.Id)) + 1,
          ...gradeData,
          date: new Date(gradeData.date).toISOString()
        };
        this.grades.push(newGrade);
        resolve({ ...newGrade });
      }, 400);
    });
  }

  async update(id, gradeData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.grades.findIndex(g => g.Id === id);
        if (index !== -1) {
          this.grades[index] = { 
            ...this.grades[index], 
            ...gradeData,
            date: new Date(gradeData.date).toISOString()
          };
          resolve({ ...this.grades[index] });
        } else {
          reject(new Error("Grade not found"));
        }
      }, 400);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.grades.findIndex(g => g.Id === id);
        if (index !== -1) {
          const deletedGrade = this.grades.splice(index, 1)[0];
          resolve(deletedGrade);
        } else {
          reject(new Error("Grade not found"));
        }
      }, 300);
    });
  }

  async getBySubject(subject) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const subjectGrades = this.grades.filter(g => g.subject === subject);
        resolve([...subjectGrades]);
      }, 250);
    });
  }
}

export const gradeService = new GradeService();