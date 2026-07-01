import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: [
      'https://apro-client.onrender.com',
      'https://pageadminapro.onrender.com',
    ],
    credentials: true,
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    console.log('Dashboard connecté :', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Dashboard déconnecté :', client.id);
  }

  envoyerNouvelleDemande(certificat: any) {
    this.server.emit('nouvelle-demande', certificat);
  }
}