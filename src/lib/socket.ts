import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    // O Socket.io liga-se à raiz do backend (porta 5000), não ao /api
    socket = io('http://localhost:5000', {
      autoConnect: false, // Só conecta quando pedirmos
    });
  }
  return socket;
};