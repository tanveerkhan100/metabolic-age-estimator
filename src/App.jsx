import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('female');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [restingHr, setRestingHr] = useState('');
  const [activity, setActivity] = useState('moderate');

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const calculateMetabolicAge = (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const ageNum = Number(age);
    const heightNum = Number(height);
    const weightNum = Number(weight);
    const hrNum = Number(restingHr);

    if (!ageNum || !heightNum || !weightNum || !hrNum) {
      setError('Please enter valid inputs.');
      return;
    }

    const h = heightNum / 100;
    const bmi = weightNum / (h * h);

    let score = 0;

    // Resting HR score
    if (hrNum <= 55) score += 3;
    else if (hrNum <= 65) score += 2;
    else if (hrNum <= 75) score += 1;
    else if (hrNum <= 85) score += 0;
    else score -= 1;

    // Activity score
    const activityScores = {
      sedentary: -2,
      light: -1,
      moderate: 0,
      active: 2,
      very_active: 3,
    };
    score += activityScores[activity];

    // BMI score
    if (bmi < 18.5 || bmi > 32) score -= 2;
    else if (bmi >= 18.5 && bmi < 25) score += 2;
    else if (bmi >= 25 && bmi < 30) score += 0;
    else score -= 1;

    // Convert score → metabolic age difference
    let ageDelta = 0;
    if (score >= 6) ageDelta = -10;
    else if (score >= 4) ageDelta = -5;
    else if (score >= 2) ageDelta = -2;
    else if (score >= -1) ageDelta = 0;
    else if (score >= -3) ageDelta = 3;
    else ageDelta = 7;

    let metabolicAge = Math.min(80, Math.max(18, ageNum + ageDelta));

    setResult({
      metabolicAge,
      bmi: bmi.toFixed(1),
      ageDelta,
    });
  };

  const inputBase =
    'w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm';

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white shadow-md h-fit rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Metabolic Age Estimator
        </h2>
        <p className="text-gray-500 text-sm text-center mb-5">
          Non-medical estimate based on BMI, activity level, and resting heart
          rate.
        </p>

        <form onSubmit={calculateMetabolicAge} className="space-y-4">
          {/* Row 1: Age + Sex */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium block">Age (years)</label>
              <input
                className={inputBase}
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium block">Sex</label>
              <select
                className={inputBase}
                value={sex}
                onChange={(e) => setSex(e.target.value)}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other / Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Row 2: Height + Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium block">Height (cm)</label>
              <input
                className={inputBase}
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium block">Weight (kg)</label>
              <input
                className={inputBase}
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Row 3: Resting HR + Activity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium block">
                Resting Heart Rate (bpm)
              </label>
              <input
                className={inputBase}
                type="number"
                value={restingHr}
                onChange={(e) => setRestingHr(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium block">Activity Level</label>
              <select
                className={inputBase}
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light Activity</option>
                <option value="moderate">Moderate Activity</option>
                <option value="active">Active</option>
                <option value="very_active">Very Active</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm transition"
          >
            Calculate
          </button>
        </form>

        {error && (
          <p className="mt-4 bg-red-100 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </p>
        )}

        {/* Animated result section */}
        <div
          className={`transition-all duration-500 overflow-hidden ${
            result ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          {result && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
              <h3 className="text-lg font-medium mb-2">
                Your Estimated Metabolic Age
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {result.metabolicAge} years
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Difference from actual age:{' '}
                <strong>
                  {result.ageDelta > 0 ? '+' : ''}
                  {result.ageDelta}
                </strong>{' '}
                years
              </p>

              <hr className="my-3" />

              <p className="text-gray-500 text-sm">
                BMI: <strong>{result.bmi}</strong>
              </p>

              <p className="text-xs text-gray-400 mt-3">
                Educational use only. Not medical advice.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
