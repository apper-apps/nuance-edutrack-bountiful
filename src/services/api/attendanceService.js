class AttendanceService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'attendance';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "reason" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "reason" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance record with ID ${id}:`, error);
      throw error;
    }
  }

  async create(attendanceData) {
    try {
      const params = {
        records: [{
          Name: `Attendance - ${attendanceData.date}`,
          student_id: attendanceData.studentId,
          date: attendanceData.date,
          status: attendanceData.status,
          reason: attendanceData.reason || ""
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating attendance record:", error);
      throw error;
    }
  }

  async update(id, attendanceData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: `Attendance - ${attendanceData.date}`,
          student_id: attendanceData.studentId,
          date: attendanceData.date,
          status: attendanceData.status,
          reason: attendanceData.reason || ""
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error updating attendance record:", error);
      throw error;
    }
  }

  async updateByStudentAndDate(studentId, date, status, reason = "") {
    try {
      // First try to find existing record
      const params = {
        fields: [
          { field: { Name: "student_id" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "reason" } }
        ],
        where: [
          {
            FieldName: "student_id",
            Operator: "EqualTo",
            Values: [studentId]
          },
          {
            FieldName: "date",
            Operator: "EqualTo",
            Values: [date]
          }
        ]
      };

      const existingResponse = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (existingResponse.success && existingResponse.data && existingResponse.data.length > 0) {
        // Update existing record
        const existingRecord = existingResponse.data[0];
        return await this.update(existingRecord.Id, {
          studentId,
          date,
          status,
          reason
        });
      } else {
        // Create new record
        return await this.create({
          studentId,
          date,
          status,
          reason
        });
      }
    } catch (error) {
      console.error("Error updating attendance by student and date:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.filter(result => result.success).length > 0;
      }
    } catch (error) {
      console.error("Error deleting attendance record:", error);
      throw error;
    }
  }
}

export const attendanceService = new AttendanceService();