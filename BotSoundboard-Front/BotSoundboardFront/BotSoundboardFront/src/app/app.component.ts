import { Component } from '@angular/core';
import { SocketService } from 'src/services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BotSoundboardFront';

  constructor(private socketService: SocketService
  ) {
    this.socketService.onRestest().subscribe(( ) => {
      console.log('super génial');      
    })
  }

  test() {
    this.socketService.test();
  }

  
}
