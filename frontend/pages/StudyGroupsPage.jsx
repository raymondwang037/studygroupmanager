import axios from 'axios';
import { useState, useEffect } from 'react';
import { getStudyGroups, addStudyGroup, updateStudyGroup, deleteStudyGroup, getStudents, getRooms } from '../api/api';
import StudyGroupForm from '../components/StudyGroupForm';

export default function StudyGroupsPage() {
  const [studyGroups, setStudyGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

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


  useEffect(() => {
    getStudyGroups()
      .then((response) => setStudyGroups(response.data))
      .catch((error) => console.error("Failed to fetch study groups:", error));

    getStudents()
      .then((response) => setStudents(response.data))
      .catch((error) => console.error("Failed to fetch students:", error));

    getRooms()
      .then((response) => setRooms(response.data))
      .catch((error) => console.error("Failed to fetch rooms:", error));
  }, []);

  const handleAdd = (studyGroup) => {
    addStudyGroup(studyGroup)
      .then((response) => setStudyGroups([...studyGroups, response.data]))
      .catch((error) => console.error("Failed to add study group:", error));
  };

  const handleUpdate = (id, updatedData) => {
    updateStudyGroup(id, updatedData)
      .then((response) => {
        setStudyGroups(studyGroups.map((g) => (g._id === id ? response.data : g)));
        setEditingGroup(null);
      })
      .catch((error) => console.error("Failed to update study group:", error));
  };

  const handleDelete = (id) => {
    deleteStudyGroup(id)
      .then(() => setStudyGroups(studyGroups.filter((g) => g._id !== id)))
      .catch((error) => console.error("Failed to delete study group:", error));
  };

  const isAdmin = currentUser?.role === 'admin';

  const isCurrentUser = (studentId) => currentUser?._id === studentId;

  const isGroupMember = (organizers) => {
    console.log(organizers)
    console.log(currentUser)
    organizers.some((organizer) => organizer._id === currentUser?._id);
  }

  return (
    <div>
      <h1>Study Groups</h1>
      <StudyGroupForm
        onSubmit={editingGroup ? (data) => handleUpdate(editingGroup._id, data) : handleAdd}
        students={students}
        rooms={rooms}
        initialData={editingGroup || {}}
      />
      <ul>
        {studyGroups.map((group) => (
          <li key={group._id}>
            <strong>{group.name}</strong> - 
            {group.room ? `${group.room.building} ${group.room.number}` : "Room not found"} on {new Date(group.date).toLocaleDateString()}
            {(isAdmin || isGroupMember(group.organizers)) && (
              <>
                <button onClick={() => setEditingGroup(group)}>Edit</button>
                <button onClick={() => handleDelete(group._id)}>Delete</button>
              </>
            )}

            <h4>Organizers and Attendance</h4>
            <ul>
              {group.organizers.map((organizer) => (
                <li key={organizer._id}>
                  {organizer.name} - Attendance: {group.attendance.find((a) => a.student._id === organizer._id)?.attended ? "Present" : "Absent"}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
