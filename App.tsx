import React, { useState } from 'react';
import { Header } from './components/Header';
import { ChatPanel } from './components/ChatPanel';
import { StatusDashboard } from './components/StatusDashboard';
import { FileUpload } from './components/FileUpload';
import { ReportView } from './components/ReportView';
import { useSimulationAgent } from './hooks/useSimulationAgent';
import { ApprovalModal } from './components/ApprovalModal';
import { ModeSelector } from './components/ModeSelector';
import { ModelViewport } from './components/ModelViewport';

export default function App(): JSX.Element {
  const {
    state,
    startSimulation,
    handleUserMessage,
    handleApprove,
    handleReject,
    resetSimulation,
  } = useSimulationAgent();

  const {
    hasStarted,
    isRunning,
    steps,
    messages,
    approvalRequest,
    finalReport,
    error,
    isAgentWaitingForInput,
    geometryFile,
  } = state;

  const [modeSelected, setModeSelected] = useState(false);

  const handleModeSelect = () => {
    setModeSelected(true);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to start over? Any current progress will be lost.')) {
      resetSimulation();
      setModeSelected(false);
    }
  };

  const renderContent = () => {
    if (finalReport) {
      return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 animate-fade-in z-30">
          <ReportView report={finalReport} />
        </div>
      );
    }
    
    if (error) {
      return (
         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 animate-fade-in z-30">
            <div className="bg-red-900 border border-red-600 text-white p-6 rounded-lg shadow-lg max-w-2xl w-full text-center pointer-events-auto">
              <h2 className="text-2xl font-bold mb-2">Simulation Error</h2>
              <p className="text-red-200">{error}</p>
            </div>
          </div>
      )
    }

    if (hasStarted) {
      return (
        <div className="flex h-full w-full">
            <div className="w-1/3 flex flex-col min-w-[350px]">
                <ChatPanel
                    messages={messages}
                    isAgentWaiting={isAgentWaitingForInput}
                    onSendMessage={handleUserMessage}
                />
            </div>
             <div className="flex-1 flex flex-col p-4 space-y-4">
               <ModelViewport geometryFile={geometryFile} />
               <StatusDashboard steps={steps} />
            </div>
        </div>
      );
    }
    
    // Before simulation starts
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        {!modeSelected ? (
          <ModeSelector onModeSelect={handleModeSelect} />
        ) : (
          <FileUpload onStart={startSimulation} isRunning={isRunning} />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header onReset={handleReset} showReset={hasStarted} />
      <main className="flex-1 overflow-hidden relative bg-gray-900">
        
        {renderContent()}

        {approvalRequest && (
          <ApprovalModal
            request={approvalRequest}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </main>
    </div>
  );
}
