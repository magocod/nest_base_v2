import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class MongoConnectionService {
  constructor(@InjectConnection() public connection: Connection) {}

  checkModel<T>(name: string): Model<T> {
    const m: Model<T> | undefined = this.connection.models[name];

    if (m == undefined) {
      throw new Error('Model not found');
    }

    return m;
  }
}
