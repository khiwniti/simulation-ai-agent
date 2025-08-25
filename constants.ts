import { SimulationStep, StepStatus } from './types';

export const INITIAL_WORKFLOW_STEPS: SimulationStep[] = [
  {
    id: 'parse_request',
    name: 'Parse User Request',
    agent: 'Supervisor Agent',
    status: StepStatus.PENDING,
    log: null,
  },
  {
    id: 'geometry_analysis',
    name: 'Geometry Analysis & Validation',
    agent: 'GeometrySpecialist',
    status: StepStatus.PENDING,
    log: null,
  },
  {
    id: 'meshing',
    name: 'Mesh Generation',
    agent: 'MeshingAgent',
    status: StepStatus.PENDING,
    log: null,
  },
  {
    id: 'mesh_quality_approval',
    name: 'HITL: Mesh Quality Approval',
    agent: 'Supervisor Agent',
    status: StepStatus.PENDING,
    log: null,
  },
  {
    id: 'solver_setup',
    name: 'Solver Setup',
    agent: 'SolverAgent',
    status: StepStatus.PENDING,
    log: null,
  },
  {
    id: 'run_simulation',
    name: 'Run Simulation',
    agent: 'SolverAgent',
    status: StepStatus.PENDING,
    log: null,
  },
  {
    id: 'analyze_results',
    name: 'Analyze Results',
    agent: 'ResultsAnalyst',
    status: StepStatus.PENDING,
    log: null,
  },
  {
    id: 'generate_report',
    name: 'Generate Report',
    agent: 'ReportWriter',
    status: StepStatus.PENDING,
    log: null,
  },
];