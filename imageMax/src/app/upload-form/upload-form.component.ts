import { Component } from '@angular/core';
//import { UploadService } from '../upload.service';
//import { Upload } from '../upload';
import * as _ from "lodash";
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

  uploadedImage: File;
  //currentUpload: Upload;
  dropzoneActive: boolean = false;
  imagePreviews: preview[] = [];
  fd = new FormData();


  constructor(public sanitizer: DomSanitizer,
    private ng2ImgMax: Ng2ImgMaxService,
    private http: HttpClient
  ) { }

  dropzoneState($event: boolean) {
    this.dropzoneActive = $event;
  }

  handleDrop(fileList: FileList) {

    let filesIndex = _.range(fileList.length)

    _.each(filesIndex, (idx) => {
      fileList[idx]
      this.ng2ImgMax.resizeImage(fileList[idx], 100, 10000).subscribe(
        result => {
          this.uploadedImage = new File([result], result.name);



          this.getImagePreview(this.uploadedImage);
          this.fd.append('image', this.uploadedImage, this.uploadedImage.name);
          // this.upload();
        },
        error => {
          console.log('😢 Oh no!', error);
        }
      );
      //this.getImagePreview(fileList[idx]);
      //console.log(fileList[idx]);
    }
    );
  }

  getImagePreview(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.imagePreviews.push({ url: reader.result, name: file.name });

    };
  }

  upload() {         // this should moved to service class


    this.http.post("http://localhost:3000/api/setimg", this.fd, {
      reportProgress: true,
      observe: 'events'
    })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          console.log('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + '%')
        }
        else if (event.type === HttpEventType.Response) {
          console.log(event);
        }
      }
  );
    /* .map(res => res.json())
    .subscribe( result => {
      console.log("from server ok"+result.path)
    }); */
  }

}