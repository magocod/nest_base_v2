import { Job, Queue } from 'bullmq';

export enum AudioQueueNames {
  example = 'example',
}

export interface AudioExampleJobData {
  file: string;
  log: boolean;
  error: boolean;
}

export type AudioJobResult = string;

export type AudioJob = Job<AudioExampleJobData>;

export type AudioExampleQueue = Queue<AudioExampleJobData>;
