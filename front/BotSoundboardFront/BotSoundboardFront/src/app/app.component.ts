import { Component } from '@angular/core';
import { SocketService } from 'src/services/socket/socket.service';
import { AxiosService, GetOptions } from "src/services/axios/axios.service"
import { Params } from '@angular/router';

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

  public filesToUpload: Iterable<File> = [];
  public hasFiles: boolean = false;

  public newSound: string | null = null;

  constructor(socketService: SocketService, axiosService: AxiosService) {

    this.axiosService = axiosService;
    this.socketService = socketService;

    // this.socketService.onRestest().subscribe(() => { })

    this.socketService.connect$.subscribe(() => {
      this.socketConnection = true;
      console.log('connexion socket super géniale');
    })

    this.socketService.disconnect$.subscribe(() => {
      this.socketConnection = false;
      console.log('déconnexion :( pas super géniale');
    })
  }

  onFileSelect(event: any) {
    console.log("file select");
    var files = event.target.files;
    this.filesToUpload = files;
    this.hasFiles = true;
  }

  onFileChange() {
    console.log("onfilechange");
    const inputNode: any = document.querySelector('#file');
    this.filesToUpload = inputNode.files;
    this.hasFiles = true;
  }

  uploadFile() {
    var options: GetOptions = { url: "/sounds" }

    Array.from(this.filesToUpload).forEach(file => {
      var filereader = new FileReader();
      filereader.readAsDataURL(file);
      filereader.onload = (evt) => {
        var base64 = evt.target?.result;
        var params: Params = {
          "data": base64,
          "name": file.name,
          "type": file.type
        }
        options.params = params;
        this.newSound = file.name.replace(/\.[^/.]+$/, "");
        this.axiosService.post(options).then((res) => {
          console.log(res);
          this.hasFiles = false;
          this.filesToUpload = [];
        })
          .catch((err) => {
            console.log(err);
          })
      }
    })
  }

  test() {
    this.socketService.test();
  }

  testHttp() {
    var options: GetOptions = {
      url: "/"
    }
    this.axiosService.get(options).then((res) => {
      console.log(res);
    })
      .catch((err) => {
        console.log(err);
      })
  }

  unpauseSound(){
    this.socketService.unpauseSound();
  }

  pauseSound(){
    this.socketService.pauseSound();
  }
}
