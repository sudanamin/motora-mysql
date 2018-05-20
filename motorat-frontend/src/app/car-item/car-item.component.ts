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
  toggleForm: boolean = false;
  firstTime: boolean = false;

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
    openSlideshow(){

        const index = this.index;
       /*   const images : IImage[] = [
            {
                src: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/12-col/img%20(131).jpg',
                w: 600,
                h: 400,
                title: 'Image CaptionImage Caption'
            },
            {
                src: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/12-col/img%20(98).jpg',
                w: 1200,
                h: 900,
                title: 'Image Caption ImageCaption'
            },
            {
                src: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/12-col/img%20(131).jpg',
                w: 960,
                h: 960,
                title: 'Image Caption'
            },
            {
                src: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/12-col/img%20(128).jpg',
                w: 1080,
                h: 960,
                title: 'Image Caption'
            },
            {
                src: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/12-col/img%20(111).jpg',
                w: 1200,
                h: 900,
                title: 'Image Caption'
            },
        ];  */

      
         const images = [

        { src: 'http://via.placeholder.com/600x400', w: 600, h: 400 },
        { src: 'http://via.placeholder.com/800x600', w: 800, h: 600 },
        // ...
    ]; 

           
    
      const im=[] ;
     for (var i=0 ; i<this.pagedItems.length; i++){
        var obj = {src:this.pagedItems[i].IMAGE_URL, w: 1200, h: 900, title: 'image caption sososo '};
        im.push(obj);
     }
           //this.photoSwipe.openGallery(images,index);
           this.photoSwipe.openGallery(im,index);
          // this.photoSwipe.openGallery(this.pagedItems,index);
    }

  
  getCars(){

    this.dataService.getCarsImages()
    .subscribe( cars => {
      this.allItems = cars;
   
      if(this.firstTime == false )this.setPage(1);
      this.firstTime = true;
     
    })
  }

  ngOnInit() {
    this.getCars();
   
   
  }

  setPage(page: number) {
      if (page < 1 || page > this.pager.totalPages) {
          return;
      }

      // get pager object from service
      this.pager = this.pagerService.getPager(this.allItems.length, page);

      // get current page of items
      this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
      console.log("paged items:"+this.pagedItems[0].src);
  }




}
