import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AxiosService } from 'src/services/axios/axios.service';
import { AppComponent } from './app.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButton } from '@angular/material/button';


const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, SocketIoModule.forRoot(config), MatSlideToggleModule
  ],
  providers: [AxiosService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
