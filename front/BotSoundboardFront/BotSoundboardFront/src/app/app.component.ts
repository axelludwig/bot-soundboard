import { Component } from '@angular/core';
import { SocketService } from 'src/services/socket/socket.service';
import { AxiosService, GetOptions } from "src/services/axios/axios.service"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BotSoundboardFront';

  public socketConnection: boolean = false;

  private axiosService: AxiosService;
  private socketService: SocketService;

  constructor(socketService: SocketService, axiosService: AxiosService) {

    this.axiosService = axiosService;
    this.socketService = socketService;

    // this.socketService.onRestest().subscribe(() => {})
    
    this.socketService.connect$.subscribe(() => {
      this.socketConnection = true;
      console.log('connexion socket super géniale');
    })

    this.socketService.disconnect$.subscribe(() => {
      this.socketConnection = false;
      console.log('déconnexion :( pas super géniale');
    })
  }

  test() {
    this.socketService.test();
  }

  testHttp() {
    var options: GetOptions = {
      url: "http://localhost:3000/",
    }
    this.axiosService.get(options).then((res) => {
      console.log(res);
    })
      .catch((err) => {
        console.log(err);
      })
  }
}
