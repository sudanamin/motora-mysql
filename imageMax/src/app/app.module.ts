import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import {HttpModule} from '@angular/http';



import { AppComponent } from './app.component';
import { FileDropDirective } from './file-drop.directive';
import { UploadFormComponent } from './upload-form/upload-form.component';


@NgModule({
  declarations: [
    AppComponent,
    FileDropDirective,
    UploadFormComponent
  ],
  imports: [
    BrowserModule,
    Ng2ImgMaxModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
