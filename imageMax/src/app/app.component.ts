import { Component } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpEventType } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { preview } from '../preview';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  uploadedImage: File;
  imagePreviews:  preview []=[];
  fd = new FormData();

  constructor(  ) {}


/*   upload() {         // this should moved to service class

    
   /* this.http.post("http://localhost:3000/api/setimg", this.fd)
    .map(res => res.json())
    .subscribe( result => {
      console.log("from server ok"+result.path)
    });
  } */
}
