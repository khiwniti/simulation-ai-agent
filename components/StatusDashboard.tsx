
import React from 'react';
import { SimulationStep, StepStatus } from '../types';

const StatusIcon: React.FC<{ status: StepStatus }> = ({ status }) => {
  switch (status) {
    case StepStatus.COMPLETED:
      return <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div>;
    case StepStatus.IN_PROGRESS:
      return <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse flex items-center justify-center flex-shrink-0"><svg className="animate-spin h-2.5 w-2.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>;
    case StepStatus.FAILED:
      return <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg></div>;
    case StepStatus.REQUIRES_APPROVAL:
       return <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>;
    case StepStatus.PENDING:
    default:
      return <div className="w-4 h-4 border-2 border-gray-500 rounded-full flex-shrink-0"></div>;
  }
};

interface StatusDashboardProps {
  steps: SimulationStep[];
}

export const StatusDashboard: React.FC<StatusDashboardProps> = ({ steps }) => {
  return (
    <div className="w-80 bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl p-4">
      <h3 className="font-bold text-md mb-3 text-white">Workflow Status</h3>
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center text-sm">
            <StatusIcon status={step.status} />
            <div className="ml-3">
              <p className={`font-medium ${step.status !== StepStatus.PENDING ? 'text-gray-200' : 'text-gray-500'}`}>{step.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};