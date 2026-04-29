import { WorkflowCode, WorkflowLabel } from "../interfaces";

const CODES = {
  TODO: WorkflowCode.TODO,
  PROGRESS: WorkflowCode.PROGRESS,
  DONE: WorkflowCode.DONE
} as const;

const workflowMap: Record<string, { code: WorkflowCode; label: WorkflowLabel }> = {
  [CODES.TODO]: {
    code: WorkflowCode.TODO,
    label: WorkflowLabel.TODO,
  },
  [CODES.PROGRESS]: {
    code: WorkflowCode.PROGRESS,
    label: WorkflowLabel.PROGRESS,
  },  
  [CODES.DONE]: {
    code: WorkflowCode.DONE,
    label: WorkflowLabel.DONE,
  },
};

export const transformWorkflow = (workflow: WorkflowCode) => {
  return workflowMap[workflow];
};
