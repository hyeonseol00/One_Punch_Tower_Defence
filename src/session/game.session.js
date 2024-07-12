import { gameSessions } from './sessions.js';

export const addQue = (id) =>{
    const user = {id}
    gameSessions.push(user);
};