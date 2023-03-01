import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';  

@Injectable({
	providedIn: 'root'
})
export class SocketService {
	constructor(private socket: Socket) { }

	// emit event
	test() {
		this.socket.emit('test');
		console.log('ok super');		
	} 

	// listen event
	onRestest() {
		return this.socket.fromEvent('restest');
		
	}
}