import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import {car} from '../../car';
import {DataService} from '../data.service'
import { PagerService } from '../_services/index'
//import { Http ,Response } from '@angular/http';
import { HttpClient, HttpEventType } from '@angular/common/http';

import { PhotoSwipeComponent } from '../photo-swipe/photo-swipe.component';
import { IImage              } from '../interfaces/image';


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
  firstTime: boolean = true;
   
   im = [];

   // array of all items to be paged
   private allItems: any[];

   // pager object
   pager: any = {};

   // paged items
   pagedItems: any[];
   index:number =1;
   @ViewChild('photoSwipe') photoSwipe: PhotoSwipeComponent;


  constructor( private pagerService: PagerService, private dataService: DataService) { }

 
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
    this.photoSwipe.openGallery(this.im[i].thums,j);
}

getCarsThumbnail(){


      //  let im=[];
      this.im = [];
      let ims=[] ;
     // var arr = input.split(',');
     //console.log("length;"+this.pagedItems.length);
     for (var i=0 ; i<this.pagedItems.length; i++){


        var input = this.pagedItems[i].gofi;
        var arr = input.split(',');
       // console.log(arr[0]);
        for (var j=0 ; j<arr.length; j++){
        var obj = {src:arr[j], w: 1200, h: 900, title: 'image caption sososo '};
       // this.im.push( this.pagedItems[i].REF_APP_ID,obj);
       ims.push(obj);
       // obj=null;
        }
        
        var allobjs = {id:this.pagedItems[i].REF_APP_ID,thums:ims,model:this.pagedItems[i].MODEL};
       this.im.push(allobjs);
       ims = [];
       //  ims.push({'app_id':this.pagedItems[i]},im);
       //  console.log(ims[0]);
           //this.photoSwipe.openGallery(images,index);
          
          // this.photoSwipe.openGallery(this.pagedItems,index);
    }
    console.log(this.im[0].thums);
  }
  getCars(model,color){
    /*  this.allItems =[];
     this.pagedItems =[];
     this.pager.pages = []; */
    this.dataService.getCImages(this.ModelToSearch,this.ColorToSearch)
    .subscribe( cars => {
      this.allItems = cars;

      //if(this.firstTime == true )this.setPage(1);
      if(this.allItems.length >0){   
      this.setPage(1);
      }
      else {this.im = []}
      //this.setPage(1);
      this.firstTime = false;
    //  this.getCarsThumbnail();

     
    })
  }

  SearchCar(SearchFrm){

    //console.log('car id is :' + this.selectedCar.APPLICATION_ID);
     
      this.ModelToSearch = SearchFrm.value.carmodel;
      this.ColorToSearch = SearchFrm.value.carcolor;
    
      this.getCars(this.ModelToSearch,this.ColorToSearch)
    
  }

  ngOnInit() {
    this.getCars('','');
   
   
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
        console.log("paged items:"+this.pagedItems[0].gofi);
      
  }




}
