import { 
    SubscribeMessage, 
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection
} from '@nestjs/websockets';
import { Server,Socket } from 'socket.io';

type Data = {
    status:Number
    payload:Object
}

// find way to globalize all data being sent from client and backend and the types of the data being sent
@WebSocketGateway(80, {namespace: 'chat', cors:{origin:{global}}})
export class SocketIoGateway implements OnGatewayConnection{
    @WebSocketServer()
    server:Server;
    
    handleConnection(client: Socket): Data {
        return { status: 200, payload: {message:"Connection is successful"}}
    }
}
