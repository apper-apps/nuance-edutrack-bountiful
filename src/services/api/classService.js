import classesData from "@/services/mockData/classes.json";

class ClassService {
  constructor() {
    this.classes = [...classesData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.classes]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const classItem = this.classes.find(c => c.Id === id);
        if (classItem) {
          resolve({ ...classItem });
        } else {
          reject(new Error("Class not found"));
        }
      }, 200);
    });
  }

  async create(classData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newClass = {
          Id: Math.max(...this.classes.map(c => c.Id)) + 1,
          ...classData
        };
        this.classes.push(newClass);
        resolve({ ...newClass });
      }, 400);
    });
  }

  async update(id, classData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.classes.findIndex(c => c.Id === id);
        if (index !== -1) {
          this.classes[index] = { ...this.classes[index], ...classData };
          resolve({ ...this.classes[index] });
        } else {
          reject(new Error("Class not found"));
        }
      }, 400);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.classes.findIndex(c => c.Id === id);
        if (index !== -1) {
          const deletedClass = this.classes.splice(index, 1)[0];
          resolve(deletedClass);
        } else {
          reject(new Error("Class not found"));
        }
      }, 300);
    });
  }

  async getByGradeLevel(gradeLevel) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredClasses = this.classes.filter(c => c.gradeLevel === gradeLevel);
        resolve([...filteredClasses]);
      }, 250);
    });
  }
}

export const classService = new ClassService();