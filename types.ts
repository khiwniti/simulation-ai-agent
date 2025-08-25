export enum StepStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REQUIRES_APPROVAL = 'REQUIRES_APPROVAL',
}

export interface SimulationStep {
  id: string;
  name: string;
  status: StepStatus;
  log: string | null;
  agent: string;
}

export interface AgentMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export interface ApprovalRequest {
  stepId: string;
  message: string;
  details: string;
}

export interface SimulationState {
  simulationId: string | null;
  isRunning: boolean;
  hasStarted: boolean;
  currentStepIndex: number;
  steps: SimulationStep[];
  messages: AgentMessage[];
  approvalRequest: ApprovalRequest | null;
  finalReport: string | null;
  geometryFile: File | null;
  error: string | null;
  isAgentWaitingForInput: boolean;
}