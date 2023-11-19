export interface ITask {
  id: string;
  title: string;
  description: string;
  status: EnTaskStatus;
}

export enum EnTaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
