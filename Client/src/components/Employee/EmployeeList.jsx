import React, { useEffect, useState } from 'react';
import { getEmployees, deleteMultipleEmployees } from '../../api/employeeService';
import { FaTrash, FaChartBar, FaFileAlt, FaPlus } from 'react-icons/fa';
import SearchBox from '../UI/SearchBox';
import Pagination from '../UI/Pagination';
import SuccessToast from '../UI/SuccessToast';
import EmployeeListItem from './EmployeeListItem';
import EmployeeAddEditModal from './EmployeeAddEditModal';
import EmployeeDeleteModal from './EmployeeDeleteModal';
import EmployeeReportModal from './EmployeeReportModal';
import EmployeeChartModal from './EmployeeChartModal';
import Spinner from '../UI/Spinner';
import PageTitle from '../UI/PageTitle';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ field: '', order: 'asc' });
  const [searchText, setSearchText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 5;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async (name = '', successMessage = null) => {
    try {
      setLoading(true);
      const data = await getEmployees(name);
      setEmployees(data);
      setCurrentPage(1);
      setSelectedIds([]);
      setSelectAll(false);
      setLoading(false);

      if (successMessage) {
        setToastMessage(successMessage);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    fetchEmployees(text);
  };

  const handleSort = (field) => {
    let order = 'asc';
    if (sortConfig.field === field && sortConfig.order === 'asc') {
      order = 'desc';
    }
    const sortedData = [...employees].sort((a, b) => {
      if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setEmployees(sortedData);
    setSortConfig({ field, order });
  };

  const getSortIcon = (field) => {
    if (sortConfig.field === field) {
      return sortConfig.order === 'asc' ? '↑' : '↓';
    }
    return '';
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = employees.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(employees.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleCheckboxChange = (id) => {
    const updatedSelected = selectedIds.includes(id)
      ? selectedIds.filter(item => item !== id)
      : [...selectedIds, id];
    setSelectedIds(updatedSelected);
  };

  useEffect(() => {
    const currentPageIds = currentRecords.map(emp => emp.employeeId);
    const allOnPageSelected = currentPageIds.length > 0 && currentPageIds.every(id => selectedIds.includes(id));
    setSelectAll(allOnPageSelected);
  }, [selectedIds, currentRecords]);

  const handleSelectAllChange = () => {
    const currentPageIds = currentRecords.map(emp => emp.employeeId);
    if (selectAll) {
      setSelectedIds(selectedIds.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedIds([...new Set([...selectedIds, ...currentPageIds])]);
    }
  };

  const handleDeleteSelected = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteMultipleEmployees(selectedIds);
      setShowDeleteModal(false);
      setToastMessage("Employees deleted successfully!");
      setShowSuccessToast(true);
      fetchEmployees();
      setTimeout(() => setShowSuccessToast(false), 3000);
      setSelectedIds([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error deleting employees:", error);
    }
  };

  const handleEditClick = (employee) => {
    setEditEmployee(employee);
    setIsEditMode(true);
    setShowEditModal(true);
  };

  const handleAddClick = () => {
    setEditEmployee({
      name: '',
      designation: '',
      dateOfJoin: '',
      salary: '',
      gender: '',
      stateId: '',
      dateOfBirth: ''
    });
    setIsEditMode(false);
    setShowEditModal(true);
  };

  return (
    <div style={{ position: 'relative', padding: '20px' }}>
<div style={{ textAlign: 'center' }}>
  <PageTitle title="Employee Management System" />
</div>
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SearchBox onSearch={handleSearch} searchText={searchText} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={handleAddClick}
            style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '5px', marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <FaPlus /> Add New Employee
          </button>
          <button
            onClick={() => setShowReportModal(true)}
            style={{ backgroundColor: '#17a2b8', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '5px', marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <FaFileAlt /> View Report
          </button>
          <button
            onClick={() => setShowChartModal(true)}
            style={{ backgroundColor: '#6f42c1', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '5px', marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <FaChartBar /> View Chart
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedIds.length === 0}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 15px',
            backgroundColor: selectedIds.length === 0 ? '#f8d7da' : 'red',
            color: selectedIds.length === 0 ? '#721c24' : 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          <FaTrash /> Delete
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : employees.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '20px', color: 'gray' }}>
          No employees found.
        </div>
      ) : currentRecords.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '20px', color: 'gray' }}>
          No matching employees found.
        </div>
      ) : (
        <table border="1" cellPadding="5" style={{ width: '100%', textAlign: 'center' }}>
          <thead style={{ backgroundColor: '#17a2b8', color: 'white' }}>
            <tr>
              <th>Sr No.</th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name {getSortIcon('name')}</th>
              <th onClick={() => handleSort('designation')} style={{ cursor: 'pointer' }}>Designation {getSortIcon('designation')}</th>
              <th onClick={() => handleSort('dateOfJoin')} style={{ cursor: 'pointer' }}>DOJ {getSortIcon('dateOfJoin')}</th>
              <th onClick={() => handleSort('salary')} style={{ cursor: 'pointer' }}>Salary {getSortIcon('salary')}</th>
              <th onClick={() => handleSort('gender')} style={{ cursor: 'pointer' }}>Gender {getSortIcon('gender')}</th>
              <th onClick={() => handleSort('stateName')} style={{ cursor: 'pointer' }}>State {getSortIcon('stateName')}</th>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((emp, index) => (
              <EmployeeListItem
                key={emp.employeeId}
                employee={emp}
                index={indexOfFirstRecord + index}
                isSelected={selectedIds.includes(emp.employeeId)}
                onCheckboxChange={handleCheckboxChange}
                onEditClick={handleEditClick}
              />
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
        Total Salary (Page): ₹{currentRecords.reduce((sum, emp) => sum + emp.salary, 0).toLocaleString()}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={paginate}
        onNext={nextPage}
        onPrev={prevPage}
      />

      <EmployeeDeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />

      {showEditModal && (
        <EmployeeAddEditModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          employee={editEmployee}
          isEditMode={isEditMode}
          onEmployeeUpdated={(message) => fetchEmployees('', message)}
          existingEmployees={employees}
        />
      )}

      <EmployeeReportModal
        show={showReportModal}
        onClose={() => setShowReportModal(false)}
        employees={employees}
      />

      <EmployeeChartModal
        show={showChartModal}
        onClose={() => setShowChartModal(false)}
        employees={employees}
      />

      <SuccessToast show={showSuccessToast} message={toastMessage} onClose={() => setShowSuccessToast(false)} />
    </div>
  );
}

export default EmployeeList;
