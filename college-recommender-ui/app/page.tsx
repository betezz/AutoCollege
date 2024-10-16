'use client';

import { useState } from 'react';

const GPA_SCALES = {
  '4.0 Unweighted': { min: 0, max: 4.0 },
  '4.0 Weighted': { min: 0, max: 5.0 },
  '100 Scale': { min: 0, max: 100 },
};

export default function Scholarships() {
  const [studentData, setStudentData] = useState({
    gpa: '',
    gpaScale: '4.0 Unweighted',
    major: '',
    gradeLevel: '',
    extracurriculars: '',
    state: '',
  });
  const [scholarships, setScholarships] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { min, max } = GPA_SCALES[studentData.gpaScale];
    const gpa = parseFloat(studentData.gpa);
    if (isNaN(gpa) || gpa < min || gpa > max) {
      setError(`GPA must be between ${min} and ${max} for the selected scale.`);
      return;
    }

    const res = await fetch('http://127.0.0.1:8000/scholarships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });

    if (res.ok) {
      const data = await res.json();
      setScholarships(data);
    } else {
      setError('No scholarships found.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Find Scholarships</h1>
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="gpa" className="block text-sm font-medium text-gray-700 mb-1">
                  GPA
                </label>
                <div className="flex">
                  <input
                    id="gpa"
                    name="gpa"
                    type="number"
                    step="0.01"
                    value={studentData.gpa}
                    onChange={handleInputChange}
                    className="flex-grow rounded-l-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                  <select
                    name="gpaScale"
                    value={studentData.gpaScale}
                    onChange={handleInputChange}
                    className="rounded-r-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    {Object.keys(GPA_SCALES).map((scale) => (
                      <option key={scale} value={scale}>
                        {scale}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
                  Major
                </label>
                <input
                  id="major"
                  name="major"
                  type="text"
                  value={studentData.major}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Grade Level
                </label>
                <select
                  id="gradeLevel"
                  name="gradeLevel"
                  value={studentData.gradeLevel}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                >
                  <option value="">Select Grade Level</option>
                  <option value="High School">High School</option>
                  <option value="Freshman">College Freshman</option>
                  <option value="Sophomore">College Sophomore</option>
                  <option value="Junior">College Junior</option>
                  <option value="Senior">College Senior</option>
                </select>
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={studentData.state}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="extracurriculars" className="block text-sm font-medium text-gray-700 mb-1">
                Extracurricular Activities
              </label>
              <textarea
                id="extracurriculars"
                name="extracurriculars"
                value={studentData.extracurriculars}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="List your extracurricular activities..."
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Find Scholarships
              </button>
            </div>
          </form>
        </div>

        {scholarships.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <h2 className="text-2xl font-semibold text-gray-800 p-6 bg-gray-50 border-b border-gray-200">
              Available Scholarships
            </h2>
            <ul className="divide-y divide-gray-200">
              {scholarships.map((scholarship, index) => (
                <li key={index} className="p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-medium text-indigo-600">{scholarship.Name}</div>
                    <div className="text-lg font-semibold text-gray-700">Award: ${scholarship.Award}</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">Deadline: {scholarship.Deadline}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
