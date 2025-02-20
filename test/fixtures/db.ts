import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class ConnectionService {
  constructor(@InjectConnection() public connection: Connection) {}
}