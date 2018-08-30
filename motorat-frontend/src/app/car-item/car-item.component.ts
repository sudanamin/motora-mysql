import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import {car} from '../../car';
import {DataService} from '../data.service'
import { PagerService } from '../_services/index'
import {Utils} from '../../util';
import { TranslateService } from '@ngx-translate/core';

//import { Http ,Response } from '@angular/http';
/* import { HttpClient, HttpEventType } from '@angular/common/http'; */

import { PhotoSwipeComponent } from '../photo-swipe/photo-swipe.component';
/* import { IImage              } from '../interfaces/image'; */
import {Router} from "@angular/router";


@Component({
  selector: 'app-car-item',
  templateUrl: './car-item.component.html',
  styleUrls: ['./car-item.component.css'],
  providers: [DataService]
})
export class CarItemComponent implements OnInit {

  carList: car[] = [];
  selectedCar: car;
  ModelToSearch: string ='';
  ColorToSearch: string ='';
  toggleForm: boolean = false;
 
  //firstTime: boolean = true;
  cities = ["Abu Dabu","Ajman","Al ain","Dubai","Fujuira","Ras Alkhima","Sharjah","Um Alquiin"];
  specs = ["GCC","AMERICAN","JAPANESE","EUROPE","OTHER"];
   
   carsObjects = [];
   toggleLanguage = false;

   // array of all items to be paged
   private allItems: any[];

   // pager object
   pager: any = {};

   // paged items
   pagedItems: any[];
   index:number =1;
   @ViewChild('photoSwipe') photoSwipe: PhotoSwipeComponent;


  constructor(    private router: Router,
    private pagerService: PagerService, private dataService: DataService,private translate: TranslateService) {
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

 
    // ========================================================================
    openSlideshow(i,j){

        const index = this.index;
      

      
         const images = [

        { src: 'http://via.placeholder.com/600x400', w: 600, h: 400 },
        { src: 'http://via.placeholder.com/800x600', w: 800, h: 600 },
        // ...
    ]; 

           
  
    //this.photoSwipe.openGallery(images,index);
    console.log('i is :'+i );
    console.log('j is :'+j );
    this.photoSwipe.openGallery(this.carsObjects[i].images,j);
}

getCarsThumbnail(){

  //console.log("the lord of the ring " );
      //  let im=[];
      this.carsObjects = [];
      let gofiForGallery=[] ;
      let gofThumbsForShow= [];
     // var arr = input.split(',');
     //console.log("length;"+this.pagedItems.length);
     for (var i=0 ; i<this.pagedItems.length; i++){


        var gofi = this.pagedItems[i].gofi;
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
        console.log('price is '+this.pagedItems[i].PRICE);
        var carObject = {
          id:this.pagedItems[i].REF_APP_ID,
          thums:gofThumbsForShow,images:gofiForGallery,
          manufacture:this.pagedItems[i].MANUFACTURE_NAME,
          model:this.pagedItems[i].MODEL_NAME,
          color:Utils.convertIntToColor(this.pagedItems[i].COLOR),
          city:Utils.convertIntToCity(this.pagedItems[i].EMIRATE),
          date:this.pagedItems[i].DDATE,
          kilometers:this.pagedItems[i].MILES,
          price:this.pagedItems[i].PRICE,
          year:this.pagedItems[i].YEAR,
          specs:Utils.convertIntToSpecs(this.pagedItems[i].SPECS),
          waranty:Utils.convertIntToWaranty(this.allItems[i].WARANTY),
        };
       this.carsObjects.push(carObject);
       gofiForGallery = [];
       gofThumbsForShow = [];
       //  ims.push({'app_id':this.pagedItems[i]},im);
       //  console.log(ims[0]);
           //this.photoSwipe.openGallery(images,index);
          
          // this.photoSwipe.openGallery(this.pagedItems,index);
        
    }
   

  }
  
  getCars(model,color, userID){
    /*  this.allItems =[];
     this.pagedItems =[];
     this.pager.pages = []; */
    this.dataService.getCImages(model,color,userID)
    .subscribe( cars => {
      this.allItems = cars;

      //if(this.firstTime == true )this.setPage(1);
      if(this.allItems.length >0){   
      this.setPage(1);
      }
      else {this.carsObjects = []}
      //this.setPage(1);
      //this.firstTime = false;
    //  this.getCarsThumbnail();

     
    })
  }

  SearchCar(SearchFrm){

    //console.log('car id is :' + this.selectedCar.APPLICATION_ID);
    this.carsObjects = [];
      this.ModelToSearch = SearchFrm.value.carmodel;
      this.ColorToSearch = SearchFrm.value.carcolor;
    
      this.getCars(this.ModelToSearch,this.ColorToSearch,"")
    
  }

  ngOnInit() {
    this.getCars('','',"");
   
   
  }

  setPage(page: number) {
      if (page < 1 || page > this.pager.totalPages) {
          return;
      }

      // get pager object from service
      //this.im = [];
      this.pager = this.pagerService.getPager(this.allItems.length, page);

      // get current page of items
      this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);

     
        
        this.getCarsThumbnail();   
       // console.log("paged items:"+this.pagedItems[0].REF_APP_ID);
        console.log("all  is : "+this.allItems.length);
      
      
  }




}
