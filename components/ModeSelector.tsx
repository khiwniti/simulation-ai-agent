
import React from 'react';

const BeginnerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const ExpertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const AIFirstIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

interface ModeCardProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    description: string;
    onClick?: () => void;
    disabled?: boolean;
}

const ModeCard: React.FC<ModeCardProps> = ({ icon, title, subtitle, description, onClick, disabled }) => {
    const baseClasses = "relative group flex flex-col items-center p-6 text-center bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg transition-all duration-300";
    const enabledClasses = "hover:border-blue-500 hover:shadow-blue-500/20 hover:-translate-y-1 cursor-pointer";
    const disabledClasses = "opacity-50 cursor-not-allowed";
    
    return (
        <div onClick={!disabled ? onClick : undefined} className={`${baseClasses} ${disabled ? disabledClasses : enabledClasses}`}>
            {disabled && <span className="absolute top-2 right-2 text-xs font-mono px-2 py-1 bg-gray-600 text-gray-300 rounded">Coming Soon</span>}
            {icon}
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-sm font-semibold text-blue-400 mb-3">{subtitle}</p>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>
    );
};


interface ModeSelectorProps {
  onModeSelect: (mode: 'ai-first') => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ onModeSelect }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-white mb-2">Welcome to EnsumuSpace Unification</h1>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">An AI-powered simulation platform with distinct workflows to match your expertise. Please select a mode to begin your project.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            <ModeCard
                icon={<BeginnerIcon />}
                title="Beginner Mode"
                subtitle="Guided Workflow"
                description="A step-by-step guided experience for setting up simulations. Ideal for new users or standard analyses."
                disabled
            />
             <ModeCard
                icon={<ExpertIcon />}
                title="Expert Mode"
                subtitle="Dashboard-Centric"
                description="A powerful, dashboard-driven environment for managing complex projects and custom workflows."
                disabled
            />
             <ModeCard
                icon={<AIFirstIcon />}
                title="AI-First Mode"
                subtitle="Orchestrated Workflow"
                description="A conversational, AI-orchestrated approach where agents manage the end-to-end simulation lifecycle."
                onClick={() => onModeSelect('ai-first')}
            />
        </div>
    </div>
  );
};