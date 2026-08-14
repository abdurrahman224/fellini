import { useState, useMemo, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MonthlyPlanModal from './components/MonthlyPlanModal';
import MonthlyHeader from './components/MonthlyHeader';
import PlansSidebar from './components/PlansSidebar';
import AIInsight from './components/AIInsight';
import CalendarGrid from './components/CalendarGrid';
import DetailsModal from './components/DetailsModal';
import { fetchMonthlyPlans, generateMonthlyPlanWithAI } from '../../../../../features/monthlyPlans/monthlyPlansAPI';

// --- Custom Hook: Calendar Logic ---
const useCalendarGrid = (displayedDate) => {
  const calendarData = useMemo(() => {
    const year = displayedDate.getFullYear();
    const month = displayedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 0 = Sunday, 1 = Monday. We want Monday start.
    const startDayOfWeek = firstDay.getDay();
    const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const daysArray = [];

    // Add empty slots for previous month
    for (let i = 0; i < adjustedStartDay; i++) {
      daysArray.push({ date: null });
    }

    // Add actual days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      daysArray.push({ date: i });
    }

    // Fill remaining grid slots (min 35 cells)
    const remainingSlots = 35 - daysArray.length;
    if (remainingSlots > 0) {
      for (let i = 0; i < remainingSlots; i++) {
        daysArray.push({ date: null });
      }
    }

    return daysArray;
  }, [displayedDate]);

  const weekDays = useMemo(() => ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'], []);

  return { days: calendarData, weekDays };
};


export default function MonthlyPlanner() {
  const dispatch = useDispatch();
  const { plans, loading, currentConversationId, generating } = useSelector((state) => state.monthlyPlans);

  const [displayedDate, setDisplayedDate] = useState(() => new Date());  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailsModalState, setDetailsModalState] = useState({ open: false, data: null });
  const { days, weekDays } = useCalendarGrid(displayedDate);
  
  // Fetch plans on component mount
  useEffect(() => {
    dispatch(fetchMonthlyPlans());
  }, [dispatch]);

  const handleOpenAddModal = useCallback(() => setIsAddModalOpen(true), []);
  const handleCloseAddModal = useCallback(() => setIsAddModalOpen(false), []);

  const handleDateClick = useCallback((day) => {
    if (!day) return;
    const newDate = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), day);
    setDisplayedDate(newDate);
    handleOpenAddModal();
  }, [displayedDate, handleOpenAddModal]);

  const handleSavePlan = (plan) => {
    // This can be extended later with a create plan action
    handleCloseAddModal();
  };

  const handleViewMore = useCallback((plan) => {
    setDetailsModalState({ open: true, data: plan });
  }, []);

  const handleCloseDetailsModal = useCallback(() => {
    setDetailsModalState({ open: false, data: null });
  }, []);

  const handleGenerateWithAI = useCallback(async (userInput, conversationId = null) => {
    const monthStartDate = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), 1)
      .toISOString()
      .split('T')[0];

    const result = await dispatch(
      generateMonthlyPlanWithAI({
        userInput,
        monthStartDate,
        conversationId: conversationId || currentConversationId
      })
    );

    if (result.type.endsWith('/fulfilled')) {
      return { 
        success: true, 
        conversationId: result.payload.conversationId 
      };
    } else {
      return { 
        success: false, 
        error: result.payload || 'Failed to generate plan' 
      };
    }
  }, [dispatch, displayedDate, currentConversationId]);

  return (
    <div className="bg-[#EEEEEE] dark:bg-zinc-900 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Header Section */}
      <MonthlyHeader 
        displayedDate={displayedDate} 
        setDisplayedDate={setDisplayedDate} 
        onAddPlan={handleOpenAddModal} 
      />

      {/* AI Insights Section */}
      <AIInsight />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left Sidebar: Plan List */}
        <PlansSidebar 
          monthPlans={plans} 
          loadingPlans={loading} 
          onViewMore={handleViewMore} 
          onAddPlan={handleOpenAddModal}
          onGenerateWithAI={handleGenerateWithAI}
          generating={generating}
        />

        {/* Right Content: Calendar */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-800 rounded-2xl p-3 sm:p-6 shadow-sm min-h-100 lg:min-h-175">
          <CalendarGrid 
            days={days} 
            weekDays={weekDays} 
            handleDateClick={handleDateClick} 
          />
        </div>
      </div>

      {/* Modals */}
      <MonthlyPlanModal 
        open={isAddModalOpen} 
        onClose={handleCloseAddModal} 
        onSave={handleSavePlan} 
        initialDate={displayedDate} 
      />

      <DetailsModal 
        open={detailsModalState.open} 
        plan={detailsModalState.data} 
        onClose={handleCloseDetailsModal} 
      />

    </div>
  );
}