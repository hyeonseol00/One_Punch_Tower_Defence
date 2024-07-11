import { gameSessions } from './sessions.js';

export const addQue = (socket, id) =>{
    const user = {socket, id}
    gameSessions.push(user);
    return gameSessions.length;
};

//client matchfound socket.emit('user.client')