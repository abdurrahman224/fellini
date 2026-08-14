import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { updateHabit } from '../../../../../../features/habits/habitsAPI';

const ViewHabitModal = ({ open, onClose, habit }) => {
    const [saving, setSaving] = useState(false);

    // Editable fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [frequency, setFrequency] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [targetDays, setTargetDays] = useState([]);
    const [targetTimesPerDay, setTargetTimesPerDay] = useState(1);
    const [reminderTime, setReminderTime] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const categories = ['LEARNING', 'HEALTH', 'FITNESS', 'PRODUCTIVITY', 'MINDFULNESS', 'SOCIAL', 'OTHER'];
    const frequencies = ['DAILY', 'WEEKLY', 'MONTHLY'];
    const difficulties = ['EASY', 'MEDIUM', 'HARD'];

    // Initialize form fields when habit prop changes
    useEffect(() => {
        if (habit) {
            setName(habit.name);
            setDescription(habit.description || '');
            setCategory(habit.category);
            setFrequency(habit.frequency);
            setDifficulty(habit.difficulty);
            setTargetDays(habit.targetDays || []);
            setTargetTimesPerDay(habit.targetTimesPerDay);
            setReminderTime(habit.reminderTime);
            setHasChanges(false);
        }
    }, [habit]);

    // Track changes
    useEffect(() => {
        if (habit) {
            const changed =
                name !== habit.name ||
                description !== (habit.description || '') ||
                category !== habit.category ||
                frequency !== habit.frequency ||
                difficulty !== habit.difficulty ||
                JSON.stringify(targetDays) !== JSON.stringify(habit.targetDays || []) ||
                targetTimesPerDay !== habit.targetTimesPerDay ||
                reminderTime !== habit.reminderTime;
            setHasChanges(changed);
        }
    }, [name, description, category, frequency, difficulty, targetDays, targetTimesPerDay, reminderTime, habit]);

    if (!open) return null;

    const handleDayToggle = (day) => {
        setTargetDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleSaveChanges = async () => {
        if (!name.trim()) {
            toast.warning('Please enter a habit name', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        try {
            setSaving(true);
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

            const response = await updateHabit(habit.id, habitData);
            if (response.success) {
                toast.success('Habit updated successfully', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                setHasChanges(false);
                // Close modal and trigger parent refresh
                setTimeout(() => {
                    onClose(true); // Pass true to indicate data was updated
                }, 500);
            } else {
                throw new Error(response.message || 'Failed to update habit');
            }
        } catch (error) {
            console.error('Error updating habit:', error);
            toast.error(error.message || 'Failed to update habit. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 animate-fadeIn">
            {/* Modal Container */}
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl h-[600px] max-h-[80vh] bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-500 overflow-hidden flex flex-col animate-scaleIn">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-500">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Habit</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-white dark:hover:text-gray-300 transition-colors">
                        <X size={24} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 overflow-y-auto flex-1">
                    {habit ? (
                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
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
                                <label htmlFor="description" className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
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

                            {/* Category, Frequency, Difficulty - Grid */}
                            <div className="grid grid-cols-1 gap-4">
                                {/* Category */}
                                <div>
                                    <label htmlFor="category" className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
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
                                    <label htmlFor="frequency" className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
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
                                    <label htmlFor="difficulty" className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
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
                            </div>

                            {/* Target Days */}
                            <div>
                                <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
                                    Target Days
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {daysOfWeek.map((day) => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => handleDayToggle(day)}
                                            className={`px-3 py-2 rounded-lg text-base font-medium transition-colors ${targetDays.includes(day)
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-zinc-600'
                                                }`}
                                        >
                                            {day.substring(0, 3)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Target Times Per Day & Reminder Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Target Times Per Day */}
                                <div>
                                    <label htmlFor="targetTimes" className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
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
                                    <label htmlFor="reminderTime" className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
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
                    ) : (
                        <div className="text-center py-12 text-red-600 dark:text-red-400">
                            Failed to load habit details
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-zinc-500">
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="px-6 py-2.5 border border-gray-400 dark:border-zinc-500 rounded-lg text-gray-600 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleSaveChanges}
                        disabled={!hasChanges || saving}
                        className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-600"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewHabitModal;
