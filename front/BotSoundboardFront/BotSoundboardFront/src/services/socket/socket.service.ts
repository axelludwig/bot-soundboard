import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SocketService {
	private _connect = new Subject<boolean>();
	connect$ = this._connect.asObservable();
	private _disconnect = new Subject<boolean>();
	disconnect$ = this._disconnect.asObservable();

	constructor(private socket: Socket) {
		this.socket.on('connect', () => {
			this.onConnect();

		})

		this.socket.on('disconnect', () => {
			this.onDisconnect();
		})

	}

	// emit event
	test() {
		this.socket.emit('test');
		console.log('ok super');
	}

	// listen event
	onRestest() {
		return this.socket.fromEvent('restest');
	}

	onConnect(): void {
		this._connect.next(true);
	}

	onDisconnect(): void {
		this._disconnect.next(true);
	}
}