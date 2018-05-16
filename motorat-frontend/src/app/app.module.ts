import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { CarItemComponent } from './car-item/car-item.component';
import { PhotoSwipeComponent } from './photo-swipe/photo-swipe.component';
import { PagerService } from './_services/index';
import { MembersComponent } from './members/members.component';
import { MainComponent } from './main/main.component';
import { routes } from './app.routes';
import { FileDropDirective } from './file-drop.directive';
import { UploadFormComponent } from './upload-form/upload-form.component';
import { Ng2ImgMaxModule } from 'ng2-img-max';
//import { UserLoginComponent } from './users/user-login/user-login.component';
//import { UserProfileComponent } from './users/user-profile/user-profile.component';

import { AuthService } from './core/auth.service';
import { AuthGuard } from './auth.guard';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

var firebaseConfig = {
  apiKey: "AIzaSyAIblq6kLPLBguR_GUkRgzTu8ou219yoLk",
    authDomain: "motorat-a0355.firebaseapp.com",
    databaseURL: "https://motorat-a0355.firebaseio.com",
    projectId: "motorat-a0355",
    storageBucket: "motorat-a0355.appspot.com",
    messagingSenderId: "953142823882"
  }

@NgModule({
  declarations: [
    AppComponent,
    CarItemComponent,
    MembersComponent,
    MainComponent,
    FileDropDirective,
    UploadFormComponent,
    PhotoSwipeComponent,
    //UserProfileComponent,
    SignupComponent,
    ResetPasswordComponent,
    LoginComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    Ng2ImgMaxModule,
    routes,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(firebaseConfig),
  ],
  providers: [
    PagerService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
