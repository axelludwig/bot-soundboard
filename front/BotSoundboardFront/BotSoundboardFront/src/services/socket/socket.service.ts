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

	private _botChangeChannel = new Subject<string>();
	botChangeChannel$ = this._botChangeChannel.asObservable();
	private _userChangeChannel = new Subject<object>();
	userChangeChannel$ = this._userChangeChannel.asObservable();


	constructor(private socket: Socket) {
		this.socket.on('connect', () => {
			this.onConnect();
		})

		this.socket.on('disconnect', () => {
			this.onDisconnect();
		})

		this.socket.on('botChangeChannel', (id: string) => {
			this.onBotChangeChannel(id);
		})

		this.socket.on('userChangeChannel', (res: any) => {
			this.onUserChangeChannel(res);
		})

		// this.socket.on('getChannelsInfosResult', (res: any) => {
		// 	console.log(res);
		// })

	}

	test() {
		this.socket.emit('test');
	}

	onRestest() {
		return this.socket.fromEvent('restest');
	}

	onConnect(): void {
		this._connect.next(true);
	}

	onDisconnect(): void {
		this._disconnect.next(true);
	}

	joinChannel(id: string) {
		this.socket.emit("joinChannel", id);
	}

	leaveChannel() {
		this.socket.emit("leaveChannel");
	}

	playSound(sound: string) {
		this.socket.emit("playSound", sound);
	}

	onBotChangeChannel(id: string) {
		this._botChangeChannel.next(id);
	}

	onUserChangeChannel(res: object) {
		this._userChangeChannel.next(res);
	}
}