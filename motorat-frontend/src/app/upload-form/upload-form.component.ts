import { Component } from '@angular/core';
//import { UploadService } from '../upload.service';
//import { Upload } from '../upload';
//import * as _ from "lodash";
import { preview } from '../../preview';
import { fileL } from '../../fileL';
import { DomSanitizer } from '@angular/platform-browser';
import { Ng2ImgMaxService } from 'ng2-img-max';
//import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { car } from '../../car';
import { DataService } from '../data.service'
import { AuthService } from '../core/auth.service';
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
  //carList: car[] = [];
  filesList: fileL[] = [];
  selectedCar: car;
  toggleForm: boolean = false;
  firstTime: boolean = false;
  addForm: any;
  carsObjects = [];
  // array of all items to be paged
  private allItems: any[];

  // pager object
  pager: any = {};

  // paged items
  //pagedItems: any[];
  //fd:FormData[] = [];
  fd = new FormData();

   time = Date.now() + "_";
  constructor(public sanitizer: DomSanitizer,
    private ng2ImgMax: Ng2ImgMaxService,
    private http: HttpClient,
    private dataService: DataService,
    public auth: AuthService,
  ) { }

  dropzoneState($event: boolean) {
    this.dropzoneActive = $event;
  }

  removeImage(imageName: string) {
    

    this.filesList.forEach(name => console.log("before "+name.name));

    //console.log(ent1.entries());
    let x = this.filesList.length;
    for (let i = 0; i < x; i++) {
        if( this.filesList[i].name === (this.time + "thumb_" +imageName) || this.filesList[i].name === (this.time+imageName)){
        this.filesList.splice(i, 1);
        i--;
        x--;
        }
       /*  if (  { 
        this.filesList.splice(i, 1);
        i--;
        x--;
        } */
        //this.filesList.splice(i, 1);
     
       
      }
    

    for (let i = 0; i < this.bigImagePreviews.length; i++) {
      if (this.bigImagePreviews[i].name === imageName) {
        this.bigImagePreviews.splice(i, 1);
        //this.filesList.splice(i, 1);
     
        //break;
      }
    }

    this.filesList.forEach(name => console.log("after"+name.name));

  }

  ngOnInit() {
    this.getCars();
  }

  getCars() {
    this.dataService.getCImages("", "", this.auth.currentUserId)
      .subscribe(cars => {
        //this.carList = cars;
         this.allItems = cars;
         if(this.allItems.length !== 0){
             this.getCarsThumbnail();
         }
         


        // initialize to page 1
        /* if(this.firstTime == false )this.setPage(1);
         this.firstTime = true;*/

      })
  }

  getCarsThumbnail(){


    //  let im=[];
    this.carsObjects = [];
    let gofiForGallery=[] ;
    let gofThumbsForShow= [];
   // var arr = input.split(',');
   //console.log("length;"+this.pagedItems.length);
   for (var i=0 ; i<this.allItems.length; i++){


      var gofi = this.allItems[i].gofi;
      var Gofi = gofi.split(',');
     // console.log(arr[0]);
      for (var j=0 ; j<Gofi.length; j++){

        var thumbForShow = Gofi[j];

        var imgUrl = Gofi[j].replace("_thumb", "");
        var iForGallery = {thumb:thumbForShow ,src:imgUrl, w: 1200, h: 900, title: 'image caption sososo '};
        // this.im.push( this.pagedItems[i].REF_APP_ID,obj);
        gofThumbsForShow.push(thumbForShow);
        gofiForGallery.push(iForGallery);
        // obj=null;

      }

     /*  console.log("gofThumbsForShow lengh:"+gofThumbsForShow[i]);
      console.log("gofiForGallery lengh:"+gofiForGallery[i].src); */
      
      var carObject = {id:this.allItems[i].REF_APP_ID,thums:gofThumbsForShow,images:gofiForGallery,model:this.allItems[i].MODEL};
     this.carsObjects.push(carObject);
     gofiForGallery = [];
     gofThumbsForShow = [];
     //  ims.push({'app_id':this.pagedItems[i]},im);
     //  console.log(ims[0]);
         //this.photoSwipe.openGallery(images,index);
        
        // this.photoSwipe.openGallery(this.pagedItems,index);
  }
 // console.log(this.carsObjects[0].thums);

}

  EditCar(EditFrm) {
    console.log('car id is :' + this.selectedCar.APPLICATION_ID);
    let editCar: car = {
      /* APPLICATION_ID: this.selectedCar.APPLICATION_ID, */
      /* Model: EditFrm.value.carmodel, */
      APPLICATION_ID: this.selectedCar.APPLICATION_ID,
      City:EditFrm.value.carcity,
      Manufacter:EditFrm.value.carmanufacter,
      Model: EditFrm.value.carmodel,
      Price:EditFrm.value.carprice,
      Year:EditFrm.value.caryear,
      Kilometers:EditFrm.value.carkilometers,
      Specs: EditFrm.value.carspecs,
      NoOfCylinders:EditFrm.value.carcylinders,
      Warranty: EditFrm.value.carwarranty,
      Color: EditFrm.value.carcolor,
      Transmission: EditFrm.value.cartransmission,
      ContactNumber: EditFrm.value.carphone,
      DESCRIPTION: EditFrm.value.carDESCRIPTION
    }
    //console.log

   // this.dataService.updateCar(editCar)
   this.dataService.updateCar(editCar.APPLICATION_ID,editFormData)
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
    console.log('car id is : ' + car.id);
    this.dataService.deleteCar(car.id)
      .subscribe(data => {
        console.log(data);
        if (data) {
          for (var i = 0; i < this.carsObjects.length; i++) {
            if (car.id == this.carsObjects[i].id) {

              this.carsObjects.splice(i, 1);
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
    let newCar: car = {
      Model: frm.value.carModel,
      Color: frm.value.carColor
    }
    console.log("form color iss : " + frm.value.carColor);
    console.log("form model iss : " + frm.value.carModel);
    console.log("form carYear iss : " + frm.value.carYear);
    console.log("form carCity iss : " + frm.value.carCity);

    console.log("form carSpecs iss : " + frm.value.carSpecs);
    console.log("form carKilometers iss : " + frm.value.carKilometers);
    console.log("form carPhone iss : " + frm.value.carPhone);
    console.log("form carDESCRTIPTION iss : " + frm.value.carDESCRIPTION);

    console.log("form carPrice iss : " + frm.value.carPrice);
    console.log("form carCylinders iss : " + frm.value.carCylinders);
    console.log("form carTransmission iss : " + frm.value.carTransmission);
    console.log("form carWarranty iss : " + frm.value.carWarranty);

    console.log("form carManufacter iss : " + frm.value.carManufacter);

    if (frm.value.carModel == 'CAMRY')
      this.fd.append('model', '1');
    if (frm.value.carColor == 'WHITE')
      this.fd.append('color', '1');

    this.auth.user.subscribe(user => {
      var userId = user.uid;
      this.fd.append('uid', userId);
      this.upload();
    })
    /*this.fd.append('uid',this.auth.currentUserId);
    this.upload();*/


    /* this.dataService.addCar(newCar)
       .subscribe(car => {
         console.log("car is :" + JSON.stringify(car));
         if (frm.valid) {
           console.log("Form Submitted!");
 
         }
         this.getCars();
       })*/
  }

  resizeFiles(files: FileList) {
    
    for (var i = 0; i < files.length; i++) {
      let image = files[i];
      //this.fd.append('image', image, this.time + image.name);
      this.filesList.push({theFile:image,name:this.time + image.name});

      this.getbigImagePreview(image);
      this.ng2ImgMax.resizeImage(image, 100, 10000).subscribe(
        result => {
          this.uploadedImage = new File([result], this.time + "thumb_" + result.name);



          this.getImagePreview(this.uploadedImage);
          //var singleFd = new FormData();
          //singleFd.append('image', this.uploadedImage, this.uploadedImage.name);
          //this.fd.push(singleFd);

          //this.fd.append('image', this.uploadedImage, this.uploadedImage.name);
          this.filesList.push({theFile:this.uploadedImage,name:this.uploadedImage.name});

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

    for(let i =0 ;i < this.filesList.length ;i++){
      this.fd.append('image',this.filesList[i].theFile,this.filesList[i].name);
      console.log(this.filesList[i].name);
    } 


    if (this.fd.has("color")) {
      console.log('form data is :' + this.fd);

      this.http.post("http://localhost:3000/api/setimg", this.fd, {
        reportProgress: true,
        observe: 'events',
        //[params:string]: newCar.color
      })
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(event.loaded / event.total * 100);
            //console.log("welcome");
            //if(event.loaded. === HttpEventType.)

            console.log('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + '%')
          }
          else if (event.type === HttpEventType.Response) {
            if (event.statusText == 'OK') {
              this.addForm.reset();
              this.imagePreviews = [];
              this.bigImagePreviews = [];
              this.fd.delete("image");
              this.fd.delete("color");
              this.fd.delete("model");
              this.fd.delete("uid");
              this.filesList = [];
              this.uploadProgress = 0;
              alert("added successfully");
              console.log("event is:" + event.statusText);
              this.getCars();

            }


          }
        }
        );

    }

  }
}