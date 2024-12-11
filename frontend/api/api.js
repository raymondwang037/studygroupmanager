import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
print(process.env.REACT_APP_API_BASE_URL)

export const getStudents = () => axios.get(`${API_BASE_URL}/students`);
export const addStudent = (student) => axios.post(`${API_BASE_URL}/students`, student);
export const updateStudent = (id, student) => axios.put(`${API_BASE_URL}/students/${id}`, student);
export const deleteStudent = (id) => axios.delete(`${API_BASE_URL}/students/${id}`);

export const getStudyGroups = () => axios.get(`${API_BASE_URL}/study-groups`);
export const addStudyGroup = (studyGroup) => axios.post(`${API_BASE_URL}/study-groups`, studyGroup);
export const updateStudyGroup = (id, studyGroup) => axios.put(`${API_BASE_URL}/study-groups/${id}`, studyGroup);
export const deleteStudyGroup = (id) => axios.delete(`${API_BASE_URL}/study-groups/${id}`);

export const getRooms = () => axios.get(`${API_BASE_URL}/rooms`);
export const addRoom = (room) => axios.post(`${API_BASE_URL}/rooms`, room);
export const updateRoom = (id, room) => axios.put(`${API_BASE_URL}/rooms/${id}`, room);
export const deleteRoom = (id) => axios.delete(`${API_BASE_URL}/rooms/${id}`);

export const generateReport = (params) => axios.get(`${API_BASE_URL}/study-groups/report`, { params });

const getAuthToken = () => localStorage.getItem('token');

axios.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});