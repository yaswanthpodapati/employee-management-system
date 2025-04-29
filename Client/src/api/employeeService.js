import axios from 'axios';

const API_URL = "https://localhost:7172/api/Employee";

export const getEmployees = async (name = '') => {
  const response = await axios.get(`${API_URL}?name=${name}`);
  return response.data;
};

export const deleteMultipleEmployees = async (ids) => {
  const response = await axios.post(`${API_URL}/deleteMultiple`, { id: ids });
  return response.data;
};

export const addEmployee = async (employee) => {
  const response = await axios.post(API_URL, employee);
  return response.data;
};

export const getStates = async () => {
  const response = await axios.get(`${API_URL}/states`);
  return response.data;
};

export const updateEmployee = async (employee) => {
  const response = await axios.put(API_URL, employee);
  return response.data;
};
