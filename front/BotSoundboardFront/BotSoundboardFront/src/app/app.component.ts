import { Component } from '@angular/core';
import { SocketService } from 'src/services/socket/socket.service';
import { AxiosService, GetOptions } from "src/services/axios/axios.service"
import { environment } from '../environments/environment';

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

  filesToUpload: Iterable<File> = [];

  constructor(socketService: SocketService, axiosService: AxiosService) {

    this.axiosService = axiosService;
    this.socketService = socketService;

    this.socketService.onRestest().subscribe(() => {})

    this.socketService.connect$.subscribe(() => {
      this.socketConnection = true;
      console.log('connexion socket super géniale');
    })

    this.socketService.disconnect$.subscribe(() => {
      this.socketConnection = false;
      console.log('déconnexion :( pas super géniale');
    })
  }

  handleFileInput(event: any) {
    var files = event.target.files;
    this.filesToUpload = files;
    // console.log(files);
    // files.map((file: any) => {
    //   console.log(file);

    // })
  }

  uploadFile() {
    var options: GetOptions = {
      url: environment.serverURL + "/images"
    }


    Array.from(this.filesToUpload).forEach(file => {
      console.log(file);

    })
    // this.axiosService.get(options).then((res) => {
    //   console.log(res);
    // })
    //   .catch((err) => {
    //     console.log(err);
    //   })
  }

  test() {
    this.socketService.test();
  }

  testHttp() {
    var options: GetOptions = {
      url: environment.serverURL + "/"
    }
    this.axiosService.get(options).then((res) => {
      console.log(res);
    })
      .catch((err) => {
        console.log(err);
      })
  }
}
