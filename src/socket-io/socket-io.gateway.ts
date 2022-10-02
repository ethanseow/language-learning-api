import { 
    SubscribeMessage, 
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    ConnectedSocket,
    MessageBody
} from '@nestjs/websockets';
import { Response } from 'express'
import {Res} from '@nestjs/common'
import { Server,Socket } from 'socket.io';
import { socketRoutes,testData } from '../utils'

// find way to globalize all data being sent from client and backend and the types of the data being sent
@WebSocketGateway(80, {namespace: 'chat',cookie:true,cors:{origin:{global}}})
export class SocketIoGateway implements OnGatewayConnection{
    @WebSocketServer()
    server:Server;
    allRooms = new Set([]);
    vacantRooms = [];
    handleConnection(client: Socket): void {
        console.log('connection is succesful')
    }
    @SubscribeMessage(socketRoutes.joinRoom)
    handleJoinRoom(@MessageBody() data:string, @ConnectedSocket() client : Socket, @Res({passthrough:true}) response : Response): string{
        const currentRoom = [...client.rooms.keys()][0]
        client.leave(currentRoom)
        if(this.vacantRooms.length == 0){
            let roomId = "-1"
            do{
                roomId = ""+Math.ceil(Math.random() * 10000)
            }while(this.allRooms.has(roomId));
            this.vacantRooms = [roomId,...(this.vacantRooms)]
            this.allRooms.add(roomId)
            client.join(roomId)
            console.log(response)
            return roomId
        }else{
            const roomId = this.vacantRooms[0]
            this.vacantRooms = this.vacantRooms.slice(1,-1)
            client.join(roomId)
            return roomId
        }
    }

    @SubscribeMessage(socketRoutes.sendTestData)
    handleSendTestData(@MessageBody() data:testData, @ConnectedSocket() client : Socket): void{
        const currentRoom = [...client.rooms.keys()][0]
        console.log(currentRoom)
        this.server.to(currentRoom).emit(socketRoutes.sendTestData,data)
    }

}
