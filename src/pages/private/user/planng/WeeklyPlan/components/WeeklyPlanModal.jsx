import { useState, useRef, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import axiosInstance from '../../../../../../services/axiosInstance';
import { toast } from 'react-toastify';
const WeeklyPlanModal = ({ open, onClose, onSave, initialDate, initialPlan }) => {
    const pad = (n) => String(n).padStart(2, '0');
    const formatDateLocal = (d) => {
        const dt = !d ? new Date() : (typeof d === 'string' ? new Date(d) : (d instanceof Date ? d : new Date()));
        if (Number.isNaN(dt.getTime())) {
            const now = new Date();
            return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        }
        return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
    };

    const makeInitialForm = (date, plan) => {
        if (plan) {
            const start = plan.startDate ? new Date(plan.startDate) : null;
            const datePart = start ? formatDateLocal(start) : formatDateLocal(date);
            const timePart = start ? start.toTimeString().slice(0, 5) : '00:00';
            return {
                title: plan.title || '',
                startDate: datePart,
                dueDate: timePart,
                category: plan.category || 'Work',
                priority: plan.priority === 'HIGH' ? 'High' : plan.priority === 'LOW' ? 'Low' : 'Medium',
                status: plan.status === 'DONE' ? 'Done' : plan.status === 'IN_PROGRESS' ? 'In Progress' : 'To Do',
                description: plan.description || '',
            };
        }

        return {
            title: '',
            startDate: formatDateLocal(date),
            dueDate: '00:00',
            category: 'Work',
            priority: 'Medium',
            status: 'To Do',
            description: '',
        };
    };

    const [formData, setFormData] = useState(() => makeInitialForm(initialDate, initialPlan));

    // When modal opens or initialDate changes, prefill the form startDate
    useEffect(() => {
        if (open) {
            setFormData(makeInitialForm(initialDate, initialPlan));
        }
    }, [open, initialDate, initialPlan]);

    const dateRef = useRef(null);
    const timeRef = useRef(null);

    const resetForm = () => setFormData(makeInitialForm());

    const closeAndReset = () => {
        resetForm();
        if (onClose) onClose();
    };

    if (!open) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        // Build payload and POST to weekly-plans
        try {
            const datePart = formData.startDate;
            const timePart = formData.dueDate || '00:00';
            let start = null;
            if (datePart) {
                const [y, m, d] = datePart.split('-').map((v) => Number(v));
                const [hh, mm] = (timePart || '00:00').split(':').map((v) => Number(v));
                // construct local Date from components to avoid timezone parse issues
                start = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0);
            }
            // For weekly plans, set dueDate to 6 days after start (end of week)
            const due = start ? new Date(start) : null;
            if (due) due.setDate(due.getDate() + 6);

            const payload = {
                title: formData.title,
                description: formData.description,
                startDate: start ? start.toISOString() : undefined,
                dueDate: due ? due.toISOString() : undefined,
                category:
                    formData.category === 'Work'
                        ? 'WORK'
                        : formData.category === 'Personal'
                            ? 'PERSONAL'
                            : formData.category === 'Health' || formData.category === 'Health'
                                ? 'HEALTH'
                                : (formData.category || '').toUpperCase(),
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
                                : (formData.status || '').toUpperCase(),
            };

            let res;
            if (initialPlan && (initialPlan.id || initialPlan._id)) {
                // edit mode
                res = await axiosInstance.put(`/api/v1/weekly-plans/${initialPlan.id ?? initialPlan._id}`, payload);
                const message = res?.data?.message || 'Weekly plan updated';
                toast.success(message);
                const updated = res?.data?.data || res?.data || payload;
                if (onSave) onSave(updated);
            } else {
                // create mode
                res = await axiosInstance.post('/api/v1/weekly-plans', payload);
                const message = res?.data?.message;
                if (message) toast.success(message);
                else toast.success('Weekly plan created successfully');
                const created = res?.data?.data || res?.data || payload;
                if (onSave) onSave(created);
            }
            closeAndReset();
        } catch (err) {
            console.error('WeeklyPlanModal save error', err);
            const msg = err?.response?.data?.message || err.message || 'Failed to create weekly plan';
            toast.error(msg);
        }
    };

    return (
        <div
            onClick={closeAndReset}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#121111CC] p-4"
        >
            <style>{`input[type="date"]::-webkit-calendar-picker-indicator, input[type="time"]::-webkit-calendar-picker-indicator { display: none; -webkit-appearance: none; }`}</style>
            {/* Modal */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-xl bg-white dark:bg-zinc-800 shadow-lg"
            >
                {/* HEADER */}
                <div className="sticky top-0 z-10 flex items-center justify-between bg-white dark:bg-zinc-800 p-5 rounded-xl">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{initialPlan ? 'Edit Plan' : 'New Plan'}</h2>
                    <button onClick={closeAndReset} className="text-gray-600 dark:text-gray-200">
                        <X size={24} />
                    </button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto p-5 border-t border-[#949ea3] dark:border-gray-700">
                    {/* Title */}
                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g., Deep Work"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 bg-[#F8FBFE] dark:bg-zinc-800 px-4 py-2 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none dark:text-gray-300"
                        />
                    </div>

                    {/* Dates */}
                    <div className="mb-6 grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Start Date
                            </label>
                            <div className="relative">
                                <input
                                    ref={dateRef}
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 bg-[#F8FBFE] dark:text-gray-400 dark:bg-zinc-800 px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none placeholder-gray-400 dark:placeholder-gray-100"
                                />
                                <button
                                    type="button"
                                    onClick={() => dateRef.current?.showPicker?.() || dateRef.current?.focus()}
                                    className="absolute right-3 top-2.5 text-gray-400"
                                >
                                    <Calendar size={18} />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Due Date
                            </label>
                            <div className="relative">
                                <input
                                    ref={timeRef}
                                    type="time"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 bg-[#F8FBFE] dark:text-gray-400 dark:bg-zinc-800 px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => timeRef.current?.showPicker?.() || timeRef.current?.focus()}
                                    className="absolute right-3 top-2.5 text-gray-400"
                                >
                                    <Clock size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Category & Priority */}
                    <div className="mb-6 grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
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
                                className="w-full rounded-md border border-gray-300 bg-[#F8FBFE] dark:bg-zinc-800 px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none dark:text-gray-400"
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
                    <div>
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

                {/* FOOTER */}
                <div className="sticky bottom-0 bg-white dark:bg-zinc-800 px-5 pb-5.5 rounded-xl">
                    <div className="flex gap-4">
                        <button
                            onClick={closeAndReset}
                            className="flex-1 rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 dark:text-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 rounded-md px-4 py-2 font-medium text-white bg-[#7C3AED]"
                        >
                            {initialPlan ? 'Update Plan' : 'Save Plan'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WeeklyPlanModal