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
import { Utils } from '../../util';
import { DataService } from '../data.service'
import { AuthService } from '../core/auth.service';
/* import { Form } from '@angular/forms'; */
import { Router, NavigationStart, NavigationCancel, NavigationEnd } from "@angular/router";
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';



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
  //EditFormImagePreviews: preview[] = [];
  bigImagePreviews: preview[] = [];
  //carList: car[] = [];
  filesList: fileL[] = [];
  selectedCar: car;
  toggleForm: boolean = false;
  imageNotReady: boolean = false;
  saveOrLoading: string = 'Save';
  goOrLoading: string = "GO";
  firstTime: boolean = false;
  addForm: any;
  carsObjects: car[] = [];
  // array of all items to be paged
  private allItems: any[];
  toggleLanguage = false;

  ManufacturersObject = [];
  ModelsObject = [];
  showModel: Boolean = false;

  // pager object
  pager: any = {};
  cities = ["Abu Dabu", "Ajman", "Al ain", "Dubai", "Fujuira", "Ras Alkhima", "Sharjah", "Um Alquiin"];
  specs = ["GCC", "AMERICAN", "JAPANESE", "EUROPE", "OTHER"];
  // paged items
  //pagedItems: any[];
  //fd:FormData[] = [];
  fd = new FormData();

  userDisplayName: string;
  userEmail: string;
  /* editFD = new FormData(); */

  time = Date.now() + "_";
  router: Router;
 // loading;

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  iuploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;
  //fileInput: any;

  constructor(public sanitizer: DomSanitizer,
    private ng2ImgMax: Ng2ImgMaxService,
    private http: HttpClient,
    private dataService: DataService,
    public auth: AuthService,
    private afStorage: AngularFireStorage,
    router: Router,
    private translate: TranslateService) {
    translate.setDefaultLang('en');
    this.router = router;


  }

  switchLanguage() {


    // <HTMLElement>document.querySelector(".details").Style.cssText = "--my-var: #000";
    Utils.toggleLanguage = !Utils.toggleLanguage;
    this.toggleLanguage = Utils.toggleLanguage;
    if (Utils.toggleLanguage == true)
      this.translate.use('ar');
    else
      this.translate.use('en')
  }


  onManufacturersChange(event) {

    console.log('manufatrer chaned' + JSON.stringify(event));

    /*  var x = document.getElementById("noModel");
      x.remove(); */

    if (event != '' && event != 'All') {
      this.showModel = true;
      this.dataService.getModels(event)
        .subscribe(models => { this.ModelsObject = models; });

    }
    else {
      this.showModel = false;
    }
  }

  dropzoneState($event: boolean) {
    this.dropzoneActive = $event;
  }


  cancelEditing() {
    this.toggleForm = !this.toggleForm;
    this.filesList = [];
    this.bigImagePreviews = [];
    // this.EditFormImagePreviews = [];

  }

  removeImage(imageName: string) {


    this.filesList.forEach(name => console.log("before " + name.name));


    let x = this.filesList.length;
    for (let i = 0; i < x; i++) {
      if (this.filesList[i].name === (this.time + "thumb_" + imageName) || this.filesList[i].name === (this.time + imageName)) {
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



  }

  removeImageFromServer(imageName: string, carID) {

    var shortname = imageName.substring(72, imageName.indexOf('?'));
    var noThumb = shortname.replace("_thumb", "");
    console.log('car shortname to delte is ' + shortname + "  888888lognaem " + imageName);


    var desertRef = this.afStorage.ref(shortname);
    var desertRefNoThumb = this.afStorage.ref(noThumb);


    var task = desertRef.delete();
    var taskNoThumb = desertRefNoThumb.delete();
    var th = this;

    task.subscribe(function (progress) {
      console.log('progess :' + JSON.stringify(progress));
      //th.uploadProgress = progress;
    })

    taskNoThumb.subscribe(function (progress) {
      console.log('progess :' + JSON.stringify(progress));
      //th.uploadProgress = progress;
    })




    this.dataService.deleteImage(carID, shortname).subscribe(result => {
      for (let i = 0; i < this.selectedCar.Thums.length; i++) {
        if (this.selectedCar.Thums[i] === imageName) {
          this.selectedCar.Thums.splice(i, 1);
          //this.filesList.splice(i, 1);

          //break;
        }
      }


      // this.getCars();

    });

  }

  deleteCar(car) {
    this.selectedCar = car;

    console.log('car id to delte is ' + car.APPLICATION_ID)


    for (var j = 0; j < car.Thums.length; j++) {

      var imageName = car.Thums[j];
      //var shortname =  imageName.substring(72,imageName.indexOf('?'));
      this.removeImageFromServer(imageName, car.APPLICATION_ID);

    }

    this.dataService.deleteCar(car.APPLICATION_ID)
      .subscribe(data => {

        if (data) {
          for (var i = 0; i < this.carsObjects.length; i++) {
            if (car.APPLICATION_ID == this.carsObjects[i].APPLICATION_ID) {

              this.carsObjects.splice(i, 1);

            }
          }
        }
      })
  }

  ngOnInit() {

    //this.loading = true;

    /*  this.router.events
             .subscribe((event) => {
                 if(event instanceof NavigationStart) {
                     this.loading = true;
                 }
                 else if (
                     event instanceof NavigationEnd || 
                     event instanceof NavigationCancel
                     ) {
                     this.loading = false;
                 }
             }); */

    this.http.get<string>("http://localhost:8080/api/checkenv/").subscribe(res => {
      // alert(JSON.stringify(res));
    })


    this.getCars();

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.toggleLanguage = Utils.toggleLanguage;
      // do something
    });


    this.dataService.getManufacturers()
      .subscribe(manufacturers => {
        this.ManufacturersObject = manufacturers;
        console.log('manucaturers : ' + JSON.stringify(manufacturers));
      });
  }

  getCars() {

    this.auth.user.subscribe(user => {

      this.userDisplayName = user.displayName;
      this.userEmail = user.email;

      var toSearch = { userID: user.uid };
      var offsetObject = { 'offset': 0 };
      Object.assign(toSearch, offsetObject);


      this.dataService.getCImages(toSearch)
        .subscribe(cars => {
          //this.carList = cars;

          this.allItems = cars.slice(1, cars.length);
          if (this.allItems.length !== 0) {
            this.getCarsThumbnail();
          }



          // initialize to page 1
          /* if(this.firstTime == false )this.setPage(1);
           this.firstTime = true;*/

        })
    })
  }

  getCarsThumbnail() {


    //  let im=[];
    this.carsObjects = [];
    let gofiForGallery = [];
    let gofThumbsForShow = [];
    // var arr = input.split(',');

    for (var i = 0; i < this.allItems.length; i++) {


      var gofi = this.allItems[i].gofi;
      // if(gofi) var Gofi = gofi.split(',');else Gofi =[];
      if (gofi) var Gofi = gofi; else Gofi = [];

      for (var j = 0; j < Gofi.length; j++) {

        var thumbForShow = Gofi[j];

        var imgUrl = Gofi[j].replace("_thumb", "");
        var iForGallery = { thumb: thumbForShow, src: imgUrl, w: 1200, h: 900, title: 'image caption sososo ' };
        // this.im.push( this.pagedItems[i].REF_APP_ID,obj);
        gofThumbsForShow.push(thumbForShow);
        gofiForGallery.push(iForGallery);
        // obj=null;

      }



      var carObject = {
        APPLICATION_ID: this.allItems[i].application_id,
        City: Utils.convertIntToCity(this.allItems[i].emirate),
        Manufacturer: this.allItems[i].manufacter,
        Manufacturer_name: this.allItems[i].manufacture_name,
        Model: this.allItems[i].model,
        Model_name: this.allItems[i].model_name,

        Price: this.allItems[i].price,
        Year: this.allItems[i].year,
        Kilometers: this.allItems[i].miles,
        Specs: Utils.convertIntToSpecs(this.allItems[i].specs),
        NoOfCylinders: this.allItems[i].cylinders,
        Warranty: Utils.convertIntToWaranty(this.allItems[i].waranty),
        Color: Utils.convertIntToColor(this.allItems[i].color),
        Transmission: Utils.convertIntToTransmission(this.allItems[i].transmission),
        ContactNumber: this.allItems[i].phone,
        Date: this.allItems[i].ddate,
        DESCRIPTION: this.allItems[i].details,
        Thums: gofThumbsForShow, Images: gofiForGallery,
      };
      this.carsObjects.push(carObject);
      gofiForGallery = [];
      gofThumbsForShow = [];
      //  ims.push({'app_id':this.pagedItems[i]},im);

      //this.photoSwipe.openGallery(images,index);

      // this.photoSwipe.openGallery(this.pagedItems,index);
    }


  }

  EditCar(EditFrm) {

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
    this.fd.append("APPLICATION_ID", this.selectedCar.APPLICATION_ID);
    var city = Utils.convertCitytoInt(EditFrm.value.carcity); this.fd.append('city', city.toString());
    this.fd.append('manufacturer', EditFrm.value.carmanufacturer);
    this.fd.append('price', EditFrm.value.carprice);
    /*   let  year = Utils.convertYeartoInt(EditFrm.value.caryear); this.fd.append('year', year.toString()); */
    this.fd.append('year', EditFrm.value.caryear);
    this.fd.append('kilometers', EditFrm.value.carkilometers);
    this.fd.append('model', EditFrm.value.carmodel);
    var specs = Utils.convertSpecsToInt(EditFrm.value.carspecs); this.fd.append('specs', specs.toString());

    this.fd.append('cylinders', EditFrm.value.carcylinders);

    var waranty = Utils.convertWarantyToInt(EditFrm.value.carwarranty);
    this.fd.append('warranty', waranty.toString());

    var color = Utils.convertColorToInt(EditFrm.value.carcolor);

    this.fd.append('color', color.toString());

    var transmission = Utils.convertTransmissionToInt(EditFrm.value.cartransmission);
    this.fd.append('transmission', transmission.toString());

    this.fd.append('phone', EditFrm.value.carphone);

    this.fd.append('description', EditFrm.value.cardescription);




    this.auth.user.subscribe(user => {
      if (user) {
        var userId = user.uid;

        this.fd.append('uid', userId);
        this.upload();
        this.filesList = [];
      }
    })


    // this.dataService.updateCar(editCar)
    //  let editFormData;
    /*  this.dataService.updateCar(editCar.APPLICATION_ID,editFormData)
         .subscribe(result => {
           
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



  onImageChange(event) {

    var files = event.target.files;
   // this.fileInput = event.target;
    this.resizeFiles(files);
  }

  handleDrop(fileList: FileList) {

    this.resizeFiles(fileList);
  }

  addCar(frm) {
    this.addForm = frm;



    var city = Utils.convertCitytoInt(frm.value.carCity); this.fd.append('city', city.toString());
    this.fd.append('manufacturer', frm.value.carManufacturer);
    this.fd.append('price', frm.value.carPrice);

    let year = this.fd.append('year', frm.value.carYear);

    this.fd.append('kilometers', frm.value.carKilometers);
    this.fd.append('model', frm.value.carModel);
    var specs = Utils.convertSpecsToInt(frm.value.carSpecs); this.fd.append('specs', specs.toString());

    this.fd.append('cylinders', frm.value.carCylinders);

    var waranty = Utils.convertWarantyToInt(frm.value.carWarranty);
    this.fd.append('warranty', waranty.toString());

    var color = Utils.convertColorToInt(frm.value.carColor);
    this.fd.append('color', color.toString());

    var transmission = Utils.convertTransmissionToInt(frm.value.cartransmission);
    this.fd.append('transmission', transmission.toString());
    this.fd.append('phone', frm.value.carPhone);

    this.fd.append('description', frm.value.carDESCRIPTION);




    this.auth.user.subscribe(user => {
      if (user) {
        var userId = user.uid;

        this.fd.append('uid', userId);
        this.upload();
      }
    })

  }

  resizeFiles(files: FileList) {
    var resultCounter = 0;
    for (var i = 0; i < files.length; i++) {
      this.imageNotReady = true;
      this.saveOrLoading = 'loading';
      this.goOrLoading = 'loading';
      let image = files[i];
      //this.fd.append('image', image, this.time + image.name);
      this.filesList.push({ theFile: image, name: this.time + image.name });

      this.getbigImagePreview(image);
      this.ng2ImgMax.resizeImage(image, 100, 10000).subscribe(
        result => {
          this.uploadedImage = new File([result], this.time + "thumb_" + result.name);
          resultCounter++;

          console.log("result counter = " + resultCounter);
          this.getImagePreview(this.uploadedImage);
          //var singleFd = new FormData();
          //singleFd.append('image', this.uploadedImage, this.uploadedImage.name);
          //this.fd.push(singleFd);

          //this.fd.append('image', this.uploadedImage, this.uploadedImage.name);
          this.filesList.push({ theFile: this.uploadedImage, name: this.uploadedImage.name });
          console.log("i is :" + resultCounter)
          console.log("lenth is :" + files.length)
          if (resultCounter == files.length) {
            console.log("hi :" + resultCounter)
            this.imageNotReady = false;
            this.saveOrLoading = 'Save';
            this.goOrLoading = 'GO'
          }
          // this.upload();
        },
        error => {
          alert('😢 Oh no! '+ error.reason);
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

    var filesLength = this.filesList.length;
    var arrayOfurls = [];
    this.goOrLoading = 'loading';
    this.imageNotReady = true;
    var th = this;

    var uploadFSrgPromise = new Promise(function (resolve, reject) {


      var filesUploaded = 0;
      if (filesLength > 0) {
        for (let i = 0; i < filesLength; i++) {
          //  this.fd.append('image',this.filesList[i].theFile,this.filesList[i].name);
          var ref = th.afStorage.ref(th.filesList[i].name);

          var task = ref.put(th.filesList[i].theFile);
          task.percentageChanges().subscribe(function (progress) {
            console.log('progess :' + progress)
            th.uploadProgress = progress;
          })
          task.downloadURL()
            .subscribe(function (url) {
              filesUploaded++;
              //ref.getDownloadURL()
              // console.log("images isss :" + url);
              //var shortname =  url.substring(71);

              arrayOfurls.push(url);
              if (filesUploaded == filesLength) {
                var images = JSON.stringify(arrayOfurls).
                  replace(/\[/g, '').
                  replace(/\]/g, '').
                  replace(/\"/g, '').
                  replace(/\%20/g, ' ');

                th.fd.append("images", images);

                console.log("images is :" + images);
                resolve('done');
              }

            });
        }

      }
      else resolve('done');

    });


    uploadFSrgPromise.then(function (value) {

      /* th.fd.append("images",JSON.stringify(arrayOfurls));
      console.log("images is :"+JSON.stringify(arrayOfurls)); */

      var app_id = '0';
      if (th.fd.has("APPLICATION_ID")) {   /////////////////////////// if it has applicaction id this is mean its from edit form
        app_id = th.selectedCar.APPLICATION_ID;
      }
      // else url =  "http://localhost:3000/api/setimg/0";
      console.log('app id is : ' + app_id);
      /*   this.http.post("api/setimg/"+app_id, this.fd, {
          reportProgress: true,
          observe: 'events',
          //[params:string]: newCar.color
        }) */
      th.dataService.setAdd(app_id, th.fd)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            // th.uploadProgress = Math.round(event.loaded / event.total * 100) - 10;



          }
          else if (event.type === HttpEventType.Response) {
            if (event.statusText == 'OK') {
              th.addForm.reset();
              //th.fileInput.files = null;


              th.goOrLoading = 'GO';
              th.imageNotReady = false;

              th.imagePreviews = [];
              th.bigImagePreviews = [];

              th.fd.delete("APPLICATION_ID");
              th.fd.delete("image");
              th.fd.delete("images");

              th.fd.delete("city");
              th.fd.delete("manufacturer");
              th.fd.delete("model");
              th.fd.delete("price");

              th.fd.delete("year");
              th.fd.delete("kilometers");
              th.fd.delete("specs");
              th.fd.delete("cylinders");

              th.fd.delete("warranty");
              th.fd.delete("color");
              th.fd.delete("transmission");
              th.fd.delete("phone");

              th.fd.delete("description");

              th.fd.delete("uid");

              th.filesList = [];
              th.time = Date.now() + "_";
              th.uploadProgress = 0;
              alert("added successfully");

              th.getCars();

            }


          }
        },
          error => {
            alert('😢 Oh no! ' + JSON.stringify(error));
            console.log(error)

            th.addForm.reset();
            th.imagePreviews = [];
            th.bigImagePreviews = [];

            th.fd.delete("APPLICATION_ID");
            th.fd.delete("image");
            th.fd.delete("images");

            th.fd.delete("city");
            th.fd.delete("manufacturer");
            th.fd.delete("model");
            th.fd.delete("price");

            th.fd.delete("year");
            th.fd.delete("kilometers");
            th.fd.delete("specs");
            th.fd.delete("cylinders");

            th.fd.delete("warranty");
            th.fd.delete("color");
            th.fd.delete("transmission");
            th.fd.delete("phone");

            th.fd.delete("description");

            th.fd.delete("uid");

            th.filesList = [];
            th.time = Date.now() + "_";
            th.uploadProgress = 0;
          }
        );



    });         //end of promise then
  }
}