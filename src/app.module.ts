import { Module } from '@nestjs/common';
import { SocketIOModule } from './socket-io/socketio.module';
@Module({
  imports: [SocketIOModule],
})
export class AppModule {}
