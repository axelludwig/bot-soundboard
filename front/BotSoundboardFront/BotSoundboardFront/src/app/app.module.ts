import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AxiosService } from 'src/services/axios/axios.service';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, SocketIoModule.forRoot(config)
  ],
  providers: [AxiosService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
