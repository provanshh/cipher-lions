import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure your styles are applied

const Dashboard = () => {
  const [visitedUrls, setVisitedUrls] = useState([
    { url: 'www.example1.com', timeSpent: 5, timeCap: null },
    { url: 'www.example2.com', timeSpent: 10, timeCap: null }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newTimeCap, setNewTimeCap] = useState('');

  const handleTimeCapChange = (index, value) => {
    const newVisitedUrls = [...visitedUrls];
    newVisitedUrls[index].timeCap = value;
    setVisitedUrls(newVisitedUrls);
  };

  const updateTimeSpent = () => {
    const newVisitedUrls = visitedUrls.map((entry) => {
      if (entry.timeCap && entry.timeSpent >= entry.timeCap) {
        alert(`Time limit exceeded for ${entry.url}. Closing the website...`);
        // Logic for Chrome Extension API
      } else {
        entry.timeSpent += 1;
      }
      return entry;
    });
    setVisitedUrls(newVisitedUrls);
  };

  useEffect(() => {
    const interval = setInterval(updateTimeSpent, 60000);
    return () => clearInterval(interval);
  }, [visitedUrls]);

  const handleAddUrl = () => {
    if (newUrl.trim() === '' || newTimeCap === '') return;

    const newEntry = {
      url: newUrl.trim(),
      timeSpent: 0,
      timeCap: parseInt(newTimeCap)
    };

    setVisitedUrls([...visitedUrls, newEntry]);
    setShowModal(false);
    setNewUrl('');
    setNewTimeCap('');
  };

  return (
    <div id="dashboard">
      <h2>Parent Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>URL</th>
            <th>Time Spent (mins)</th>
            <th>Set Time Cap</th>
          </tr>
        </thead>
        <tbody>
          {visitedUrls.map((entry, index) => (
            <tr key={index}>
              <td>{entry.url}</td>
              <td>{entry.timeSpent} mins</td>
              <td>
                <input
                  type="number"
                  value={entry.timeCap || ''}
                  onChange={(e) => handleTimeCapChange(index, parseInt(e.target.value))}
                  placeholder="Set cap in mins"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Button */}
      <button onClick={() => setShowModal(true)}>Add URL & Time Cap</button>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add URL & Time Cap</h3>
            <input
              type="text"
              placeholder="Enter URL"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <input
              type="number"
              placeholder="Enter time cap (mins)"
              value={newTimeCap}
              onChange={(e) => setNewTimeCap(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleAddUrl}>Add</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
