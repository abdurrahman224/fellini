import React from 'react';
import { X, Target, Calendar, CheckCircle2, TrendingUp } from 'lucide-react';

// Helper function to parse markdown-like content into structured format
const parseMarkdownContent = (content) => {
    if (!content) return [];
    
    const lines = content.split('\n');
    const sections = [];
    let currentSection = null;
    
    lines.forEach(line => {
        // Main headings (##)
        if (line.startsWith('## ')) {
            if (currentSection) sections.push(currentSection);
            currentSection = {
                title: line.replace('## ', '').trim(),
                content: [],
                type: 'main'
            };
        }
        // Sub headings (**text:**)
        else if (line.includes('**') && line.includes(':')) {
            const match = line.match(/\*\*(.*?)\*\*/);
            if (match && currentSection) {
                currentSection.content.push({
                    type: 'subheading',
                    text: match[1]
                });
            }
        }
        // List items (numbered or bulleted)
        else if (line.match(/^\d+\.\s/) || line.startsWith('- ')) {
            if (currentSection) {
                currentSection.content.push({
                    type: 'list',
                    text: line.replace(/^\d+\.\s|-\s/, '').trim()
                });
            }
        }
        // Regular text
        else if (line.trim()) {
            if (currentSection) {
                currentSection.content.push({
                    type: 'text',
                    text: line.trim()
                });
            }
        }
    });
    
    if (currentSection) sections.push(currentSection);
    return sections;
};

export default function DetailsModal({ open, plan, onClose }) {
    if (!open || !plan) return null;

    const sections = parseMarkdownContent(plan.content);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-6xl max-h-[90vh] rounded-3xl bg-white dark:bg-zinc-800 shadow-2xl overflow-hidden relative flex flex-col" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-10">
                    <X size={28} />
                </button>
                
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 p-8 pr-16">
                    <div className="flex items-center gap-3 mb-3">
                        <Target className="text-white" size={32} />
                        <h2 className="text-3xl font-bold text-white">
                            {plan.title}
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-4 text-white/90 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{plan.monthStartDate ? new Date(plan.monthStartDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} />
                            <span>Progress: {plan.completionRate || 0}%</span>
                        </div>
                        {plan.aiGenerated && (
                            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                                🤖 AI Generated
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="space-y-8">
                        {sections.map((section, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-zinc-700/30 rounded-2xl p-6 border border-gray-200 dark:border-zinc-600">
                                {/* Section Title */}
                                <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                                    {section.title}
                                </h3>
                                
                                {/* Section Content */}
                                <div className="space-y-3">
                                    {section.content.map((item, itemIdx) => (
                                        <div key={itemIdx}>
                                            {item.type === 'subheading' && (
                                                <h4 className="font-bold text-gray-800 dark:text-gray-200 mt-4 mb-2 text-base">
                                                    {item.text}
                                                </h4>
                                            )}
                                            {item.type === 'list' && (
                                                <div className="flex items-start gap-3 ml-4">
                                                    <CheckCircle2 size={16} className="text-purple-500 dark:text-purple-400 mt-1 flex-shrink-0" />
                                                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                                        {item.text}
                                                    </p>
                                                </div>
                                            )}
                                            {item.type === 'text' && !item.text.includes('Monday-Friday') && !item.text.includes('Morning:') && (
                                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed ml-4">
                                                    {item.text}
                                                </p>
                                            )}
                                            {(item.text.includes('Monday-Friday') || item.text.includes('Weekend') || item.text.includes('Morning:')) && (
                                                <div className="ml-4 bg-white dark:bg-zinc-800 p-3 rounded-lg border-l-4 border-purple-400">
                                                    <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                                        {item.text}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50 flex gap-3">
                    <button className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg">
                        Edit Plan
                    </button>
                    <button onClick={onClose} className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-xl transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
