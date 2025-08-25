import { useState, useCallback, useRef, useEffect } from 'react';
import { SimulationState, AgentMessage, StepStatus, SimulationStep, ApprovalRequest } from '../types';
import { INITIAL_WORKFLOW_STEPS } from '../constants';

// In-memory mock of the backend state.
// This will persist across re-renders of the component, similar to how a backend database would.
type MockBackendState = {
  _internal_step: number;
  _last_updated: number;
} & Omit<SimulationState, 'geometryFile'>;


const createInitialState = (): SimulationState => ({
    simulationId: null,
    isRunning: false,
    hasStarted: false,
    currentStepIndex: -1,
    steps: INITIAL_WORKFLOW_STEPS.map(step => ({ ...step, status: StepStatus.PENDING, log: null })),
    messages: [],
    approvalRequest: null,
    finalReport: null,
    geometryFile: null,
    error: null,
    isAgentWaitingForInput: false,
});


export const useSimulationAgent = () => {
    const [state, setState] = useState<SimulationState>(createInitialState());
    
    // useRef will hold our "backend" state. It's not re-created on each render.
    const mockBackendState = useRef<MockBackendState | null>(null);
    
    const pollingIntervalRef = useRef<number | null>(null);

    const stopPolling = () => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
    };

    // This function simulates the backend processing step
    const processBackendStep = useCallback(() => {
        if (!mockBackendState.current) return;

        const backendState = mockBackendState.current;
        const now = Date.now();
        const lastUpdated = backendState._last_updated || 0;
        const elapsed = now - lastUpdated;
        let currentStepIndex = backendState._internal_step;

        let stateWasUpdated = false;

        if (backendState.isRunning && !backendState.approvalRequest && elapsed > 2000) {
            if (currentStepIndex < INITIAL_WORKFLOW_STEPS.length) {
                const step = INITIAL_WORKFLOW_STEPS[currentStepIndex];

                if (currentStepIndex > 0) {
                    backendState.steps[currentStepIndex - 1].status = StepStatus.COMPLETED;
                    backendState.messages.push({ id: `${Date.now()}-agent-comp`, sender: 'agent', text: `**${backendState.steps[currentStepIndex - 1].agent}**: Step *${backendState.steps[currentStepIndex - 1].name}* completed successfully.`, timestamp: new Date().toISOString() });
                }

                backendState.steps[currentStepIndex].status = StepStatus.IN_PROGRESS;
                backendState.messages.push({ id: `${Date.now()}-agent-start`, sender: 'agent', text: `**${step.agent}**: Starting step: *${step.name}*...`, timestamp: new Date().toISOString() });

                if (step.id === 'mesh_quality_approval') {
                    backendState.steps[currentStepIndex].status = StepStatus.REQUIRES_APPROVAL;
                    backendState.approvalRequest = {
                        stepId: step.id,
                        message: "The generated mesh has a high skewness ratio in 3% of cells.",
                        details: "Action: Please approve to proceed with the current mesh, or reject to abort the simulation."
                    };
                    backendState.isAgentWaitingForInput = true;
                    backendState.messages.push({ id: `${Date.now()}-agent-approve`, sender: 'agent', text: `**Supervisor Agent**: Mesh quality check requires your approval. Please review the details.`, timestamp: new Date().toISOString() });
                } else {
                    backendState._internal_step = currentStepIndex + 1;
                }
            } else {
                backendState.isRunning = false;
                backendState.finalReport = "The final report content would be generated and sent by the backend here.";
                backendState.messages.push({ id: `${Date.now()}-agent-final`, sender: 'agent', text: `**ReportWriter**: All steps are complete. Generating final report...`, timestamp: new Date().toISOString() });
            }

            backendState._last_updated = now;
            stateWasUpdated = true;
        }
        
        if (stateWasUpdated) {
             // Sync frontend state with backend state
            setState(prevState => ({ ...prevState, ...backendState }));
            if (backendState.finalReport || backendState.error) {
                stopPolling();
            }
        }
    }, []);

    useEffect(() => {
        // Cleanup on unmount
        return () => stopPolling();
    }, []);
    
    const startSimulation = useCallback(async (prompt: string, file: File) => {
        stopPolling(); // Ensure no old pollers are running

        // Simulate API call to start
        const simulationId = `sim_${Date.now()}`;
        const newBackendState: MockBackendState = {
          simulationId,
          isRunning: true,
          hasStarted: true,
          steps: INITIAL_WORKFLOW_STEPS.map(s => ({...s, status: StepStatus.PENDING})),
          messages: [
            { id: `${Date.now()}-user`, sender: 'user', text: prompt, timestamp: new Date().toISOString() },
            { id: `${Date.now()}-agent`, sender: 'agent', text: `**Supervisor Agent**: Received request and geometry file \`${file.name}\`. Starting simulation workflow...`, timestamp: new Date().toISOString() }
          ],
          approvalRequest: null,
          finalReport: null,
          error: null,
          isAgentWaitingForInput: false,
          currentStepIndex: -1,
          _internal_step: 0,
          _last_updated: Date.now()
        };
        mockBackendState.current = newBackendState;

        // Update frontend state
        setState({
            ...newBackendState,
            geometryFile: file,
        });
        
        // Start polling
        pollingIntervalRef.current = window.setInterval(processBackendStep, 2000);

    }, [processBackendStep]);

    const handleUserMessage = useCallback(async (message: string) => {
        setState(prevState => ({ 
            ...prevState, 
            messages: [...prevState.messages, { id: Date.now().toString(), sender: 'user', text: message, timestamp: new Date().toISOString() }],
            isAgentWaitingForInput: false 
        }));
        
        setTimeout(() => {
             setState(prevState => ({ 
                ...prevState, 
                messages: [...prevState.messages, { id: Date.now().toString() + 'agent', sender: 'agent', text: '**Supervisor Agent**: Thank you for your input. I am continuing with the current process as I cannot deviate from the planned workflow at this time.', timestamp: new Date().toISOString() }],
                isAgentWaitingForInput: true
            }));
        }, 1500);

    }, []);

    const handleApprove = useCallback(async () => {
        if (!mockBackendState.current || !mockBackendState.current.approvalRequest) return;
        
        const backendState = mockBackendState.current;
        const stepIndex = backendState.steps.findIndex((s: SimulationStep) => s.id === backendState.approvalRequest!.stepId);

        backendState.steps[stepIndex].status = StepStatus.COMPLETED;
        backendState.steps[stepIndex].log = "User approved mesh quality.";
        backendState.approvalRequest = null;
        backendState.isAgentWaitingForInput = false;
        backendState.messages.push({ id: `${Date.now()}-user`, sender: 'user', text: 'I approve the mesh quality. Please proceed.', timestamp: new Date().toISOString() });
        backendState.messages.push({ id: `${Date.now()}-agent`, sender: 'agent', text: `**Supervisor Agent**: Approval received. Resuming simulation workflow.`, timestamp: new Date().toISOString() });
        backendState._internal_step = stepIndex + 1;
        backendState._last_updated = Date.now();

        setState(prevState => ({...prevState, ...backendState}));

    }, []);
    
    const handleReject = useCallback(async () => {
        if (!mockBackendState.current || !mockBackendState.current.approvalRequest) return;
        
        stopPolling();
        
        const backendState = mockBackendState.current;
        const stepIndex = backendState.steps.findIndex((s: SimulationStep) => s.id === backendState.approvalRequest!.stepId);

        backendState.steps[stepIndex].status = StepStatus.FAILED;
        backendState.steps[stepIndex].log = "User rejected mesh quality.";
        backendState.approvalRequest = null;
        backendState.isRunning = false;
        backendState.isAgentWaitingForInput = false;
        backendState.error = "Simulation aborted by user due to mesh quality concerns.";
        backendState.messages.push({ id: `${Date.now()}-user`, sender: 'user', text: 'I reject this. Abort the simulation.', timestamp: new Date().toISOString() });
        
        setState(prevState => ({...prevState, ...backendState}));
    }, []);

    const resetSimulation = useCallback(() => {
        stopPolling();
        mockBackendState.current = null;
        setState(createInitialState());
    }, []);


    return { state, startSimulation, handleUserMessage, handleApprove, handleReject, resetSimulation };
};
