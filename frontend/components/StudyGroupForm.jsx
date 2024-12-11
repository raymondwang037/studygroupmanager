import { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

export default function StudyGroupForm({ onSubmit, students = [], rooms = [], initialData = {} }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState(0);
  const [room, setRoom] = useState(null);
  const [organizers, setOrganizers] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    setName(initialData.name || '');

    setDate(initialData.date ? new Date(initialData.date).toISOString().slice(0, 16) : '');

    setDuration(initialData.duration || 0);
    setRoom(initialData.room ? { value: initialData.room._id, label: `${initialData.room.building} ${initialData.room.number}` } : null);

    setOrganizers(
      initialData.organizers
        ? initialData.organizers.map((org) => ({
            value: org._id,
            label: org.name,
          }))
        : []
    );

    setAttendance(
      initialData.attendance
        ? initialData.attendance.map((attendee) => ({
            student: attendee.student._id,
            name: attendee.student.name,
            attended: attendee.attended,
          }))
        : []
    );
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adjustedDate = new Date(date);
      adjustedDate.setMinutes(adjustedDate.getMinutes() - adjustedDate.getTimezoneOffset());

      await onSubmit({
        name,
        date: adjustedDate,
        duration,
        room: room?.value,
        organizers: organizers.map((org) => org.value),
        attendance,
      });
      window.location.reload();
    } catch (error) {
      console.error("Failed to save study group:", error);
    }
  };

  const handleOrganizersChange = (selectedOrganizers) => {
    const newOrganizers = selectedOrganizers || [];
    setOrganizers(newOrganizers);

    const newAttendance = newOrganizers.map((organizer) => {
      const existingAttendee = attendance.find((att) => att.student === organizer.value);
      return existingAttendee || { student: organizer.value, name: organizer.label, attended: false };
    });

    setAttendance(newAttendance);
  };

  const toggleAttendance = async (studentId) => {
    setAttendance((prevAttendance) =>
      prevAttendance.map((attendee) =>
        attendee.student === studentId
          ? { ...attendee, attended: !attendee.attended }
          : attendee
      )
    );

    try {
      await axios.put(`https://studygroupmanager.onrender.com/api/study-groups/${initialData._id}/attendance`, {
        attendance,
      });
    } catch (error) {
      console.error("Failed to update attendance:", error);
    }
  };

  const organizerOptions = students.map((student) => ({
    value: student._id,
    label: student.name,
  }));

  const roomOptions = rooms.map((room) => ({
    value: room._id,
    label: `${room.building} ${room.number}`,
  }));

  return (
    <form onSubmit={handleSubmit}>
      <label>Name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

      <label>Date and Time:</label>
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <label>Duration (minutes):</label>
      <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />

      <label>Room:</label>
      <Select
        options={roomOptions}
        value={room}
        onChange={(selectedOption) => setRoom(selectedOption)}
        placeholder="Select a room"
      />

      <label>Organizers:</label>
      <Select
        isMulti
        options={organizerOptions}
        value={organizers}
        onChange={handleOrganizersChange}
        placeholder="Search and select organizers..."
      />

      <h4>Organizers and Attendance</h4>
      <ul>
        {attendance.map((attendee) => (
          <li key={attendee.student}>
            {attendee.name} - Attendance: {attendee.attended ? "Present" : "Absent"}
            <button type="button" onClick={() => toggleAttendance(attendee.student)}>
              {attendee.attended ? "Mark as Absent" : "Mark as Present"}
            </button>
          </li>
        ))}
      </ul>

      <button type="submit">Save</button>
    </form>
  );
}
