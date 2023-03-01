import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AxiosService } from 'src/services/axios/axios.service';
import { AppComponent } from './app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [CommonModule,
    BrowserModule, SocketIoModule.forRoot(config), MatSlideToggleModule, MatCheckboxModule, MatButtonModule, BrowserAnimationsModule
  ],
  exports: [],
  providers: [AxiosService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
