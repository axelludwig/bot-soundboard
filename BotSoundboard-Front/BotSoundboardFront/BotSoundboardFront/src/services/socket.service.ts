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
	} 

	// listen event
	onTest() {
		return this.socket.fromEvent('test');
	}
}