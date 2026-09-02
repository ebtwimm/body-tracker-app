import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [message, setMessage] = useState('');

  // Calculate BMI live as user types
  useEffect(() => {
    if (weight > 0 && height > 0) {
      const heightInMeters = height / 100;
      const calculatedBmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(calculatedBmi);
    } else {
      setBmi(null);
    }
  }, [weight, height]);

  // Fetch comparison data on mount
  useEffect(() => {
    fetchComparison();
  }, []);

  const fetchComparison = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/measurements/compare', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setComparison(data);
    } catch (err) {
      console.error('Failed to load comparison data', err);
    }
  };

  const handleSaveMeasurement = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/measurements', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ weight, height, bmi }),
      });
      
      if (res.ok) {
        setMessage('Measurements saved successfully for this month!');
        fetchComparison(); // Refresh comparison view
      } else {
        setMessage('Error saving data.');
      }
    } catch (err) {
      setMessage('Server error while saving.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
          <h1 className="text-xl font-bold text-gray-800">Monthly Body Metric Tracker</h1>
          <button 
            onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </header>

        {/* Input & Calculator Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Add This Month's Measurements</h2>
          {message && <p className="mb-4 text-sm text-green-600">{message}</p>}
          <form onSubmit={handleSaveMeasurement} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm text-gray-600">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-1 w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Height (cm)</label>
              <input
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="mt-1 w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <div className="text-sm text-gray-600">Calculated BMI:</div>
              <div className="text-xl font-bold text-indigo-600">{bmi ? bmi : '--'}</div>
            </div>
            <button
              type="submit"
              className="md:col-span-3 bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition"
            >
              Save Monthly Entry
            </button>
          </form>
        </div>

        {/* Comparison Section */}
        {comparison && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Month-over-Month Comparison</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded border">
                <p className="text-sm text-gray-500">Current Weight</p>
                <p className="text-2xl font-bold">{comparison.current.weight} kg</p>
              </div>
              <div className="p-4 bg-gray-50 rounded border">
                <p className="text-sm text-gray-500">Previous Weight</p>
                <p className="text-2xl font-bold">{comparison.previous?.weight || 'N/A'} kg</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded border border-indigo-200">
                <p className="text-sm text-indigo-700">Weight Difference</p>
                <p className={`text-2xl font-bold ${comparison.difference <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {comparison.difference !== undefined ? `${comparison.difference > 0 ? '+' : ''}${comparison.difference} kg` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}