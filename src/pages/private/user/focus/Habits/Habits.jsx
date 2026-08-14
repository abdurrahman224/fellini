import React, { useState, useEffect } from 'react';
import { Flame, Plus, Trash2, TrendingUp, Target, Calendar, Award, Eye, Check, SkipForward, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import NewHabitsModal from './components/NewHabitsModal';
import ViewHabitModal from './components/ViewHabitModal';
import CompleteHabitModal from './components/CompleteHabitModal';
import SkipHabitModal from './components/SkipHabitModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import { getHabitsStatsOverview, getHabits, deleteHabit, completeHabit, skipHabit, getHabitById } from '../../../../../features/habits/habitsAPI';

export default function Habits() {
  const [modal, setModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);
  const [skipModal, setSkipModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [selectedHabitName, setSelectedHabitName] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [habitLoading, setHabitLoading] = useState(false);
  const [totalHabits, setTotalHabits] = useState(0);
  const [averageStreak, setAverageStreak] = useState(0);
  const [habitsCompletedToday, setHabitsCompletedToday] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);
  const [habitsLoading, setHabitsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterFrequency, setFilterFrequency] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  const handleOpenModal = () => setModal(true);
  const handleCloseModal = () => setModal(false);

  const handleOpenViewModal = async (habitId) => {
    try {
      setHabitLoading(true);
      const response = await getHabitById(habitId);
      if (response.success && response.habit) {
        setSelectedHabit(response.habit);
        setSelectedHabitId(habitId);
        setViewModal(true);
      } else {
        toast.error('Failed to load habit details', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error fetching habit details:', error);
      toast.error('Failed to load habit details', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setHabitLoading(false);
    }
  };

  const handleCloseViewModal = async (dataUpdated = false) => {
    setViewModal(false);
    setSelectedHabitId(null);
    setSelectedHabit(null);

    // If data was updated, refresh habits list and stats
    if (dataUpdated) {
      try {
        // Refresh habits list
        const habitsResponse = await getHabits();
        if (habitsResponse.success && habitsResponse.habits) {
          setHabits(habitsResponse.habits);
        }

        // Refresh stats
        const statsResponse = await getHabitsStatsOverview();
        if (statsResponse.success && statsResponse.stats) {
          setTotalHabits(statsResponse.stats.totalHabits || 0);
          setAverageStreak(statsResponse.stats.averageStreak || 0);
          setHabitsCompletedToday(statsResponse.stats.habitsCompletedToday || 0);
          setLongestStreak(statsResponse.stats.longestStreak || 0);
        }
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    }
  };

  const handleOpenCompleteModal = (habitId, habitName) => {
    setSelectedHabitId(habitId);
    setSelectedHabitName(habitName);
    setCompleteModal(true);
  };

  const handleCloseCompleteModal = () => {
    setCompleteModal(false);
    setSelectedHabitId(null);
    setSelectedHabitName('');
  };

  const handleOpenSkipModal = (habitId, habitName) => {
    setSelectedHabitId(habitId);
    setSelectedHabitName(habitName);
    setSkipModal(true);
  };

  const handleCloseSkipModal = () => {
    setSkipModal(false);
    setSelectedHabitId(null);
    setSelectedHabitName('');
  };

  const handleOpenDeleteModal = (habitId, habitName) => {
    setSelectedHabitId(habitId);
    setSelectedHabitName(habitName);
    setDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
    setSelectedHabitId(null);
    setSelectedHabitName('');
  };

  const handleSavePlan = async (newHabit) => {
    try {
      // Add new habit to the list
      setHabits((prev) => [newHabit, ...prev]);

      // Refresh stats
      const statsResponse = await getHabitsStatsOverview();
      if (statsResponse.success && statsResponse.stats) {
        setTotalHabits(statsResponse.stats.totalHabits || 0);
        setAverageStreak(statsResponse.stats.averageStreak || 0);
        setHabitsCompletedToday(statsResponse.stats.habitsCompletedToday || 0);
        setLongestStreak(statsResponse.stats.longestStreak || 0);
      }

      toast.success('Habit created successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error refreshing stats:', error);
      toast.error('Failed to refresh stats', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  // Fetch habits stats from API
  useEffect(() => {
    const fetchHabitsStats = async () => {
      try {
        setLoading(true);
        const response = await getHabitsStatsOverview();
        if (response.success && response.stats) {
          setTotalHabits(response.stats.totalHabits || 0);
          setAverageStreak(response.stats.averageStreak || 0);
          setHabitsCompletedToday(response.stats.habitsCompletedToday || 0);
          setLongestStreak(response.stats.longestStreak || 0);
        }
      } catch (error) {
        console.error('Error fetching habits stats:', error);
        toast.error('Failed to load statistics', {
          position: 'top-right',
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHabitsStats();
  }, []);

  // Fetch habits from API
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        setHabitsLoading(true);
        const response = await getHabits();
        if (response.success && response.habits) {
          setHabits(response.habits);
        }
      } catch (error) {
        console.error('Error fetching habits:', error);
        toast.error('Failed to load habits', {
          position: 'top-right',
          autoClose: 3000,
        });
      } finally {
        setHabitsLoading(false);
      }
    };

    fetchHabits();
  }, []);

  const handleViewHabit = (habitId) => {
    handleOpenViewModal(habitId);
  };

  const handleCompleteHabit = async (completionData) => {
    try {
      const response = await completeHabit(selectedHabitId, completionData);
      if (response.success) {
        // Refresh habits list and stats
        const habitsResponse = await getHabits();
        if (habitsResponse.success && habitsResponse.habits) {
          setHabits(habitsResponse.habits);
        }

        const statsResponse = await getHabitsStatsOverview();
        if (statsResponse.success && statsResponse.stats) {
          setTotalHabits(statsResponse.stats.totalHabits || 0);
          setAverageStreak(statsResponse.stats.averageStreak || 0);
          setHabitsCompletedToday(statsResponse.stats.habitsCompletedToday || 0);
          setLongestStreak(statsResponse.stats.longestStreak || 0);
        }

        toast.success('Habit completed successfully', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error completing habit:', error);
      toast.error('Failed to complete habit', {
        position: 'top-right',
        autoClose: 3000,
      });
      throw error;
    }
  };

  const handleSkipHabit = async (skipData) => {
    try {
      const response = await skipHabit(selectedHabitId, skipData);
      if (response.success) {
        // Refresh habits list
        const habitsResponse = await getHabits();
        if (habitsResponse.success && habitsResponse.habits) {
          setHabits(habitsResponse.habits);
        }

        toast.success('Habit skipped successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error skipping habit:', error);
      toast.error('Failed to skip habit', {
        position: 'top-right',
        autoClose: 3000,
      });
      throw error;
    }
  };

  const handleDeleteHabit = async () => {
    try {
      setDeleteLoading(true);
      const response = await deleteHabit(selectedHabitId);
      if (response.success) {
        setHabits(habits.filter((habit) => habit.id !== selectedHabitId));

        // Refresh stats
        const statsResponse = await getHabitsStatsOverview();
        if (statsResponse.success && statsResponse.stats) {
          setTotalHabits(statsResponse.stats.totalHabits || 0);
          setAverageStreak(statsResponse.stats.averageStreak || 0);
          setHabitsCompletedToday(statsResponse.stats.habitsCompletedToday || 0);
          setLongestStreak(statsResponse.stats.longestStreak || 0);
        }

        toast.success('Habit deleted successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
        handleCloseDeleteModal();
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter habits based on search and filters
  const filteredHabits = habits.filter((habit) => {
    const matchesSearch =
      habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      habit.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'all' || habit.category === filterCategory;
    const matchesFrequency = filterFrequency === 'all' || habit.frequency === filterFrequency;
    const matchesDifficulty = filterDifficulty === 'all' || habit.difficulty === filterDifficulty;

    return matchesSearch && matchesCategory && matchesFrequency && matchesDifficulty;
  });

  // Get unique values for filter options
  const categories = ['all', ...new Set(habits.map(h => h.category))];
  const frequencies = ['all', ...new Set(habits.map(h => h.frequency))];
  const difficulties = ['all', ...new Set(habits.map(h => h.difficulty))];

  return (
    <div className="bg-[#EEEEEE] dark:bg-zinc-900 p-4 min-h-screen sm:p-6 lg:p-8 font-sans text-base md:text-base">
      <div className="mb-6 flex items-start justify-between gap-4 sm:items-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">Habits Tracker</h1>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-2 md:px-6 py-2 font-semibold text-white hover:bg-purple-700"
        >
          <Plus size={20} /> New Habit
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Habits */}
        <div className="rounded-xl bg-white dark:bg-zinc-800 border-2 border-violet-100 dark:border-violet-800 p-4 md:p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-violet-50 dark:bg-violet-900/30">
              <Target size={20} className="text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">{loading ? '...' : totalHabits}</p>
              <p className="mt-1 text-base text-gray-600 dark:text-gray-300">Total Habits</p>
            </div>
          </div>
        </div>

        {/* Completed Today */}
        <div className="rounded-xl bg-white dark:bg-zinc-800 border-2 border-emerald-100 dark:border-emerald-800 p-4 md:p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
              <Calendar size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{loading ? '...' : habitsCompletedToday}</p>
              <p className="mt-1 text-base text-gray-600 dark:text-gray-300">Completed Today</p>
            </div>
          </div>
        </div>

        {/* Average Streak */}
        <div className="rounded-xl bg-white dark:bg-zinc-800 border-2 border-blue-100 dark:border-blue-800 p-4 md:p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30">
              <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{loading ? '...' : averageStreak}</p>
              <p className="mt-1 text-base text-gray-600 dark:text-gray-300">Average Streak</p>
            </div>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="rounded-xl bg-white dark:bg-zinc-800 border-2 border-red-100 dark:border-red-800 p-4 md:p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-50 dark:bg-red-900/30">
              <Award size={20} className="text-red-500 dark:text-red-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{loading ? '...' : longestStreak}</p>
              <p className="mt-1 text-base text-gray-600 dark:text-gray-300">Longest Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 bg-white dark:bg-zinc-800 rounded-xl p-4 md:p-6 shadow-sm border-2 border-purple-100 dark:border-purple-900/30">
        <div className="flex flex-col gap-4">
          {/* Search and Filters in One Line */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            {/* Search Bar */}
            <div className="lg:col-span-3 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search habits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Frequency Filter */}
            <div>
              <select
                value={filterFrequency}
                onChange={(e) => setFilterFrequency(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
              >
                {frequencies.map((frequency) => (
                  <option key={frequency} value={frequency}>
                    {frequency === 'all' ? 'All Frequencies' : frequency}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Difficulties' : difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count & Clear Filters */}

        </div>
      </div>

      {/* Habits List */}
      {habitsLoading ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          Loading habits...
        </div>
      ) : habits.length === 0 ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          No habits found. Create your first habit!
        </div>
      ) : filteredHabits.length === 0 ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          No habits match your search or filters. Try adjusting your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredHabits.map((habit) => (
            <div
              key={habit.id}
              className="bg-white dark:bg-zinc-800 rounded-xl p-4 md:p-6 shadow-sm border-2 border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
            >
              <div className="flex flex-col gap-4">
                {/* Habit Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {habit.name}
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 mb-2">
                    {habit.description}
                  </p>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                      {habit.category}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {habit.frequency}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      {habit.difficulty}
                    </span>
                  </div>
                  {/* Streak - Always at bottom */}
                  <div className="flex items-center gap-1 text-base text-gray-600 dark:text-gray-400 pt-2  dark:border-zinc-700">
                    <Flame size={16} className="text-orange-500" />
                    <span className="font-semibold">{habit.currentStreak}</span>
                    <span>day streak</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewHabit(habit.id)}
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                    title="View Details"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => handleOpenCompleteModal(habit.id, habit.name)}
                    className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors"
                    title="Complete"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => handleOpenSkipModal(habit.id, habit.name)}
                    className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50 transition-colors"
                    title="Skip"
                  >
                    <SkipForward size={20} />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(habit.id, habit.name)}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>


              </div>
            </div>
          ))}
        </div>
      )}
      <NewHabitsModal
        open={modal}
        onClose={handleCloseModal}
        onSave={handleSavePlan}
      />
      <ViewHabitModal
        open={viewModal}
        onClose={handleCloseViewModal}
        habit={selectedHabit}
      />
      <CompleteHabitModal
        open={completeModal}
        onClose={handleCloseCompleteModal}
        onComplete={handleCompleteHabit}
        habitName={selectedHabitName}
      />
      <SkipHabitModal
        open={skipModal}
        onClose={handleCloseSkipModal}
        onSkip={handleSkipHabit}
        habitName={selectedHabitName}
      />
      <DeleteConfirmationModal
        open={deleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteHabit}
        habitName={selectedHabitName}
        loading={deleteLoading}
      />
    </div>
  );
}
