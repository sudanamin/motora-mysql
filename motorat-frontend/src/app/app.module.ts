import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { CarItemComponent } from './car-item/car-item.component';
import { PagerService } from './_services/index';



@NgModule({
  declarations: [
    AppComponent,
    CarItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [PagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
