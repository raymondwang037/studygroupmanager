import { useState, useEffect } from 'react';
import Select from 'react-select';
import { getStudents, getRooms, generateReport } from '../api/api';

export default function ReportForm({ onSearch }) {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    getStudents()
      .then((response) => setStudents(response.data || []))
      .catch((error) => console.error("Failed to fetch students:", error));

    getRooms()
      .then((response) => setRooms(response.data || []))
      .catch((error) => console.error("Failed to fetch rooms:", error));
  }, []);

  const handleSearch = async () => {
    const params = {};

    if (selectedStudent) params.student = selectedStudent.value;
    if (selectedRoom) params.room = selectedRoom.value;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    try {
      const response = await generateReport(params);
      console.log(response)
      onSearch(response.data);
    } catch (error) {
      console.error("Failed to fetch report:", error);
    }
  };

  const studentOptions = students.map((student) => ({ value: student._id, label: student.name }));
  const roomOptions = rooms.map((room) => ({ value: room._id, label: `${room.building} ${room.number}` }));

  return (
    <div>
      <h2>Search Report</h2>
      <div>
        <label>Student:</label>
        <Select
          options={studentOptions}
          value={selectedStudent}
          onChange={setSelectedStudent}
          isClearable
          placeholder="Select a student"
        />
      </div>
      <div>
        <label>Room:</label>
        <Select
          options={roomOptions}
          value={selectedRoom}
          onChange={setSelectedRoom}
          isClearable
          placeholder="Select a room"
        />
      </div>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
