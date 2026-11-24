export const TaskStatus = {
  NotStarted: 0,
  Hold: 1,
  InProgress: 2,
  Done: 3,
  Outdated: 4
} as const;

export const TaskPriority = {
  Low: 0,
  Medium: 1,
  High: 2,
  Urgent: 3
} as const;

// TaskStatus as a type is a value of the TaskStatus "enum" above
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export type Task = {
  status: TaskStatus,
  name: string
  subteam: number,
  priority: TaskPriority,
  part: number,
  qty: number,
  due: Date,
  owner: number,
  id: string
};