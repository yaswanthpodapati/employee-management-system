import React from 'react';

function EmployeeListItem({ employee, index, isSelected, onCheckboxChange, onEditClick }) {
  return (
<tr style={{ backgroundColor: index % 2 === 0 ? '#e6f7ff' : '#f0fbff' }}>
<td>{index + 1}</td>
      <td>
        <span
          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
          onClick={() => onEditClick(employee)}
        >
          {employee.name}
        </span>
      </td>
      <td>{employee.designation}</td>
      <td>{new Date(employee.dateOfJoin).toLocaleDateString()}</td>
      <td>{employee.salary}</td>
      <td>{employee.gender}</td>
      <td>{employee.stateName}</td>
      <td>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onCheckboxChange(employee.employeeId)}
        />
      </td>
    </tr>
  );
}

export default EmployeeListItem;