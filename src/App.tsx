import React, { useState, useEffect, JSX } from 'react';
import './App.css';
import { Employee, EmployeeWithReports, EmployeeListProps } from './types';
import axios from 'axios';
import { BASE_API_URL } from './config';

function App(): JSX.Element {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_API_URL}/employees`);
      const responseData = response.data;
      
      if (response.status !== 200) {
        throw new Error(`Server returned ${response.status}`);
      }
      console.log('Response data:', responseData);  
      setEmployees(responseData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  
  const buildOrgChart = (flatEmployees: Employee[]): EmployeeWithReports[] => {
    const empMap: Record<number, EmployeeWithReports> = {};
    flatEmployees.forEach(emp => {
      empMap[emp.id] = { ...emp, reports: [] };
    });

    const roots: EmployeeWithReports[] = [];
    
    flatEmployees.forEach(emp => {
      if (emp.manager_id === null) {
        roots.push(empMap[emp.id]);
      } else {
        if (empMap[emp.manager_id]) {
          empMap[emp.manager_id].reports.push(empMap[emp.id]);
        }
      }
    });
    
    // Sort reports by last name
    const getLastName = (fullName: string): string => {
      const parts = fullName.split(' ');
      return parts[parts.length - 1];
    };
    
    const sortReports = (employee: EmployeeWithReports): void => {
      if (employee.reports && employee.reports.length > 0) {
        employee.reports.sort((a, b) => {
          return getLastName(a.name).localeCompare(getLastName(b.name));
        });
        
        employee.reports.forEach(sortReports);
      }
    };
    
    roots.forEach(sortReports);
    
    return roots;
  };

  const getListStyle = (level: number) => {
    switch (level) {
      case 0: return 'disc';
      case 1: return 'circle';
      case 2: return 'square';
      default: return 'square';
    }
  };

  const EmployeeList: React.FC<EmployeeListProps> = ({ employee, level = 1 }) => {
    return (
      <li>
        <span className="employee-info">
          {employee.title}: {employee.name}
        </span>
  
        {employee.reports && employee.reports.length > 0 && (
         <ul style={{ listStyleType: getListStyle(level + 1) }}>
            {employee.reports.map((report) => (
              <EmployeeList
                key={report.id}
                employee={report}
                level={level + 1}
              />
            ))}
          </ul>
        )}
      </li>
    );
  };
  
  if (loading) {
    return <div className="loading">Loading org chart...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const orgChart = buildOrgChart(employees);

  return (
    <div className="app">
      <h1>Organization Chart</h1>
      <div className="org-chart">
      {/* In the event that the org chart is empty, display a message */}
      {orgChart.length === 0 && <div>No employees found.</div>}
      {orgChart.length > 0 && (
        <ul style={{ listStyleType: "disc" }}>
          
          {orgChart.map((employee) => (
            <EmployeeList key={employee.id} employee={employee} level={0} />
          ))}

        </ul>
      )}
      </div>
    </div>
  );
}

export default App;