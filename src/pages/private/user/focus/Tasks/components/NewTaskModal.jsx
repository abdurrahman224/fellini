import { useEffect, useState, useRef } from 'react';
import { Calendar, X, ChevronDown, ListPlus, Edit2, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createTask,
  updateTask,
  selectCreateTaskLoading,
} from '../../../../../../features/tasks/tasksSlice';
import { selectGoals } from '../../../../../../features/goals/goalsSlice';

const CATEGORIES = ['FITNESS', 'CAREER', 'HEALTH', 'PERSONAL', 'FINANCE', 'EDUCATION', 'OTHER'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

const INPUT_CLS = 'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-base focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-violet-900';
const SELECT_CLS = `${INPUT_CLS} appearance-none pr-9`;
const LABEL_CLS = 'mb-1.5 block text-base font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400';

const NewTaskModal = ({ open, onClose, initial }) => {
  const dispatch = useDispatch();
  const createLoading = useSelector(selectCreateTaskLoading);
  const goals = useSelector(selectGoals);
  const dueDateRef = useRef(null);
  const isEdit = !!(initial && initial.id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    category: 'PERSONAL',
    dueDate: '',
    dueTime: '',
    estimatedMinutes: '',
    tags: '',
    notes: '',
    goalId: '',
  });

  useEffect(() => {
    if (!open) {
      setFormData({
        title: '', description: '', priority: 'MEDIUM', category: 'PERSONAL',
        dueDate: '', dueTime: '', estimatedMinutes: '', tags: '', notes: '', goalId: '',
      });
    }
  }, [open]);

  useEffect(() => {
    if (open && initial) {
      setFormData({
        title: initial.title || '',
        description: initial.description || '',
        priority: initial.priority || 'MEDIUM',
        category: initial.category || 'PERSONAL',
        dueDate: initial.dueDate ? initial.dueDate.split('T')[0] : '',
        dueTime: initial.dueTime || '',
        estimatedMinutes: initial.estimatedMinutes || '',
        tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : (initial.tags || ''),
        notes: initial.notes || '',
        goalId: initial.goalId || '',
      });
    }
  }, [open, initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return;

    const payload = {
      title: formData.title,
      description: formData.description || undefined,
      priority: formData.priority,
      category: formData.category,
      dueDate: formData.dueDate || undefined,
      dueTime: formData.dueTime || undefined,
      estimatedMinutes: formData.estimatedMinutes ? Number(formData.estimatedMinutes) : undefined,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      notes: formData.notes || undefined,
      goalId: formData.goalId || undefined,
    };

    if (isEdit) {
      await dispatch(updateTask({ taskId: initial.id, data: payload }));
    } else {
      await dispatch(createTask(payload));
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div onClick={(e) => e.stopPropagation()} className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-zinc-800 animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-gray-100 bg-white px-6 py-5 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isEdit ? 'bg-violet-100 dark:bg-violet-900/40' : 'bg-emerald-100 dark:bg-emerald-900/40'}`}>
              {isEdit ? <Edit2 size={18} className="text-violet-600 dark:text-violet-400" /> : <ListPlus size={18} className="text-emerald-600 dark:text-emerald-400" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{isEdit ? 'Edit Task' : 'New Task'}</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-700"><X size={20} /></button>
        </div>

        {/* Form */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 md:p-6">
          {/* Title */}
          <div>
            <label className={LABEL_CLS}>Title</label>
            <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Buy groceries" className={INPUT_CLS} />
          </div>

          {/* Priority & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Priority</label>
              <div className="relative">
                <select name="priority" value={formData.priority} onChange={handleChange} className={SELECT_CLS}>
                  {PRIORITIES.map((p) => (<option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className={LABEL_CLS}>Category</label>
              <div className="relative">
                <select name="category" value={formData.category} onChange={handleChange} className={SELECT_CLS}>
                  {CATEGORIES.map((c) => (<option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Due Date</label>
              <div className="relative">
                <input ref={dueDateRef} type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className={`${INPUT_CLS} pr-10`} />
                <button type="button" onClick={(e) => { e.preventDefault(); dueDateRef.current?.showPicker ? dueDateRef.current.showPicker() : dueDateRef.current?.focus(); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <Calendar size={16} />
                </button>
              </div>
            </div>
            <div>
              <label className={LABEL_CLS}>Due Time</label>
              <input type="time" name="dueTime" value={formData.dueTime} onChange={handleChange} className={INPUT_CLS} />
            </div>
          </div>

          {/* Estimated Minutes & Link to Goal */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Est. Minutes</label>
              <div className="relative">
                <input type="number" name="estimatedMinutes" value={formData.estimatedMinutes} onChange={handleChange} min="1" placeholder="e.g. 45" className={INPUT_CLS} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base text-gray-400">min</span>
              </div>
            </div>
            <div>
              <label className={LABEL_CLS}>Link to Goal</label>
              <div className="relative">
                <select name="goalId" value={formData.goalId} onChange={handleChange} className={SELECT_CLS}>
                  <option value="">None</option>
                  {(goals || []).map((g) => (<option key={g.id} value={g.id}>{g.title}</option>))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={LABEL_CLS}>Tags</label>
            <input name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g. work, deadline (comma separated)" className={INPUT_CLS} />
          </div>

          {/* Description */}
          <div>
            <label className={LABEL_CLS}>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Add details..." className={`${INPUT_CLS} resize-none`} />
          </div>

          {/* Notes */}
          <div>
            <label className={LABEL_CLS}>Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} placeholder="Personal notes..." className={`${INPUT_CLS} resize-none`} />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 rounded-b-2xl border-t border-gray-100 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-600 dark:text-gray-200 dark:hover:bg-zinc-700">Cancel</button>
            <button onClick={handleSave} disabled={createLoading || !formData.title.trim()} className="flex-1 rounded-xl bg-violet-600 px-4 py-2.5 text-base font-semibold text-white shadow-sm shadow-violet-200 transition-all hover:bg-violet-700 hover:shadow-md active:scale-[0.97] disabled:opacity-50 dark:shadow-none">
              {createLoading ? <><Loader2 size={16} className="inline animate-spin mr-1" />Saving...</> : isEdit ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal;
