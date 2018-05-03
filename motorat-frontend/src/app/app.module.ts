import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { CarItemComponent } from './car-item/car-item.component';
import { PagerService } from './_services/index';
import { MembersComponent } from './members/members.component';
import { MainComponent } from './main/main.component';
import { routes } from './app.routes';
import { FileDropDirective } from './file-drop.directive';
import { UploadFormComponent } from './upload-form/upload-form.component';
import { Ng2ImgMaxModule } from 'ng2-img-max';



@NgModule({
  declarations: [
    AppComponent,
    CarItemComponent,
    MembersComponent,
    MainComponent,
    FileDropDirective,
    UploadFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    Ng2ImgMaxModule,
    routes
  ],
  providers: [PagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
