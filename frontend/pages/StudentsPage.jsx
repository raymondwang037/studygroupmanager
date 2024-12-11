import axios from 'axios';
import { useState, useEffect } from 'react';
import { getStudents, addStudent, updateStudent, deleteStudent } from '../api/api';
import StudentForm from '../components/StudentForm';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchStudents();
  }, [searchQuery]);
  
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`https://studygroupmanager.onrender.com/api/students/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`https://studygroupmanager.onrender.com/api/students/search`, {
        params: { query: searchQuery },
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const handleAdd = (student) => {
    addStudent(student)
      .then((response) => setStudents([...students, response.data]))
      .catch((error) => console.error("Failed to add student:", error));
  };

  const handleUpdate = (id, updatedData) => {
    updateStudent(id, updatedData)
      .then((response) => {
        setStudents(students.map((s) => (s._id === id ? response.data : s)));
        setEditingStudent(null);
      })
      .catch((error) => console.error("Failed to update student:", error));
  };

  const handleDelete = (id) => {
    deleteStudent(id)
      .then(() => setStudents(students.filter((s) => s._id !== id)))
      .catch((error) => console.error("Failed to delete student:", error));
  };

  const isAdmin = currentUser?.role === 'admin';

  const isCurrentUser = (studentId) => currentUser?._id === studentId;

  return (
    <div>
      <h1>Students</h1>
      <label htmlFor="searchQuery">Search for a student by name or email: </label>
      <input
        id="searchQuery"
        type="text"
        placeholder=""
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ul>
        {students.map((student) => (
          <li key={student._id}>
            {student.name} - {student.email}
            {(isAdmin || isCurrentUser(student._id)) && (
              <>
                <button onClick={() => handleDelete(student._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
