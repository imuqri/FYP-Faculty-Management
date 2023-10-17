import React, { useState, useEffect } from 'react';
import { ref, push, onValue } from 'firebase/database';
import { database } from '../firebase';

const AddSoftware = () => {
  const [softwareName, setSoftwareName] = useState('');
  const [softwareVersion, setSoftwareVersion] = useState('');
  const [softwareOptions, setSoftwareOptions] = useState([]);
  const [isNewSoftware, setIsNewSoftware] = useState(true);

  // Fetch existing software options from the database
  useEffect(() => {
    const softwareRef = ref(database, 'softwares');
    onValue(softwareRef, (snapshot) => {
      if (snapshot.exists()) {
        const softwareData = snapshot.val();
        const options = Object.keys(softwareData).map(key => ({
          id: key,
          name: softwareData[key].name
        }));
        setSoftwareOptions(options);
      }
    });
  }, []);

  const handleAddSoftware = () => {
    if (isNewSoftware && softwareName && softwareVersion) {
      const softwareRef = ref(database, 'softwares');
      const newSoftware = {
        name: softwareName,
        versions: [softwareVersion]
      };
      push(softwareRef, newSoftware)
        .then(() => {
          console.log('Software added successfully.');
          setSoftwareName('');
          setSoftwareVersion('');
        })
        .catch(error => {
          console.error('Error adding software:', error);
        });
    } else if (!isNewSoftware && softwareName && softwareVersion) {
      const selectedSoftware = softwareOptions.find(software => software.name === softwareName);
      if (selectedSoftware) {
        const softwareId = selectedSoftware.id;
        const versionsRef = ref(database, `softwares/${softwareId}/versions`);
        push(versionsRef, softwareVersion)
          .then(() => {
            console.log('Version added successfully.');
            setSoftwareVersion('');
          })
          .catch(error => {
            console.error('Error adding version:', error);
          });
      } else {
        console.error('Selected software not found.');
      }
    } else {
      console.error('Please enter both software name and version.');
    }
  };

  return (
    <div>
      <h2>Add Software</h2>
      <div>
        <label>Select or Add Software:</label>
        <select
            onChange={(e) => {
                const selectedValue = e.target.value;
                if (selectedValue === 'new') {
                setIsNewSoftware(true);
                setSoftwareName('');
                } else {
                setIsNewSoftware(false);
                setSoftwareName(selectedValue);
                }
            }}
            defaultValue="new" // Set the default value to 'new' for "Add New Software"
        >
            <option value="new">Add New Software</option>
            {softwareOptions.map(software => (
                <option key={software.id} value={software.name}>
                {software.name}
                </option>
            ))}
        </select>
      </div>

      {isNewSoftware && (
        <div>
          <label>New Software Name:</label>
          <input
            type="text"
            value={softwareName}
            onChange={(e) => setSoftwareName(e.target.value)}
          />
        </div>
      )}

      <div>
        <label>Software Version:</label>
        <input
          type="text"
          value={softwareVersion}
          onChange={(e) => setSoftwareVersion(e.target.value)}
        />
      </div>

      <button onClick={handleAddSoftware}>Add Software</button>
    </div>
  );
};

export default AddSoftware;
