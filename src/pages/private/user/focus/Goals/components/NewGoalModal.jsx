import { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Calendar, Target, Edit2, Loader2, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createGoal,
  updateGoal,
  selectCreateGoalLoading,
} from '../../../../../../features/goals/goalsSlice';

const CATEGORIES = ['FITNESS', 'CAREER', 'HEALTH', 'PERSONAL', 'FINANCE', 'EDUCATION', 'OTHER'];

const INPUT_CLS = 'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-violet-900';
const SELECT_CLS = `${INPUT_CLS} appearance-none pr-9`;
const LABEL_CLS = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400';

export default function NewGoalModal({ open, onClose, initial }) {
  const dispatch = useDispatch();
  const createLoading = useSelector(selectCreateGoalLoading);
  const dateRef = useRef(null);

  const isEdit = !!(initial && initial.id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'FITNESS',
    priority: 5,
    targetDate: '',
    isMainFocus: false,
  });

  useEffect(() => {
    if (!open) {
      setFormData({ title: '', description: '', category: 'FITNESS', priority: 5, targetDate: '', isMainFocus: false });
    }
  }, [open]);

  useEffect(() => {
    if (open && initial) {
      setFormData({
        title: initial.title || '',
        description: initial.description || '',
        category: initial.category || 'FITNESS',
        priority: initial.priority ?? 5,
        targetDate: initial.targetDate ? initial.targetDate.split('T')[0] : '',
        isMainFocus: initial.isMainFocus || false,
      });
    }
  }, [open, initial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return;
    const payload = { ...formData, priority: Number(formData.priority) };

    if (isEdit) {
      await dispatch(updateGoal({ goalId: initial.id, data: payload }));
    } else {
      await dispatch(createGoal(payload));
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 animate-fade-in">
      <div onClick={(e) => e.stopPropagation()} className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-zinc-800 animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-gray-100 bg-white px-6 py-5 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isEdit ? 'bg-violet-100 dark:bg-violet-900/40' : 'bg-emerald-100 dark:bg-emerald-900/40'}`}>
              {isEdit ? <Edit2 size={18} className="text-violet-600 dark:text-violet-400" /> : <Target size={18} className="text-emerald-600 dark:text-emerald-400" />}
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{isEdit ? 'Edit Goal' : 'New Goal'}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-700"><X size={20} /></button>
        </div>

        {/* Form */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 md:p-6">
          <div>
            <label className={LABEL_CLS}>Goal Title</label>
            <input type="text" name="title" placeholder="e.g. Get fit and healthy" value={formData.title} onChange={handleChange} className={INPUT_CLS} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Category</label>
              <div className="relative">
                <select name="category" value={formData.category} onChange={handleChange} className={SELECT_CLS}>
                  {CATEGORIES.map((c) => (<option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className={LABEL_CLS}>Priority (1-10)</label>
              <input type="number" name="priority" min="1" max="10" value={formData.priority} onChange={handleChange} className={INPUT_CLS} />
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>Target Date</label>
            <div className="relative">
              <input ref={dateRef} type="date" name="targetDate" value={formData.targetDate} onChange={handleChange} className={`${INPUT_CLS} pr-10`} />
              {/* <button type="button" onClick={(e) => { e.preventDefault(); dateRef.current?.showPicker ? dateRef.current.showPicker() : dateRef.current?.focus(); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <Calendar size={16} />
              </button> */}
            </div>
          </div>

          <label htmlFor="isMainFocus" className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 transition-colors hover:border-violet-300 hover:bg-violet-50 dark:border-zinc-600 dark:bg-zinc-700 dark:hover:border-violet-700 dark:hover:bg-violet-900/20">
            <input type="checkbox" name="isMainFocus" id="isMainFocus" checked={formData.isMainFocus} onChange={handleChange} className="h-4 w-4 accent-violet-600" />
            <Star size={16} className={formData.isMainFocus ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400'} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Set as main focus goal</span>
          </label>

          <div>
            <label className={LABEL_CLS}>Description</label>
            <textarea name="description" placeholder="Describe your goal in detail..." value={formData.description} onChange={handleChange} rows={3} className={`${INPUT_CLS} resize-none`} />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 rounded-b-2xl border-t border-gray-100 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-600 dark:text-gray-200 dark:hover:bg-zinc-700">Cancel</button>
            <button onClick={handleSave} disabled={createLoading || !formData.title.trim()} className="flex-1 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition-all hover:bg-violet-700 hover:shadow-md active:scale-[0.97] disabled:opacity-50 dark:shadow-none">
              {createLoading ? <><Loader2 size={16} className="inline animate-spin mr-1" />Saving...</> : isEdit ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}