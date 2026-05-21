import { io } from 'socket.io-client';

const rawSocketUrl = import.meta.env.VITE_SOCKET_URL;
const rawApiUrl = import.meta.env.VITE_API_URL;
const defaultSocketUrl = 'http://localhost:5000';

const socketUrl = rawSocketUrl ||
  (rawApiUrl ? rawApiUrl.replace(/\/api\/?$/, '') : null) ||
  defaultSocketUrl;

const socket = io(socketUrl, {
  transports: ['websocket', 'polling'],
  withCredentials: true
});

export default socket;