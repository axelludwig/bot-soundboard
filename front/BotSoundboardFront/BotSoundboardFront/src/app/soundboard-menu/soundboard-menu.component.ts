import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { AxiosService, GetOptions } from "src/services/axios/axios.service"
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from 'src/services/socket/socket.service';

@Component({
  selector: 'app-soundboard-menu',
  templateUrl: './soundboard-menu.component.html',
  styleUrls: ['./soundboard-menu.component.css']
})
export class SoundboardMenuComponent {
  @Input() newSound: string | null = null;

  private axiosService: AxiosService;
  private socketService: SocketService;

  sounds: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (this.newSound !== "" && this.newSound !== null && changes['newSound']) {
      this.sounds.push(changes['newSound'].currentValue);
    }
  }

  constructor(socketService: SocketService, axiosService: AxiosService) {    
    this.axiosService = axiosService;
    this.socketService = socketService;
    this.getSounds();
  }

  getSounds() {
    var options: GetOptions = {
      url: "/sounds"
    }
    this.axiosService.get(options)
      .then((res: any) => {
        this.sounds = res;
        console.log(this.sounds);

      })
      .catch((err) => {
        console.log(err);
      })
  }

  soundClicked(sound: string) {
    this.socketService.playSound(sound);
  }
}
