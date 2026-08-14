import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { createHabit } from '../../../../../../features/habits/habitsAPI';

const NewHabitsModal = ({ open, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('LEARNING');
  const [frequency, setFrequency] = useState('WEEKLY');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [targetDays, setTargetDays] = useState([]);
  const [targetTimesPerDay, setTargetTimesPerDay] = useState(1);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [loading, setLoading] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const categories = ['LEARNING', 'HEALTH', 'FITNESS', 'PRODUCTIVITY', 'MINDFULNESS', 'SOCIAL', 'OTHER'];
  const frequencies = ['DAILY', 'WEEKLY', 'MONTHLY'];
  const difficulties = ['EASY', 'MEDIUM', 'HARD'];

  if (!open) return null;

  const handleDayToggle = (day) => {
    setTargetDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.warning('Please enter a habit name', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    if (targetDays.length === 0 && frequency === 'WEEKLY') {
      toast.warning('Please select at least one target day', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const habitData = {
        name,
        description,
        category,
        frequency,
        difficulty,
        targetDays,
        targetTimesPerDay,
        reminderTime,
      };

      const response = await createHabit(habitData);
      if (response.success) {
        onSave(response.habit);
        // Reset form
        setName('');
        setDescription('');
        setCategory('LEARNING');
        setFrequency('WEEKLY');
        setDifficulty('MEDIUM');
        setTargetDays([]);
        setTargetTimesPerDay(1);
        setReminderTime('20:00');
        onClose();
      } else {
        throw new Error(response.message || 'Failed to create habit');
      }
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error(error.message || 'Failed to create habit. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setCategory('LEARNING');
    setFrequency('WEEKLY');
    setDifficulty('MEDIUM');
    setTargetDays([]);
    setTargetTimesPerDay(1);
    setReminderTime('20:00');
    onClose();
  };




  return (
    <div onClick={handleCancel} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-50 p-4 sm:p-6 animate-fadeIn">
      {/* Modal Container */}
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl max-h-[70vh] bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-500 overflow-hidden flex flex-col animate-scaleIn">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">New Habit</h2>
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 dark:text-white dark:hover:text-gray-300 transition-colors">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="h-px bg-gray-200 dark:bg-zinc-500 w-full" />

        {/* Form Body - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Habit Name *
              </label>
              <input
                type="text"
                id="name"
                placeholder="e.g., Learn html 2 hours a day"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 text-gray-700 dark:bg-zinc-700 dark:placeholder:text-gray-400 dark:text-white"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </label>
              <textarea
                id="description"
                placeholder="e.g., Read books for personal development"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 text-gray-700 dark:bg-zinc-700 dark:placeholder:text-gray-400 dark:text-white resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 dark:bg-zinc-700 dark:text-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Frequency */}
            <div>
              <label htmlFor="frequency" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Frequency
              </label>
              <select
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 dark:bg-zinc-700 dark:text-white"
              >
                {frequencies.map((freq) => (
                  <option key={freq} value={freq}>
                    {freq}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 dark:bg-zinc-700 dark:text-white"
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Days */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Target Days {frequency === 'WEEKLY' && '*'}
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${targetDays.includes(day)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-zinc-600'
                      }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Times Per Day */}
            <div>
              <label htmlFor="targetTimes" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Times Per Day
              </label>
              <input
                type="number"
                id="targetTimes"
                min="1"
                max="10"
                value={targetTimesPerDay}
                onChange={(e) => setTargetTimesPerDay(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 dark:bg-zinc-700 dark:text-white"
              />
            </div>

            {/* Reminder Time */}
            <div>
              <label htmlFor="reminderTime" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Reminder Time
              </label>
              <input
                type="time"
                id="reminderTime"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 dark:bg-zinc-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-200 dark:bg-zinc-500 w-full" />

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end px-6 py-4">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-400 dark:border-zinc-500 rounded-lg text-gray-600 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Habit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewHabitsModal;
