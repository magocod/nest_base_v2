import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { AudioJob, AudioJobResult, AudioQueueNames } from './audio.constants';
import { Logger } from '@nestjs/common';;
import { Error } from 'mongoose';

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@Processor(AudioQueueNames.example)
export class AudioConsumer extends WorkerHost
  // implements WorkerListener
{
  private readonly logger = new Logger(AudioConsumer.name);

  async process(job: AudioJob): Promise<AudioJobResult> {
    let result = "...";

    switch (job.name) {
      case 'transcode': {
        if (job.data.log) {
          this.logger.debug(`transcode # ${job.id}`);
        }

        await sleep(1000);

        if (job.data.error) {
          throw new Error("example error")
        }

        result = "completed";
        break;
      }
      case 'concatenate': {
        if (job.data.log) {
          this.logger.debug(`concatenate # ${job.id}`);
        }

        await sleep(1000);
        break;
      }
    }

    return result;
  }

  @OnWorkerEvent('completed')
  completed(job: AudioJob, result: any, _prev: string): void {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name} with result ... ${result}`,
    );
  }

  @OnWorkerEvent('failed')
  failed(job: AudioJob | undefined, error: Error, _prev: string): void {
    this.logger.debug(
      `Processing job ${job?.id} of type ${job?.name} with error ${error.message}`,
    );
  }
}