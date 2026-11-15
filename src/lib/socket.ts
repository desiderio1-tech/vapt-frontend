import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    // Vai buscar o link da API (Render) e remove o /api para o Socket ligar à raiz
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const socketUrl = apiUrl.replace('/api', ''); 
    
    socket = io(socketUrl, {
      autoConnect: false,
      transports: ['websocket'], // Força o uso de websockets na nuvem
    });
  }
  return socket;
};