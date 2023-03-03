import { Component } from '@angular/core';
import { AxiosService, GetOptions } from "src/services/axios/axios.service"
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from 'src/services/socket/socket.service';


export interface Channel {
  name: string,
  id: string
}

@Component({
  selector: 'app-guilds-list',
  templateUrl: './guilds-list.component.html',
  styleUrls: ['./guilds-list.component.css']
})

export class GuildsListComponent {
  private axiosService: AxiosService;
  private socketService: SocketService;

  channels: Channel[] = [];
  currentChannel: Channel | null = null;
  gotCurrentChannel: boolean = false;

  constructor(socketService: SocketService, axiosService: AxiosService) {
    this.axiosService = axiosService;
    this.socketService = socketService;

    this.getChannels();
    this.getCurrentChannel();

    this.socketService.botChangeChannel$.subscribe((id: string) => {
      this.currentChannel = this.getChannelById(id);
    })
  }

  getChannels() {
    var options: GetOptions = {
      url: "/channels"
    }
    this.axiosService.get(options)
      .then((res: any) => {
        res.map((c: Channel) => {
          this.channels.push(c)
        })
      })
      .catch((err) => {
        console.log(err);
      })
  }

  getCurrentChannel() {
    var options: GetOptions = {
      url: "/currentChannel"
    }
    this.axiosService.get(options)
      .then((res: any) => {
        this.currentChannel = res;
        this.gotCurrentChannel = true;
      })
      .catch((err) => {
        console.log(err);
      })
  }

  getChannelById(id: string): Channel | null {
    for (let index = 0; index < this.channels.length; index++) {
      const element = this.channels[index];
      if (element.id === id) return element;
    } return null;
  }

  channelClick(id: string) {
    this.socketService.joinChannel(id);
    this.currentChannel = this.getChannelById(id);
  }

  leaveChannel() {
    this.socketService.leaveChannel();
    this.currentChannel = null;
  }
}

