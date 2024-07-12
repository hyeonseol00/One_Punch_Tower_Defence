import { gameSessions } from './sessions.js';

export const addQue = (socket, id) =>{
    const user = {socket, id}
    gameSessions.push(user);
};