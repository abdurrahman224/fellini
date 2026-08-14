import { useState, useRef, useEffect } from 'react';
import { X, Calendar, Clock, Clock9 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createDailyPlan, fetchDailyPlans } from '../../../../../../features/plans/plansSlice';
import axiosInstance from '../../../../../../services/axiosInstance';
import { toast } from 'react-toastify';

export default function DailyPlanModal({ open, onClose, onSave, mode = 'create', initialData = null }) {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        title: '',
        startDate: new Date().toISOString().split('T')[0],
        dueDate: '00:00',
        category: 'Work',
        priority: 'Medium',
        status: 'To Do',
        description: '',
    });
    const [saving, setSaving] = useState(false);
    const dateRef = useRef(null);
    const timeRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        if (mode === 'edit' && initialData) {
            // map initialData to form fields
            const sd = initialData.startDate ? new Date(initialData.startDate) : new Date();
            const datePart = sd.toISOString().split('T')[0];
            const timePart = sd.toTimeString().slice(0,5) || '00:00';
            setFormData({
                title: initialData.title || '',
                startDate: datePart,
                dueDate: timePart,
                category: initialData.category === 'WORK' ? 'Work' : initialData.category === 'HEALTH' ? 'Health' : initialData.category === 'PERSONAL' ? 'Personal' : (initialData.category || 'Work'),
                priority: initialData.priority === 'LOW' ? 'Low' : initialData.priority === 'HIGH' ? 'High' : 'Medium',
                status: initialData.status === 'TODO' ? 'To Do' : initialData.status === 'IN_PROGRESS' ? 'In Progress' : initialData.status === 'DONE' ? 'Done' : (initialData.status || 'To Do'),
                description: initialData.description || '',
            });
        } else if (mode === 'create') {
            setFormData({
                title: '',
                startDate: new Date().toISOString().split('T')[0],
                dueDate: '00:00',
                category: 'Work',
                priority: 'Medium',
                status: 'To Do',
                description: '',
            });
        }
    }, [open, mode, initialData]);

    if (!open) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        // combine date + time into ISO datetimes
        const datePart = formData.startDate;
        const timePart = formData.dueDate || '00:00';
        const combined = datePart ? new Date(`${datePart}T${timePart}:00`) : null;
        const payload = {
            title: formData.title,
            description: formData.description,
            startDate: combined ? combined.toISOString() : undefined,
            dueDate: combined ? combined.toISOString() : undefined,
            category:
                formData.category === 'Work'
                    ? 'WORK'
                    : formData.category === 'Personal'
                        ? 'PERSONAL'
                        : formData.category === 'HEALTH' || formData.category === 'Health'
                            ? 'HEALTH'
                            : formData.category?.toUpperCase(),
            priority:
                formData.priority === 'Low'
                    ? 'LOW'
                    : formData.priority === 'High'
                        ? 'HIGH'
                        : 'MEDIUM',
            status:
                formData.status === 'To Do'
                    ? 'TODO'
                    : formData.status === 'In Progress'
                        ? 'IN_PROGRESS'
                        : formData.status === 'Done'
                            ? 'DONE'
                            : formData.status?.toUpperCase(),
        };

        setSaving(true);
        try {
            if (mode === 'edit' && initialData?.id) {
                // Call PUT directly to capture message and then refresh
                const res = await axiosInstance.put(`/api/v1/daily-plans/${initialData.id}`, payload);
                const message = res?.data?.message;
                if (message) toast.success(message);
                else toast.success('Plan updated');
                // Refresh plans in store
                dispatch(fetchDailyPlans());
                if (onSave) onSave(res?.data?.data || res?.data || initialData);
                onClose();
            } else {
                const action = await dispatch(createDailyPlan(payload));
                if (createDailyPlan.fulfilled.match(action)) {
                    const result = action.payload;
                    const created = result?.created ?? result;
                    const message = result?.message;
                    if (message) toast.success(message);
                    else toast.success('Plan created');
                    if (onSave) onSave(created);
                    onClose();
                } else {
                    const errMsg = action.error?.message || 'Failed to create plan';
                    toast.error(errMsg);
                }
            }
        } catch (err) {
            const msg = err?.response?.data?.message || err.message || 'Failed to save plan';
            toast.error(msg);
            console.error('Failed to save plan', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#121111CC] p-4"
        >
            <style>{`input[type="date"]::-webkit-calendar-picker-indicator, input[type="time"]::-webkit-calendar-picker-indicator { display: none; -webkit-appearance: none; }`}</style>
            {/* Modal */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-xl bg-white dark:bg-zinc-800  shadow-lg"
            >
                {/* ================= HEADER (FIXED) ================= */}
                <div className="sticky top-0 z-10 flex items-center justify-between  bg-white dark:bg-zinc-800  p-5 rounded-xl">
                    <h2 className="text-xl font-bold text-gray-900  dark:text-gray-100">New Plan</h2>
                    <button onClick={onClose} className="text-gray-600  dark:text-gray-200">
                        <X size={24} />
                    </button>
                </div>

                {/* ================= CONTENT (SCROLL) ================= */}
                <div className="flex-1 overflow-y-auto p-5 border-t  border-[#949ea3] dark:border-gray-700">
                    {/* Title */}
                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-semibold text-gray-900  dark:text-gray-100">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g., Deep Work"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 bg-[#F8FBFE]  dark:bg-zinc-800 px-4 py-2 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none dark:text-gray-300"
                        />
                    </div>

                    {/* Dates */}
                    <div className="mb-6 grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-900  dark:text-gray-100">
                                Date
                            </label>
                            <div className="relative">
                                <input
                                    ref={dateRef}
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border  border-gray-300 bg-[#F8FBFE] dark:text-gray-400 dark:bg-zinc-800 px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none placeholder-gray-400 dark:placeholder-gray-100"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (dateRef.current) {
                                            if (dateRef.current.showPicker) dateRef.current.showPicker();
                                            else { dateRef.current.focus(); }
                                        }
                                    }}
                                    className="absolute right-3 top-2.5 text-gray-400"
                                >
                                    <Calendar size={18} />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-900  dark:text-gray-100">
                                Time
                            </label>
                            <div className="relative">
                                <input
                                    ref={timeRef}
                                    type="time"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 bg-[#F8FBFE] dark:text-gray-400 dark:text-gray-40 dark:bg-zinc-800 px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                />
                                 <button
                                    type="button"
                                    onClick={() => {
                                        if (timeRef.current) {
                                            if (timeRef.current.showPicker) timeRef.current.showPicker();
                                            else { timeRef.current.focus(); }
                                        }
                                    }}
                                    className="absolute right-3 top-2.5 text-gray-400"
                                >
                                    <Clock9 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Category & Priority */}
                    <div className="mb-6 grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-900  dark:text-gray-100">
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full rounded-md border border-gray-300 bg-[#F8FBFE] dark:bg-zinc-800 px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none dark:text-gray-400"
                            >
                                <option>Work</option>
                                <option>Personal</option>
                                <option>Health</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange}
                                className="w-full rounded-md border border-gray-300 dark:text-gray-400 bg-[#F8FBFE] dark:bg-zinc-800 px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 bg-[#F8FBFE] dark:bg-zinc-800 px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none dark:text-gray-400"
                        >
                            <option>To Do</option>
                            <option>In Progress</option>
                            <option>Done</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div className="">
                        <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="4"
                            placeholder="Add details"
                            className="w-full resize-none rounded-md border border-gray-300 dark:text-gray-400 bg-[#F8FBFE] dark:bg-zinc-800 px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                {/* ================= FOOTER (FIXED) ================= */}
                <div className="sticky bottom-0  bg-white dark:bg-zinc-800 px-5 pb-5.5 rounded-xl">
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 dark:text-gray-400  "
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`flex-1 rounded-md px-4 py-2 font-medium text-white ${saving ? 'bg-[#7C3AED] opacity-60' : 'bg-[#7C3AED]'}`}
                        >
                            {saving ? 'Saving...' : 'Save Plan'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}