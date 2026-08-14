import React, { useState, useEffect } from 'react';
import { CalendarX, Plus } from 'lucide-react';

export default function PlansSidebar({ monthPlans, loadingPlans, onViewMore, onAddPlan, onGenerateWithAI, generating = false }) {
    const [aiInput, setAiInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [conversationId, setConversationId] = useState(null);

    // Update local generating state when prop changes
    useEffect(() => {
        setIsGenerating(generating);
    }, [generating]);

    const handleGenerate = async () => {
        if (!aiInput.trim() || !onGenerateWithAI) return;
        
        setIsGenerating(true);
        try {
            const result = await onGenerateWithAI(aiInput, conversationId);
            if (result?.success) {
                setAiInput(''); // Clear input on success
                if (result.conversationId) {
                    setConversationId(result.conversationId); // Save conversation ID for follow-up
                }
            }
        } catch (error) {
            console.error('Generation error:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="lg:col-span-4 flex flex-col bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm  ">
            <h3 className="text-[#1C1D21] dark:text-white font-bold text-lg mb-4">This Month's Plan</h3>
            <div className="space-y-4 mb-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                {!loadingPlans && monthPlans.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-300">
                        <CalendarX size={32} className="mb-2 opacity-50" />
                        <p className="text-sm">No plans yet</p>
                    </div>
                ) : (
                    (loadingPlans ? Array.from({ length: 3 }) : monthPlans).map((plan, i) => (
                        <div key={plan?.id || i} className="bg-[#D5C0FF] dark:bg-[#3C3166] p-4 rounded-xl shadow-sm shrink-0">
                            <div className="mb-2">
                                <span className="bg-[#FEFCE8] text-[#CD8A04] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                                    {plan?.aiGenerated ? 'AI Generated' : 'Manual'}
                                </span>
                            </div>
                            <h4 className="text-[#1C1D21] dark:text-white font-bold text-base leading-tight mb-1">
                                {plan?.title || 'Loading...'}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300 text-[11px] mb-2">
                                {plan?.monthStartDate ? `${new Date(plan.monthStartDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : 'Loading date...'}
                            </p>
                            <button onClick={() => onViewMore(plan)} className="text-[#7C3AED] dark:text-[#A78BFA] text-xs font-bold underline decoration-2 underline-offset-2">
                                View more
                            </button>
                        </div>
                    ))
                )}
            </div>
            <button onClick={onAddPlan} className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 mb-6 shrink-0">
                <Plus size={20} /> Add a Task
            </button>
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm shrink-0">
                <h3 className="text-[#1C1D21] dark:text-white font-bold text-base mb-3">Generate with AI</h3>
                <textarea 
                    placeholder="Describe your monthly goal and let AI plan it." 
                    className="w-full h-32 p-3 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-900 resize-none focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]" 
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    disabled={isGenerating}
                />
                <button 
                    onClick={handleGenerate}
                    disabled={!aiInput.trim() || isGenerating}
                    className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-2.5 rounded-lg mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? 'Generating...' : 'Generate'}
                </button>
            </div>
        </div>
    );
}
