import { useState, useEffect } from 'react';

export default function RoomForm({ onSubmit, initialData = {} }) {
  const [building, setBuilding] = useState('');
  const [number, setNumber] = useState('');

  useEffect(() => {
    setBuilding(initialData.building || '');
    setNumber(initialData.number || '');
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ building, number });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Building:</label>
      <input
        type="text"
        value={building}
        onChange={(e) => setBuilding(e.target.value)}
        required
      />

      <label>Room Number:</label>
      <input
        type="text"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        required
      />

      <button type="submit">Save Room</button>
    </form>
  );
}
