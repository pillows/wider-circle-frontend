// Define the employee data structure as returned from the API
export interface Employee {
    id: number;
    name: string;
    title: string;
    manager_id: number | null;
  }
  
  // Extended employee type that includes reports for the hierarchy
  export interface EmployeeWithReports extends Employee {
    reports: EmployeeWithReports[];
  }
  
  // Props type for the EmployeeList component
  export interface EmployeeListProps {
    employee: EmployeeWithReports;
    level?: number;
  }