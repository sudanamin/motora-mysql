import { Component } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { DomSanitizer } from '@angular/platform-browser';
import {Http} from '@angular/http';
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

  constructor(
    private ng2ImgMax: Ng2ImgMaxService,
    public sanitizer: DomSanitizer,
    private http:Http
  ) {}

  onImageChange(event) {

    //for(let i=0;i<=event.target.files[].l)
    var files = event.target.files;
    console.log(files.length);

    for(var i=0;i<files.length;i++){
    let image = event.target.files[i];
    

    this.ng2ImgMax.resizeImage(image, 100,10000).subscribe(
      result => {
        this.uploadedImage = new File([result], result.name);
        
        

        this.getImagePreview(this.uploadedImage);
        this.fd.append('image', this.uploadedImage,this.uploadedImage.name);
       // this.upload();
      },
      error => {
        console.log('😢 Oh no!', error);
      }
    );
  }

}

  getImagePreview(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = () => {
      this.imagePreviews.push({url:reader.result,name:file.name});

    };
  }

  upload() {

    
    this.http.post("http://localhost:3000/api/setimg", this.fd)
    .map(res => res.json())
    .subscribe( result => {
      console.log("from server ok"+result.path)
    });
  }
}
