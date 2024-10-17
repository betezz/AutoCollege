import React, { useState } from 'react';
import Select from 'react-select';

const TEST_TYPES = [
  { value: 'SAT', label: 'SAT' },
  { value: 'ACT', label: 'ACT' },
  { value: 'PSAT', label: 'PSAT' },
  { value: 'IB', label: 'IB' },
  { value: 'Other', label: 'Other' },
];

const TEST_RANGES = {
  SAT: { min: 400, max: 1600 },
  ACT: { min: 1, max: 36 },
  PSAT: { min: 320, max: 1520 },
  IB: { min: 1, max: 45 },
  Other: { min: 0, max: Infinity },
};

interface TestScore {
  test: string;
  score: string;
}

interface TestScoresProps {
  scores: TestScore[];
  onChange: (scores: TestScore[]) => void;
}

export default function TestScores({ scores, onChange }: TestScoresProps) {
  const [errors, setErrors] = useState<string[]>([]);

  const addScore = () => {
    onChange([...scores, { test: '', score: '' }]);
    setErrors([...errors, '']);
  };

  const removeScore = (index: number) => {
    onChange(scores.filter((_, i) => i !== index));
    setErrors(errors.filter((_, i) => i !== index));
  };

  const updateScore = (index: number, field: 'test' | 'score', value: string) => {
    const newScores = [...scores];
    newScores[index][field] = value;
    
    // Validate the score when it's updated
    if (field === 'score') {
      const testType = newScores[index].test as keyof typeof TEST_RANGES;
      const scoreNum = parseInt(value);
      const range = TEST_RANGES[testType] || TEST_RANGES.Other;
      
      if (isNaN(scoreNum) || scoreNum < range.min || scoreNum > range.max) {
        const newErrors = [...errors];
        newErrors[index] = `Invalid score. Range for ${testType}: ${range.min}-${range.max}`;
        setErrors(newErrors);
      } else {
        const newErrors = [...errors];
        newErrors[index] = '';
        setErrors(newErrors);
      }
    }
    
    onChange(newScores);
  };

  return (
    <div className="space-y-4">
      {scores.map((score, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center space-x-2">
            <Select
              options={TEST_TYPES}
              value={TEST_TYPES.find(t => t.value === score.test)}
              onChange={(selected) => updateScore(index, 'test', selected?.value || '')}
              className="w-1/2"
              placeholder="Select test"
            />
            <input
              type="number"
              value={score.score}
              onChange={(e) => updateScore(index, 'score', e.target.value)}
              className="w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Score"
            />
            <button
              type="button"
              onClick={() => removeScore(index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
          {errors[index] && (
            <p className="text-red-500 text-sm">{errors[index]}</p>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addScore}
        className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Test Score
      </button>
    </div>
  );
}
