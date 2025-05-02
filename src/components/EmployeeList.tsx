import { EmployeeWithReports, EmployeeListProps } from "../types";

const getListStyle = (level: number) => {
  switch (level) {
    case 0:
      return "disc";
    case 1:
      return "circle";
    case 2:
      return "square";
    default:
      return "square";
  }
};

const EmployeeList: React.FC<EmployeeListProps> = ({ employee, level = 1 }) => {
  return (
    <li>
      <span className="employee-info">
        {employee.title}: {employee.name}
      </span>
      {/* Go for a recursive approach to display reports */}
      {employee.reports && employee.reports.length > 0 && (
        <ul style={{ listStyleType: getListStyle(level + 1) }}>
          {employee.reports.map((report: EmployeeWithReports) => (
            <EmployeeList key={report.id} employee={report} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default EmployeeList;
