import React, { useState } from 'react';
import { ref, push } from 'firebase/database';
import { database } from '../firebase';

const AddEquipment = () => {
  const [equipmentName, setEquipmentName] = useState('');

  const handleAddEquipment = () => {
    if (equipmentName) {
      const equipmentRef = ref(database, 'equipments'); // Reference to the "equipment" node
      push(equipmentRef, { name: equipmentName })
        .then(() => {
          console.log('Equipment added successfully.');
          setEquipmentName('');
        })
        .catch(error => {
          console.error('Error adding equipment:', error);
        });
    } else {
      console.error('Please enter equipment name.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Equipment</h2>

      <div className="mb-3">
        <label className="form-label">Equipment Name:</label>
        <input
          type="text"
          className="form-control"
          value={equipmentName}
          onChange={(e) => setEquipmentName(e.target.value)}
        />
      </div>

      <button
        type="button"
        className="btn btn-primary"
        onClick={handleAddEquipment}
      >
        Add Equipment
      </button>
    </div>
  );
};

export default AddEquipment;
