import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {UploadService} from './upload.service';
import { AppComponent } from './app.component';
import { UpoadFormComponent } from './upoad-form/upoad-form.component';
import { FileDropDirective } from './file-drop.directive';


@NgModule({
  declarations: [
    AppComponent,
    UpoadFormComponent,
    FileDropDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [UploadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
