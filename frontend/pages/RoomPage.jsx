import { useState, useEffect } from 'react';
import { getRooms, addRoom, updateRoom, deleteRoom } from '../api/api';
import RoomForm from '../components/RoomForm';

export default function RoomPage() {
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    getRooms()
      .then((response) => setRooms(response.data))
      .catch((error) => console.error("Failed to fetch rooms:", error));
  }, []);

  const handleAdd = (room) => {
    addRoom(room)
      .then((response) => setRooms([...rooms, response.data]))
      .catch((error) => console.error("Failed to add room:", error));
  };

  const handleUpdate = (id, updatedData) => {
    updateRoom(id, updatedData)
      .then((response) => {
        setRooms(rooms.map((r) => (r._id === id ? response.data : r)));
        setEditingRoom(null);
      })
      .catch((error) => console.error("Failed to update room:", error));
  };

  const handleDelete = (id) => {
    deleteRoom(id)
      .then(() => setRooms(rooms.filter((r) => r._id !== id)))
      .catch((error) => console.error("Failed to delete room:", error));
  };

  return (
    <div>
      <h1>Rooms</h1>
      <RoomForm
        onSubmit={editingRoom ? (data) => handleUpdate(editingRoom._id, data) : handleAdd}
        initialData={editingRoom || {}}
      />
      <ul>
        {rooms.map((room) => (
          <li key={room._id}>
            <strong>{room.building} {room.number}</strong>
            <button onClick={() => setEditingRoom(room)}>Edit</button>
            <button onClick={() => handleDelete(room._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
