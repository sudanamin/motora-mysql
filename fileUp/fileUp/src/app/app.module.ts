import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
