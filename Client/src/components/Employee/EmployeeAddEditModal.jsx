import React, { useState, useEffect } from 'react';
import { getStates, updateEmployee, addEmployee } from '../../api/employeeService';
import { IoMdClose } from 'react-icons/io';
import PageTitle from '../UI/PageTitle';

function EmployeeAddEditModal({ show, onClose, employee: initialEmployee, isEditMode, onEmployeeUpdated, existingEmployees }) {
  const [editEmployee, setEditEmployee] = useState({
    name: '',
    designation: '',
    dateOfJoin: '',
    salary: '',
    gender: '',
    stateId: '',
    dateOfBirth: ''
  });
  const [statesList, setStatesList] = useState([]);
  const [calculatedAge, setCalculatedAge] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (initialEmployee) {
      setEditEmployee({
        ...initialEmployee,
        dateOfJoin: initialEmployee.dateOfJoin ? initialEmployee.dateOfJoin.split('T')[0] : '',
        dateOfBirth: initialEmployee.dateOfBirth ? initialEmployee.dateOfBirth.split('T')[0] : '',
      });
      if (initialEmployee.dateOfBirth) {
        setCalculatedAge(calculateAge(new Date(initialEmployee.dateOfBirth)));
      } else {
        setCalculatedAge('');
      }
      setErrors({});
    } else {
      setEditEmployee({ name: '', designation: '', dateOfJoin: '', salary: '', gender: '', stateId: '', dateOfBirth: '' });
      setCalculatedAge('');
      setErrors({});
    }
  }, [initialEmployee, isEditMode]);

  const fetchStates = async () => {
    try {
      const states = await getStates();
      setStatesList(states);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!editEmployee.name.trim()) newErrors.name = "Name is required";
    if (!editEmployee.designation.trim()) newErrors.designation = "Designation is required";
    if (!editEmployee.dateOfJoin) newErrors.dateOfJoin = "Date of Join is required";
    if (!editEmployee.salary) newErrors.salary = "Salary is required";
    if (!editEmployee.gender) newErrors.gender = "Gender is required";
    if (!editEmployee.stateId) newErrors.stateId = "State is required";
    if (!editEmployee.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";

    if (existingEmployees) {
      const isDuplicateName = existingEmployees.some(emp => {
        const isSameId = isEditMode && initialEmployee && emp.employeeId === initialEmployee.employeeId;
        const isSameName = emp.name.trim().toLowerCase() === editEmployee.name.trim().toLowerCase();
        return isSameName && !isSameId;
      });

      if (isDuplicateName) {
        newErrors.name = "Employee with this name already exists!";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      let successMessage = '';
      if (isEditMode) {
        await updateEmployee(editEmployee);
        successMessage = "Employee updated successfully!";
      } else {
        await addEmployee(editEmployee);
        successMessage = "Employee added successfully!";
      }
      onEmployeeUpdated(successMessage);
      onClose();
    } catch (error) {
      console.error("Error submitting employee:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleDOBChange = (e) => {
    const dob = new Date(e.target.value);
    setEditEmployee({ ...editEmployee, dateOfBirth: e.target.value });
    setCalculatedAge(calculateAge(dob));
  };

  const handleClear = () => {
    setEditEmployee({ name: '', designation: '', dateOfJoin: '', salary: '', gender: '', stateId: '', dateOfBirth: '' });
    setCalculatedAge('');
    setErrors({});
  };

  const calculateAge = (dob) => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  };

  if (!show) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }} onClick={onClose}>
          <IoMdClose size={24} />
        </div>
        <div style={{ textAlign: 'center' }}>
        <PageTitle title={isEditMode ? 'Edit Employee' : 'Add Employee'} />
</div>
        {[
          { label: 'Name', name: 'name', type: 'text' },
          { label: 'Designation', name: 'designation', type: 'text' },
          { label: 'Date of Join', name: 'dateOfJoin', type: 'date' },
          { label: 'Salary', name: 'salary', type: 'number' },
        ].map(({ label, name, type }) => (
          <div key={name} style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>{label}: <span style={{ color: 'red' }}>*</span></label>
            <input type={type} name={name} value={editEmployee[name]} onChange={handleInputChange} style={inputStyle} />
            {errors[name] && <div style={{ color: 'red', fontSize: '12px' }}>{errors[name]}</div>}
          </div>
        ))}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Gender: <span style={{ color: 'red' }}>*</span></label>
          <label style={{ marginRight: '15px' }}>
            <input type="radio" name="gender" value="M" checked={editEmployee.gender === 'M'} onChange={handleInputChange} style={{ marginRight: '5px' }} />
            Male
          </label>
          <label>
            <input type="radio" name="gender" value="F" checked={editEmployee.gender === 'F'} onChange={handleInputChange} style={{ marginRight: '5px' }} />
            Female
          </label>
          {errors.gender && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.gender}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>State: <span style={{ color: 'red' }}>*</span></label>
          <select name="stateId" value={editEmployee.stateId} onChange={handleInputChange} style={inputStyle}>
            <option value="">Select State</option>
            {statesList.map(state => (
              <option key={state.stateId} value={state.stateId}>{state.stateName}</option>
            ))}
          </select>
          {errors.stateId && <div style={{ color: 'red', fontSize: '12px' }}>{errors.stateId}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Date of Birth: <span style={{ color: 'red' }}>*</span></label>
          <input type="date" name="dateOfBirth" value={editEmployee.dateOfBirth} onChange={handleDOBChange} style={inputStyle} />
          {errors.dateOfBirth && <div style={{ color: 'red', fontSize: '12px' }}>{errors.dateOfBirth}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Age:</label>
          <div style={{ fontSize: '16px' }}>{calculatedAge || 'N/A'}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px' }}>
          <button onClick={handleSubmit} style={{ backgroundColor: 'green', color: 'white', padding: '10px 20px', fontSize: '16px', border: 'none', borderRadius: '5px' }}>
            {isEditMode ? 'Update' : 'Add'}
          </button>
          <button onClick={handleClear} style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', fontSize: '16px', border: 'none', borderRadius: '5px' }}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeAddEditModal;
