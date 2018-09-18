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
import {Utils} from '../../util';
import { DataService } from '../data.service'
import { AuthService } from '../core/auth.service';
/* import { Form } from '@angular/forms'; */
import {Router} from "@angular/router";
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';



@Component({
  selector: 'upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent   {
   

  uploadProgress: number;
  uploadedImage: File;
  dropzoneActive: boolean = false;
  imagePreviews: preview[] = [];
  //EditFormImagePreviews: preview[] = [];
  bigImagePreviews: preview[] = [];
  //carList: car[] = [];
  filesList: fileL[] = [];
  selectedCar: car;
  toggleForm: boolean = false;
  imageNotReady: boolean = false;
  saveOrLoading:string  = 'Save';
  firstTime: boolean = false;
  addForm: any;
  carsObjects : car[]=[];
  // array of all items to be paged
  private allItems: any[];
  toggleLanguage = false;

  // pager object
  pager: any = {};
  cities = ["Abu Dabu","Ajman","Al ain","Dubai","Fujuira","Ras Alkhima","Sharjah","Um Alquiin"];
  specs = ["GCC","AMERICAN","JAPANESE","EUROPE","OTHER"];
  // paged items
  //pagedItems: any[];
  //fd:FormData[] = [];
  fd = new FormData();

  userDisplayName:string;
  userEmail:string;
  /* editFD = new FormData(); */

   time = Date.now() + "_";
  constructor(public sanitizer: DomSanitizer,
    private ng2ImgMax: Ng2ImgMaxService,
    private http: HttpClient,
    private dataService: DataService,
    public auth: AuthService,
    private router: Router,
    private translate: TranslateService) {
      translate.setDefaultLang('en');
      
    }

    switchLanguage(language: string) {
      // <HTMLElement>document.querySelector(".details").Style.cssText = "--my-var: #000";
      Utils.toggleLanguage = !Utils.toggleLanguage;
      this.toggleLanguage = Utils.toggleLanguage;
      if(Utils.toggleLanguage == true)
          this.translate.use('ar');
       else
          this.translate.use('en')
     }

  dropzoneState($event: boolean) {
    this.dropzoneActive = $event;
  }

 
  cancelEditing(){
  this.toggleForm= !this.toggleForm;
  this.filesList = [];
  this.bigImagePreviews = [];
 // this.EditFormImagePreviews = [];

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

  //  this.filesList.forEach(name => console.log("after"+name.name));

  }

  removeImageFromServer(imageName: string) {

    this.dataService.deleteImage(imageName).subscribe(result => {
      for (let i = 0; i < this.selectedCar.Thums.length; i++) {
        if (this.selectedCar.Thums[i] === imageName) {
          this.selectedCar.Thums.splice(i, 1);
          //this.filesList.splice(i, 1);
       
          //break;
        }
      }

      console.log(result);
      this.getCars();

    });

  }

  ngOnInit() {
    this.getCars();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.toggleLanguage = Utils.toggleLanguage;
      // do something
    });
  }

  getCars() {

    this.auth.user.subscribe(user => {

      this.userDisplayName = user.displayName;
      this.userEmail = user.email;
      
    var toSearch = {userID:user.uid};
    var offsetObject =  {'offset': 0};
    Object.assign(toSearch,offsetObject);

    console.log('user id is :'+toSearch.userID)
    this.dataService.getCImages(toSearch)
      .subscribe(cars => {
        //this.carList = cars;
        
         this.allItems = cars.slice(1, cars.length);
         if(this.allItems.length !== 0){
             this.getCarsThumbnail();
         }
         


        // initialize to page 1
        /* if(this.firstTime == false )this.setPage(1);
         this.firstTime = true;*/

      })
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
      if(gofi) var Gofi = gofi.split(',');else Gofi =[];
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
      
      var carObject = {APPLICATION_ID:this.allItems[i].APPLICATION_ID,
        City:Utils.convertIntToCity(this.allItems[i].EMIRATE),
        Manufacturer:this.allItems[i].MANUFACTER, 
        Manufacturer_name:this.allItems[i].MANUFACTURE_NAME, 
        Model:this.allItems[i].MODEL,
        Model_name:this.allItems[i].MODEL_NAME,

        Price:this.allItems[i].PRICE,
        Year:this.allItems[i].YEAR,
         Kilometers: this.allItems[i].MILES, 
         Specs:Utils.convertIntToSpecs(this.allItems[i].SPECS),
        NoOfCylinders:this.allItems[i].CYLINDERS,
        Warranty:Utils.convertIntToWaranty(this.allItems[i].WARANTY),
        Color:Utils.convertIntToColor(this.allItems[i].COLOR),
        Transmission:Utils.convertIntToTransmission(this.allItems[i].TRANSMISSION),
        ContactNumber:this.allItems[i].PHONE,
        Date:this.allItems[i].DDATE,
        DESCRIPTION:this.allItems[i].DETAILS,
        Thums:gofThumbsForShow,Images:gofiForGallery,};
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
    this.addForm = EditFrm;///////////////////////////////////////////////////////////////////////
   // City:EditFrm.value.carcity,
      var city = Utils.convertCitytoInt(EditFrm.value.carcity);
      //this.fd.append('city', city.toString());
    
  /*     let editCar: car = {
      
      APPLICATION_ID: this.selectedCar.APPLICATION_ID,
      City:city,
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
      
      DESCRIPTION: EditFrm.value.carDESCRIPTION,
      
    } */
  this.fd.append("APPLICATION_ID",this.selectedCar.APPLICATION_ID);
    var city = Utils.convertCitytoInt(EditFrm.value.carcity); this.fd.append('city', city.toString());
    this.fd.append('manufacturer', EditFrm.value.carmanufacturer);
    this.fd.append('price', EditFrm.value.carprice);
  /*   let  year = Utils.convertYeartoInt(EditFrm.value.caryear); this.fd.append('year', year.toString()); */
  this.fd.append('year',EditFrm.value.caryear);
    this.fd.append('kilometers', EditFrm.value.carkilometers);
    this.fd.append('model',EditFrm.value.carmodel);
    var specs = Utils.convertSpecsToInt(EditFrm.value.carspecs) ; this.fd.append('specs', specs.toString());
    
    this.fd.append('cylinders', EditFrm.value.carcylinders);

    var waranty = Utils.convertWarantyToInt(EditFrm.value.carwarranty) ; 
    this.fd.append('warranty', waranty.toString());
    console.log("wanary form edit form is :"+waranty);
    var color = Utils.convertColorToInt(EditFrm.value.carcolor) ; 
    console.log("color is :"+color);
    this.fd.append('color', color.toString());

    var transmission = Utils.convertTransmissionToInt(EditFrm.value.cartransmission);
    this.fd.append('transmission', transmission.toString());

    this.fd.append('phone', EditFrm.value.carphone);

    this.fd.append('description', EditFrm.value.cardescription);

    


   this.auth.user.subscribe(user => {
     if (user){
     var userId = user.uid;
     
     this.fd.append('uid', userId);
     this.upload();
     this.filesList = [];
   }
   })
    //console.log

   // this.dataService.updateCar(editCar)
 //  let editFormData;
 /*  this.dataService.updateCar(editCar.APPLICATION_ID,editFormData)
      .subscribe(result => {
        console.log('original Item to be updated:' + result);
        this.getCars();
      });
**/
    this.toggleForm = !this.toggleForm;
    this.bigImagePreviews = [];
    
  }

  showEditForm(car) {
    window.scrollTo(0, 0);
    this.selectedCar = car;
    
    this.toggleForm = !this.toggleForm;
    this.filesList = [];
    this.bigImagePreviews = [];

  }

  deleteCar(car) {
    console.log('car id is : ' + car.APPLICATION_ID);
    this.dataService.deleteCar(car.APPLICATION_ID)
      .subscribe(data => {
        console.log(data);
        if (data) {
          for (var i = 0; i < this.carsObjects.length; i++) {
            if (car.APPLICATION_ID == this.carsObjects[i].APPLICATION_ID) {

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
    /* let newCar: car = {
      Model: frm.value.carModel,
      Color: frm.value.carColor
    } */
    /* console.log("form color iss : " + frm.value.carColor);
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

    console.log("form carManufacter iss : " + frm.value.carManufacter); */

   /*  if (frm.value.carModel == 'CAMRY')
      this.fd.append('model', '1'); */
   /*  if (frm.value.carColor == 'WHITE')
      this.fd.append('color', '1'); */
     
    
     var city = Utils.convertCitytoInt(frm.value.carCity); this.fd.append('city', city.toString());
     this.fd.append('manufacturer', frm.value.carManufacturer);
     this.fd.append('price', frm.value.carPrice);

     let  year =  this.fd.append('year',frm.value.carYear);   

     this.fd.append('kilometers', frm.value.carKilometers);
     this.fd.append('model',frm.value.carModel);
     var specs = Utils.convertSpecsToInt(frm.value.carSpecs) ; this.fd.append('specs', specs.toString());
      
     this.fd.append('cylinders', frm.value.carCylinders);

     var waranty = Utils.convertWarantyToInt(frm.value.carWarranty) ; 
     this.fd.append('warranty', waranty.toString());

     var color = Utils.convertColorToInt(frm.value.carColor) ; 
     this.fd.append('color', color.toString());

     var transmission = Utils.convertTransmissionToInt(frm.value.cartransmission);
    this.fd.append('transmission', transmission.toString());
     this.fd.append('phone', frm.value.carPhone);

     this.fd.append('description', frm.value.carDESCRIPTION);

     


    this.auth.user.subscribe(user => {
      if (user){
      var userId = user.uid;
      
      this.fd.append('uid', userId);
      this.upload();
    }
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
      this.imageNotReady = true;
      this.saveOrLoading = 'loading';
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
          this.imageNotReady = false;
          this.saveOrLoading = 'Save';
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
    /*   if(this.toggleForm) {
        
        this.EditFormImagePreviews.push({ url: reader.result, name: file.name, size: file.size });
      } else  */
      this.imagePreviews.push({ url: reader.result, name: file.name, size: file.size });

    };
  }

  getbigImagePreview(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
     /*  if(this.toggleForm) {
        
       // this.EditFormImagePreviews.push({ url: reader.result, name: file.name, size: file.size });
      } else  */
      this.bigImagePreviews.push({ url: reader.result, name: file.name, size: file.size });

    };
  }


  upload() {         // this should moved to service class

    for(let i =0 ;i < this.filesList.length ;i++){
      this.fd.append('image',this.filesList[i].theFile,this.filesList[i].name);
      console.log(this.filesList[i].name);
    } 

   /*  var url;
    if (this.fd.has("APPLICATION_ID")) {   /////////////////////////// if it has applicaction id this is mean its from edit form
       url = "http://localhost:3000/api/updateCar";
       console.log("its update only");
    } */

    var app_id = '0';
    if (this.fd.has("APPLICATION_ID")) {   /////////////////////////// if it has applicaction id this is mean its from edit form
       app_id= this.selectedCar.APPLICATION_ID;
    }
   // else url =  "http://localhost:3000/api/setimg/0";

      this.http.post("http://localhost:3000/api/setimg/"+app_id, this.fd, {
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

              this.fd.delete("APPLICATION_ID");
              this.fd.delete("image");
              
              this.fd.delete("city");
              this.fd.delete("manufacturer");
              this.fd.delete("model");
              this.fd.delete("price");

              this.fd.delete("year");
              this.fd.delete("kilometers");
              this.fd.delete("specs");
              this.fd.delete("cylinders");

              this.fd.delete("warranty");
              this.fd.delete("color");
              this.fd.delete("transmission");
              this.fd.delete("phone");

              this.fd.delete("description");
              
              this.fd.delete("uid");

              this.filesList = [];
              this.time = Date.now() + "_";
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