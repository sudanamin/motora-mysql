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
import { car } from '../../car';
import { DataService } from '../data.service'
/* import { Form } from '@angular/forms'; */



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
  bigImagePreviews: preview[] = [];
  carList: car[] = [];
  selectedCar: car;
  toggleForm: boolean = false;
  firstTime: boolean = false;
  addForm: any;

  // array of all items to be paged
  private allItems: any[];

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];
  //fd:FormData[] = [];
  fd = new FormData();


  constructor(public sanitizer: DomSanitizer,
    private ng2ImgMax: Ng2ImgMaxService,
    private http: HttpClient,
    private dataService: DataService
  ) { }

  dropzoneState($event: boolean) {
    this.dropzoneActive = $event;
  }

  removeImage(imageName: string) {
    for (let i = 0; i < this.bigImagePreviews.length; i++) {
      if (this.bigImagePreviews[i].name === imageName) {
        this.bigImagePreviews.splice(i, 1);
        break;
      }
    }

  }

  ngOnInit() {
    this.getCars();
  }

  getCars() {
    this.dataService.getCars()
      .subscribe(cars => {
        this.carList = cars;
        this.allItems = cars;


        // initialize to page 1
        /* if(this.firstTime == false )this.setPage(1);
         this.firstTime = true;*/

      })
  }

  EditCar(EditFrm) {
    console.log('car id is :' + this.selectedCar.car_id);
    let editCar: car = {
      car_id: this.selectedCar.car_id,
      model: EditFrm.value.carmodel,
      color: EditFrm.value.carcolor
    }

    this.dataService.updateCar(editCar)
      .subscribe(result => {
        console.log('original Item to be updated:' + result);
        this.getCars();
      });

    this.toggleForm = !this.toggleForm;
  }

  showEditForm(car) {
    window.scrollTo(0, 0);
    this.selectedCar = car;
    this.toggleForm = !this.toggleForm;

  }

  deleteCar(car) {
    console.log('car id is : ' + car.car_id);
    this.dataService.deleteCar(car.car_id)
      .subscribe(data => {
        console.log(data);
        if (data) {
          for (var i = 0; i < this.carList.length; i++) {
            if (car.car_id == this.carList[i].car_id) {

              this.carList.splice(i, 1);
              console.log('on is deleted ');
            }
          }
        }
      })
  }

  onImageChange(event) {

    var files = event.target.files;
    this.resizeFiles(files);
  }

  handleDrop(fileList: FileList) {

    this.resizeFiles(fileList);
  }

  addCar(frm) {
    this.addForm = frm;
    this.upload();
    let newCar: car = {
      model: frm.value.carModel,
      color: frm.value.carColor
    }

    this.dataService.addCar(newCar)
      .subscribe(car => {
        console.log("car is :" + JSON.stringify(car));
        if (frm.valid) {
          console.log("Form Submitted!");

        }
        this.getCars();
      })
  }

  resizeFiles(files: FileList) {
    for (var i = 0; i < files.length; i++) {
      let image = files[i];
      this.fd.append('image', image, image.name);
      this.getbigImagePreview(image);
      this.ng2ImgMax.resizeImage(image, 100, 10000).subscribe(
        result => {
          this.uploadedImage = new File([result], "thumb_" + result.name);



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
      this.imagePreviews.push({ url: reader.result, name: file.name, size: file.size });

    };
  }

  getbigImagePreview(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.bigImagePreviews.push({ url: reader.result, name: file.name, size: file.size });

    };
  }


  upload() {         // this should moved to service class
    if (this.fd.has("image")) {
      console.log('form data is :' + this.fd);
      this.http.post("http://localhost:3000/api/setimg", this.fd, {
        reportProgress: true,
        observe: 'events'
      })
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(event.loaded / event.total * 100);
            console.log("welcome");
            //if(event.loaded. === HttpEventType.)

            console.log('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + '%')
          }
          else if (event.type === HttpEventType.Response) {
            if (event.statusText == 'OK') {
              this.addForm.reset();
              this.imagePreviews = [];
              this.bigImagePreviews = [];
              this.fd.delete("image");
              this.uploadProgress = 0;
              alert("added successfully");
              console.log("event is:" + event.statusText);

            }


          }
        }
        );

    }

  }
}