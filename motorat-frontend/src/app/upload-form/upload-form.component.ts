import { Component } from '@angular/core';
//import { UploadService } from '../upload.service';
//import { Upload } from '../upload';
//import * as _ from "lodash";
import { preview } from '../../preview';
import { DomSanitizer } from '@angular/platform-browser';
import { Ng2ImgMaxService } from 'ng2-img-max';
//import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpClient, HttpEventType } from '@angular/common/http';


@Component({
  selector: 'upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent {

  uploadProgress: number;
  uploadedImage: File;
  dropzoneActive: boolean = false;
  imagePreviews: preview[] = [];

  //fd:FormData[] = [];
  fd = new FormData();


  constructor(public sanitizer: DomSanitizer,
    private ng2ImgMax: Ng2ImgMaxService,
    private http: HttpClient
  ) { }

  dropzoneState($event: boolean) {
    this.dropzoneActive = $event;
  }

  onImageChange(event) {

    var files = event.target.files;
    this.resizeFiles(files);
  }

  handleDrop(fileList: FileList) {

    this.resizeFiles(fileList);
  }

  resizeFiles(files: FileList) {
    for (var i = 0; i < files.length; i++) {
      let image = files[i];


      this.ng2ImgMax.resizeImage(image, 100, 10000).subscribe(
        result => {
          this.uploadedImage = new File([result], result.name);



          this.getImagePreview(this.uploadedImage);
          //var singleFd = new FormData();
          //singleFd.append('image', this.uploadedImage, this.uploadedImage.name);
          //this.fd.push(singleFd);
          this.fd.append('image', this.uploadedImage, this.uploadedImage.name);
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
      this.imagePreviews.push({ url: reader.result, name: file.name });

    };
  }

  upload() {         // this should moved to service class

console.log('form data is :'+this.fd);
    this.http.post("http://localhost:3000/api/setimg", this.fd, {
      reportProgress: true,
      observe: 'events'
    })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(event.loaded / event.total * 100);
          console.log("welcome");
          console.log('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + '%')
        }
        else if (event.type === HttpEventType.Response) {
          console.log(event);
        }
      }
      );

  }

}