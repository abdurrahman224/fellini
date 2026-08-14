


// import { useState, useEffect } from 'react';
// import {
//   ShieldCheck,
//   X,
//   Battery,
//   Users,
//   BrainCircuit,
//   Coffee,
//   Sun,
//   Sparkles,
//   CheckCircle2
// } from 'lucide-react';
// import axiosInstance from '../../services/axiosInstance';
// import { toast } from 'react-toastify';

// const CHECKLIST = [
//   'Keeping top 2 priorities',
//   'Deferring non-urgent tasks',
//   'Breaking tasks into smaller steps',
//   'Adjusting focus blocks',
// ];

// const ResetMyDayModal = ({ open, onClose, onSuccess }) => {
//   const [step, setStep] = useState(0); // 0=reason, 1=processing, 2=success
//   const [selectedReason, setSelectedReason] = useState(null);
//   const [progress, setProgress] = useState(0);
//   const [successMessage, setSuccessMessage] = useState('');

//   useEffect(() => {
//     if (!open) return;
//     setStep(0);
//     setSelectedReason(null);
//     setProgress(0);
//     setSuccessMessage('');
//   }, [open]);

//   const startProcessing = async (reason) => {
//     setStep(1);

//     // Animate progress
//     CHECKLIST.forEach((_, i) => {
//       setTimeout(() => {
//         setProgress(i + 1);
//       }, (i + 1) * 700);
//     });

//     try {
//       // Map frontend reason to backend format
//       const reasonMap = {
//         'energy': 'LOW_ENERGY',
//         'meetings': 'UNEXPECTED_MEETINGS',
//         'focus': 'LOST_FOCUS',
//         'personal': 'PERSONAL_STUFF',
//         'day': 'JUST_ONE_OF_THOSE_DAYS',
//         'OTHER': 'OTHER'
//       };

//       const response = await axiosInstance.post('/api/v1/daily-plans/reset', {
//         reason: reasonMap[reason] || 'OTHER'
//       });

//       // Wait for animation to complete
//       setTimeout(() => {
//         const message = response?.data?.message || 'Your day has been reset successfully!';
//         setSuccessMessage(message);
//         toast.success(message);
//         setStep(2);
//         // Call onSuccess callback to refresh data
//         if (onSuccess) onSuccess();
//       }, CHECKLIST.length * 700 + 700);

//     } catch (error) {
//       console.error('Reset day error:', error);
//       const errorMsg = error?.response?.data?.message || 'Failed to reset day';
//       toast.error(errorMsg);
//       setTimeout(() => {
//         onClose();
//       }, 1000);
//     }
//   };

//   if (!open) return null;

//   const reasons = [
//     { id: 'energy', label: 'Low energy', icon: Battery },
//     { id: 'meetings', label: 'Unexpected meetings', icon: Users },
//     { id: 'focus', label: 'Lost focus / procrastinated', icon: BrainCircuit },
//     { id: 'personal', label: 'Personal stuff', icon: Coffee },
//     { id: 'day', label: 'Just one of those days', icon: Sun },
//   ];

//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
//       <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl">

//         {/* HEADER */}
//         <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300">
//           <div className="flex items-center gap-2 text-violet-600">
//             <ShieldCheck className="w-5 h-5" />
//             <span className="text-base font-semibold uppercase tracking-wide">
//               Trust Engine
//             </span>
//           </div>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <X />
//           </button>
//         </div>

//         <div className="p-6">

