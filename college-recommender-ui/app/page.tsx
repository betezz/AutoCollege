'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import { STATES, MAJORS, DEMOGRAPHICS, SPECIAL_CIRCUMSTANCES, SCHOLARSHIP_PREFERENCES } from './data/datas';
import TestScores from './components/Components';
import { TEST_RANGES } from './utils/constants/TestRanges';

const GPA_SCALES = {
  '4.0 Unweighted': { min: 0, max: 4.0 },
  '4.0 Weighted': { min: 0, max: 5.0 },
  '100 Scale': { min: 0, max: 100 },
};

const INCOME_RANGES = [
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
  { value: '0-30000', label: '$0 - $30,000' },
  { value: '30001-60000', label: '$30,001 - $60,000' },
  { value: '60001-90000', label: '$60,001 - $90,000' },
  { value: '90001-120000', label: '$90,001 - $120,000' },
  { value: '120001-150000', label: '$120,001 - $150,000' },
  { value: '150001-plus', label: '$150,001+' },
];

interface StateOption {
  value: string;
  label: string;
}

interface MajorOption {
  value: string;
  label: string;
}

interface DemographicsOption {
  value: string;
  label: string;
}

interface SpecialCircumstancesOption {
  value: string;
  label: string;
}

interface ScholarshipPreferencesOption {
  value: string;
  label: string;
}

