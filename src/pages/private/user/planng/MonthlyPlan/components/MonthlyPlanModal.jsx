import { Calendar, Clock, X } from 'lucide-react';
import React from 'react'

import { useState, useRef } from 'react';
import axiosInstance from '../../../../../../services/axiosInstance';
import { toast } from 'react-toastify';
const MonthlyPlanModal = ({ open, onClose, onSave, initialDate }) => {
    const getInitialForm = (initDate) => ({
        title: '',
        startDate: (initDate ? new Date(initDate) : new Date()).toISOString().split('T')[0],
        dueDate: '00:00',
        category: 'Work',
        priority: 'Medium',
        status: 'To Do',
        description: '',
    });

    const [formData, setFormData] = useState(() => getInitialForm(initialDate));
    const resetForm = () => setFormData(getInitialForm());

    const dateRef = useRef(null);
    const timeRef = useRef(null);
    const todayStr = new Date().toISOString().split('T')[0];

    if (!open) return null;

    // when modal opens with an initialDate, set formData accordingly
    if (open && initialDate) {
        const dateStr = new Date(initialDate).toISOString().split('T')[0];
        if (formData.startDate !== dateStr) setFormData(prev => ({ ...prev, startDate: dateStr }));
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const datePart = formData.startDate;
            const timePart = formData.dueDate || '00:00';
            const start = datePart ? new Date(`${datePart}T${timePart}:00`) : null;

            // Prevent start date being before today
            if (start) {
                const startOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                const todayOnly = new Date();
                todayOnly.setHours(0, 0, 0, 0);
                if (startOnly < todayOnly) {
                    toast.error('Start date cannot be before today');
                    return;
                }
            }

            // set due date to end of month (23:59:59) to match backend expectation
            let due;
            if (start) {
                due = new Date(start.getFullYear(), start.getMonth() + 1, 0);
                due.setHours(23, 59, 59, 0);
            }

            const payload = {
                title: formData.title,
                description: formData.description,
                startDate: start ? start.toISOString() : undefined,
                dueDate: due ? due.toISOString() : undefined,
                category: (formData.category || 'Work').toUpperCase(),
                priority: formData.priority === 'High' ? 'HIGH' : formData.priority === 'Low' ? 'LOW' : 'MEDIUM',
                status: formData.status === 'Done' ? 'DONE' : formData.status === 'In Progress' ? 'IN_PROGRESS' : 'TODO',
                planType: 'MONTHLY',
                isManuallyCreated: true,
            };

            const res = await axiosInstance.post('/api/v1/monthly-plans', payload);
            const message = res?.data?.message || 'Monthly plan created successfully';
            toast.success(message);
            const created = res?.data?.data || res?.data || payload;
            if (onSave) onSave(created);
            // reset fields then close modal
            resetForm();
            onClose();
        } catch (err) {
            console.error('MonthlyPlanModal save error', err);
            const msg = err?.response?.data?.message || err.message || 'Failed to create monthly plan';
            toast.error(msg);
        }
    };

    return (
        <div
            onClick={() => { resetForm(); onClose(); }}
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
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">New Plan</h2>
                    <button onClick={() => { resetForm(); onClose(); }} className="text-gray-600 dark:text-gray-200">
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
                                    min={todayStr}
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
                                End Date
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
                            onClick={() => { resetForm(); onClose(); }}
                            className="flex-1 rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 dark:text-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 rounded-md px-4 py-2 font-medium text-white bg-[#7C3AED]"
                        >
                            Save Plan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MonthlyPlanModal