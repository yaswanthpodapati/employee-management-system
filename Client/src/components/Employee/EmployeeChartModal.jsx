import React, { useState, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import html2canvas from 'html2canvas';
import { IoMdClose } from 'react-icons/io';
import PageTitle from '../UI/PageTitle';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#8822DD'];

function EmployeeChartModal({ show, onClose, employees }) {
  const [selectedChart, setSelectedChart] = useState('Pie');
  const chartRef = useRef(null);

  const getChartData = () => {
    const designationSalaryMap = {};

    employees.forEach(emp => {
      if (designationSalaryMap[emp.designation]) {
        designationSalaryMap[emp.designation] += emp.salary;
      } else {
        designationSalaryMap[emp.designation] = emp.salary;
      }
    });

    return Object.entries(designationSalaryMap).map(([designation, salary]) => ({
      designation,
      salary
    }));
  };

  const handleDownloadChart = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current);
      const image = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = image;
      link.download = `Employee_Chart_${new Date().toLocaleDateString()}.png`;
      link.click();
    } catch (error) {
      console.error("Error downloading chart:", error);
    }
  };

  if (!show) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '800px', height: '600px', position: 'relative', overflowY: 'auto' }}>
        <div style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }} onClick={onClose}>
          <IoMdClose size={24} />
        </div>

        <div style={{ textAlign: 'center' }}>
  <PageTitle title="Employee Designation vs Salary" />
</div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <select
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
            style={{ padding: '8px 15px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }}
          >
            <option value="Pie">Pie Chart</option>
            <option value="Bar">Bar Chart</option>
            <option value="Line">Line Chart</option>
          </select>
        </div>

        <div ref={chartRef} style={{ textAlign: 'center', marginBottom: '20px' }}>
          {selectedChart === 'Pie' && (
            <PieChart width={400} height={400}>
              <Pie
                data={getChartData()}
                dataKey="salary"
                nameKey="designation"
                cx="50%"
                cy="50%"
                outerRadius={130}
                fill="#8884d8"
                label
              >
                {getChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}

          {selectedChart === 'Bar' && (
            <BarChart width={700} height={400} data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="designation" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="salary" fill="#82ca9d" />
            </BarChart>
          )}

          {selectedChart === 'Line' && (
            <LineChart width={700} height={400} data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="designation" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="salary" stroke="#8884d8" />
            </LineChart>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={handleDownloadChart}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '5px',
              marginRight: '10px'
            }}
          >
            Download Chart
          </button>

          <button
            onClick={onClose}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeChartModal;