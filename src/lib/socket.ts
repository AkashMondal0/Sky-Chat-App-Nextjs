import { io } from 'socket.io-client';
import { localhost } from '../../keys';

const URL = localhost;

export const socket = io(URL);