export default function Scholarships() {
  const [studentData, setStudentData] = useState({
    gpa: '',
    gpaScale: '4.0 Unweighted',
    major: null as MajorOption | null,
    gradeLevel: '',
    state: null as StateOption | null,
    testScores: [] as { test: string; score: string }[],
    financialNeedIncome: null as { value: string; label: string } | null,
    demographics: [] as DemographicsOption[],
    careerGoals: '',
    specialCircumstances: [] as SpecialCircumstancesOption[],
    scholarshipPreferences: [] as ScholarshipPreferencesOption[],
  });

  const [scholarships, setScholarships] = useState([]);
  const [error, setError] = useState('');

  const [statesOptions, setStatesOptions] = useState<StateOption[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    console.log('STATES imported:', STATES);
    if (Array.isArray(STATES) && STATES.length > 0) {
      setStatesOptions(STATES);
    } else {
      console.error('STATES array is empty or not properly imported');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate GPA
    const { min, max } = GPA_SCALES[studentData.gpaScale];
    const gpa = parseFloat(studentData.gpa);
    if (isNaN(gpa) || gpa < min || gpa > max) {
      setError(`GPA must be between ${min} and ${max} for the selected scale.`);
      return;
    }

    // Validate financial need
    const financialNeed = parseFloat(studentData.financialNeedIncome?.value);
    if (isNaN(financialNeed) || financialNeed < 0) {
      setError('Please enter a valid household income.');
      return;
    }

    // Validate test scores
    const invalidScores = studentData.testScores.filter(score => {
      const testType = score.test as keyof typeof TEST_RANGES;
      const scoreNum = parseInt(score.score);
      const range = TEST_RANGES[testType] || TEST_RANGES.Other;
      return isNaN(scoreNum) || scoreNum < range.min || scoreNum > range.max;
    });

    if (invalidScores.length > 0) {
      setError('Please correct the invalid test scores before submitting.');
      return;
    }

    // If all validations pass, submit the data
    const res = await fetch('http://127.0.0.1:8000/scholarships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...studentData,
        major: studentData.major?.value,
        state: studentData.state?.value,
        demographics: studentData.demographics.map(d => d.value),
        specialCircumstances: studentData.specialCircumstances.map(s => s.value),
        scholarshipPreferences: studentData.scholarshipPreferences.map(p => p.value),
      }),
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
            {/* Academic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GPA */}
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

              {/* Major */}
              <div>
                <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
                  Major / Intended Major
                </label>
                <Select
                  id="major"
                  name="major"
                  options={MAJORS}
                  value={studentData.major}
                  onChange={(selectedOption) => setStudentData({ ...studentData, major: selectedOption })}
                  className="rounded-md"
                  classNamePrefix="select"
                  placeholder="Select Major"
                  isClearable
                />
              </div>

              {/* Grade Level */}
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

              {/* State */}
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                {isClient && (
                  <Select<StateOption>
                    id="state"
                    name="state"
                    options={STATES}
                    value={studentData.state}
                    onChange={(selectedOption) => setStudentData({ ...studentData, state: selectedOption })}
                    className="rounded-md"
                    classNamePrefix="select"
                    placeholder="Select State"
                    isClearable
                  />
                )}
              </div>
            </div>

            {/* Financial Need */}
            <div>
              <label htmlFor="financialNeedIncome" className="block text-sm font-medium text-gray-700 mb-1">
                Financial Need / Family Income (Optional)
              </label>
              <Select
                id="financialNeedIncome"
                name="financialNeedIncome"
                options={INCOME_RANGES}
                value={studentData.financialNeedIncome}
                onChange={(selectedOption) => setStudentData({ ...studentData, financialNeedIncome: selectedOption })}
                className="w-full rounded-md"
                classNamePrefix="select"
                placeholder="Select income range (optional)"
                isClearable
              />
            </div>

            {/* Demographics */}
            <div>
              <label htmlFor="demographics" className="block text-sm font-medium text-gray-700 mb-1">
                Demographics
              </label>
              <Select
                id="demographics"
                name="demographics"
                options={DEMOGRAPHICS}
                value={studentData.demographics}
                onChange={(selectedOptions) => setStudentData({ ...studentData, demographics: selectedOptions || [] })}
                className="rounded-md"
                classNamePrefix="select"
                placeholder="Select Demographics"
                isMulti
                isClearable
              />
            </div>

            {/* Career Goals */}
            <div>
              <label htmlFor="careerGoals" className="block text-sm font-medium text-gray-700 mb-1">
                Career Goals or Interests
              </label>
              <textarea
                id="careerGoals"
                name="careerGoals"
                value={studentData.careerGoals}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Describe your career goals or interests"
                rows={3}
                required
              ></textarea>
            </div>

            {/* Special Circumstances */}
            <div>
              <label htmlFor="specialCircumstances" className="block text-sm font-medium text-gray-700 mb-1">
                Special Circumstances (if applicable)
              </label>
              <Select
                id="specialCircumstances"
                name="specialCircumstances"
                options={SPECIAL_CIRCUMSTANCES}
                value={studentData.specialCircumstances}
                onChange={(selectedOptions) => setStudentData({ ...studentData, specialCircumstances: selectedOptions || [] })}
                className="rounded-md"
                classNamePrefix="select"
                placeholder="Select Special Circumstances"
                isMulti
                isClearable
              />
            </div>

            {/* Scholarship Preferences */}
            <div>
              <label htmlFor="scholarshipPreferences" className="block text-sm font-medium text-gray-700 mb-1">
                Scholarship Preferences
              </label>
              <Select
                id="scholarshipPreferences"
                name="scholarshipPreferences"
                options={SCHOLARSHIP_PREFERENCES}
                value={studentData.scholarshipPreferences}
                onChange={(selectedOptions) => setStudentData({ ...studentData, scholarshipPreferences: selectedOptions || [] })}
                className="rounded-md"
                classNamePrefix="select"
                placeholder="Select Scholarship Preferences"
                isMulti
                isClearable
              />
            </div>

            {/* Standardized Test Scores */}
            <div>
              <label htmlFor="testScores" className="block text-sm font-medium text-gray-700 mb-1">
                Standardized Test Scores
              </label>
              <TestScores
                scores={studentData.testScores}
                onChange={(newScores) => setStudentData({ ...studentData, testScores: newScores })}
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit Button */}
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

        {/* Scholarship Results */}
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