//           {/* STEP 1 — REASON */}
//           {step === 0 && (
//             <div className="space-y-6">
//               <div className="text-center">
//                 <h2 className="text-xl font-bold">Let’s reset your day</h2>
//                 <p className="text-sm text-gray-500 mt-1">
//                   No guilt. Just a smarter plan.
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 {reasons.map(({ id, label, icon: Icon }) => (
//                   <button
//                     key={id}
//                     onClick={() => setSelectedReason(id)}
//                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition
//                       ${selectedReason === id
//                         ? 'border-violet-500 bg-violet-50'
//                         : 'border-gray-200 hover:bg-gray-50'
//                       }`}
//                   >
//                     <Icon className="w-4 h-4" />
//                     <span className="text-sm">{label}</span>
//                   </button>
//                 ))}
//               </div>

//               <div className="flex gap-3 pt-2">
//                 <button
//                   onClick={() => startProcessing('OTHER')}
//                   className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm"
//                 >
//                   Skip
//                 </button>

//                 <button
//                   disabled={!selectedReason}
//                   onClick={() => startProcessing(selectedReason)}
//                   className="flex-[2] py-3 rounded-xl bg-violet-600 text-white text-sm disabled:opacity-50"
//                 >
//                   Reset Schedule
//                 </button>
//               </div>

//               {/* <p className="text-center text-xs text-gray-400 italic">
//                 “Life happened. We’ll adapt.”
//               </p> */}
//             </div>
//           )}

//           {/* STEP 2 — AI TRANSPARENCY */}
//           {step === 1 && (
//             <div className="py-10 space-y-6 text-center">
//               <div className="relative w-14 h-14 mx-auto">
//                 <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
//                 <div className="absolute inset-0 border-4 border-violet-500 rounded-full border-t-transparent animate-spin" />
//                 <Sparkles className="absolute inset-0 m-auto text-violet-500 w-5 h-5" />
//               </div>

//               <div className="space-y-3 text-left max-w-xs mx-auto">
//                 {CHECKLIST.map((item, i) => (
//                   <div
//                     key={item}
//                     className={`flex items-center gap-3 transition ${progress > i ? 'opacity-100' : 'opacity-40'
//                       }`}
//                   >
//                     <CheckCircle2
//                       className={`w-4 h-4 ${progress > i ? 'text-emerald-500' : 'text-gray-300'
//                         }`}
//                     />
//                     <span className="text-sm">{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* STEP 3 — SUCCESS */}
//           {step === 2 && (
//             <div className="space-y-6 text-center">
//               <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
//                 <CheckCircle2 className="w-7 h-7 text-emerald-600" />
//               </div>

//               <div>
//                 <h3 className="font-semibold text-lg">
//                   {successMessage || 'Your day has been reset'}
//                 </h3>
//                 <p className="text-sm text-gray-500 mt-1">
//                   to match reality.
//                 </p>
//               </div>

//               <div className="bg-sky-50 p-4 rounded-xl text-left text-sm">
//                 <p className="font-medium">
//                   Want this lighter plan by default on busy days?
//                 </p>
//               </div>

//               <button
//                 onClick={onClose}
//                 className="w-full py-3 rounded-xl bg-violet-600 text-white"
//               >
//                 View My New Plan
//               </button>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetMyDayModal;





import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  X,
  Battery,
  Users,
  BrainCircuit,
  Coffee,
  Sun,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';
import { toast } from 'react-toastify';

const CHECKLIST = [
  'Keeping top 2 priorities',
  'Deferring non-urgent tasks',
  'Breaking tasks into smaller steps',
  'Adjusting focus blocks',
];

const ResetMyDayModal = ({ open, onClose, onSuccess }) => {
  const [step, setStep] = useState(0); // 0=reason, 1=processing, 2=success
  const [selectedReason, setSelectedReason] = useState(null);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setSelectedReason(null);
    setProgress(0);
    setSuccessMessage('');
  }, [open]);

  const startProcessing = async (reason) => {
    setStep(1);

    // Animate progress
    CHECKLIST.forEach((_, i) => {
      setTimeout(() => {
        setProgress(i + 1);
      }, (i + 1) * 700);
    });

    try {
      // Map frontend reason to backend format
      const reasonMap = {
        'energy': 'LOW_ENERGY',
        'meetings': 'UNEXPECTED_MEETINGS',
        'focus': 'LOST_FOCUS',
        'personal': 'PERSONAL_STUFF',
        'day': 'JUST_ONE_OF_THOSE_DAYS',
        'OTHER': 'OTHER'
      };

      const response = await axiosInstance.post('/api/v1/daily-plans/reset', {
        reason: reasonMap[reason] || 'OTHER'
      });

      // Wait for animation to complete
      setTimeout(() => {
        const message = response?.data?.message || 'Your day has been reset successfully!';
        setSuccessMessage(message);
        toast.success(message);
        setStep(2);
        // Call onSuccess callback to refresh data
        if (onSuccess) onSuccess();
      }, CHECKLIST.length * 700 + 700);

    } catch (error) {
      console.error('Reset day error:', error);
      const errorMsg = error?.response?.data?.message || 'Failed to reset day';
      toast.error(errorMsg);
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  if (!open) return null;

  const reasons = [
    { id: 'energy', label: 'Low energy', icon: Battery },
    { id: 'meetings', label: 'Unexpected meetings', icon: Users },
    { id: 'focus', label: 'Lost focus / procrastinated', icon: BrainCircuit },
    { id: 'personal', label: 'Personal stuff', icon: Coffee },
    { id: 'day', label: 'Just one of those days', icon: Sun },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Added dark:bg-gray-900 and dark:text-gray-100 */}
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl transition-colors duration-200">

        {/* HEADER */}
        {/* Added dark:border-gray-700 */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300 dark:border-gray-700">
          <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-base font-semibold uppercase tracking-wide">
              Trust Engine
            </span>
          </div>
          {/* Added dark:text-gray-400 and dark:hover:text-gray-200 */}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
            <X />
          </button>
        </div>

        <div className="p-6">

          {/* STEP 1 — REASON */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center">
                {/* Added dark:text-white */}
                <h2 className="text-xl font-bold dark:text-white">Let’s reset your day</h2>
                {/* Added dark:text-gray-400 */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  No guilt. Just a smarter plan.
                </p>
              </div>

              <div className="space-y-2">
                {reasons.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedReason(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition
                      ${selectedReason === id
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30 dark:border-violet-500 text-violet-900 dark:text-violet-100'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${selectedReason === id ? 'text-violet-600 dark:text-violet-300' : 'text-gray-500 dark:text-gray-400'}`} />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                {/* Skip Button: Added dark mode classes */}
                <button
                  onClick={() => startProcessing('OTHER')}
                  className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm transition-colors"
                >
                  Skip
                </button>

                {/* Reset Button: Added dark mode classes */}
                <button
                  disabled={!selectedReason}
                  onClick={() => startProcessing(selectedReason)}
                  className="flex-[2] py-3 rounded-xl bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Reset Schedule
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — AI TRANSPARENCY */}
          {step === 1 && (
            <div className="py-10 space-y-6 text-center">
              <div className="relative w-14 h-14 mx-auto">
                {/* Loader dark mode */}
                <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full" />
                <div className="absolute inset-0 border-4 border-violet-500 rounded-full border-t-transparent animate-spin" />
                <Sparkles className="absolute inset-0 m-auto text-violet-500 w-5 h-5" />
              </div>

              <div className="space-y-3 text-left max-w-xs mx-auto">
                {CHECKLIST.map((item, i) => (
                  <div
                    key={item}
                    className={`flex items-center gap-3 transition ${progress > i ? 'opacity-100' : 'opacity-40'
                      }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${progress > i ? 'text-emerald-500' : 'text-gray-300 dark:text-gray-600'
                        }`}
                    />
                    {/* Checklist text dark mode */}
                    <span className="text-sm dark:text-gray-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 — SUCCESS */}
          {step === 2 && (
            <div className="space-y-6 text-center">
              {/* Success icon bg dark mode */}
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>

              <div>
                <h3 className="font-semibold text-lg dark:text-white">
                  {successMessage || 'Your day has been reset'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  to match reality.
                </p>
              </div>

              {/* Info Box dark mode */}
              <div className="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-xl text-left text-sm">
                <p className="font-medium text-sky-900 dark:text-sky-200">
                  Want this lighter plan by default on busy days?
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 text-white transition-colors"
              >
                View My New Plan
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResetMyDayModal;