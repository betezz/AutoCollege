'use client';

import { useState } from 'react';

export default function Scholarships() {
  const [studentData, setStudentData] = useState({ gpa: '', major: '' });
  const [scholarships, setScholarships] = useState([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://127.0.0.1:8000/scholarships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });

    if (res.ok) {
      const data = await res.json();
      setScholarships(data);
    } else {
      alert('No scholarships found.');
    }
  };

  return (
    <div>
      <h1>Find Scholarships</h1>
      <form onSubmit={handleSubmit}>
        <label>
          GPA:
          <input
            type="number"
            step="0.1"
            value={studentData.gpa}
            onChange={(e) =>
              setStudentData({ ...studentData, gpa: e.target.value })
            }
          />
        </label>
        <label>
          Major:
          <input
            type="text"
            value={studentData.major}
            onChange={(e) =>
              setStudentData({ ...studentData, major: e.target.value })
            }
          />
        </label>
        <button type="submit">Find Scholarships</button>
      </form>

      <ul>
        {scholarships.map((scholarship, index) => (
          <li key={index}>
            {scholarship.Name} - ${scholarship.Award} (Deadline: {scholarship.Deadline})
          </li>
        ))}
      </ul>
    </div>
  );
}
