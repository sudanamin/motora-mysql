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
    openSlideshow()
    {
        const index = this.index;
        const images : IImage[] = [
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
        ];

        this.photoSwipe.openGallery(images,index);
    }

  
  getCars(){
    this.dataService.getCarsImages()
    .subscribe( cars => {
     // this.carList = cars;
      this.allItems = cars;
      
      

              // initialize to page 1
      if(this.firstTime == false )this.setPage(1);
      this.firstTime = true;
     
    })
  }

/*  addCar(frm){
    
    let newCar: car = {
      model:frm.value.carModel,
      color: frm.value.carColor
    }

    this.dataService.addCar(newCar)
    .subscribe(car =>{
      console.log("car is :"+ JSON.stringify(car));
      this.getCars();
    })
  }

  EditCar(EditFrm){
    console.log('car id is :'+this.selectedCar.car_id);
    let editCar: car = {
      car_id: this.selectedCar.car_id,
      model: EditFrm.value.carmodel,
      color: EditFrm.value.carcolor
    }

    this.dataService.updateCar(editCar)
    .subscribe( result => {
      console.log('original Item to be updated:'+result);
      this.getCars();
    });

    this.toggleForm = !this.toggleForm;
  }

  showEditForm(car){
    window.scrollTo(0, 0);
    this.selectedCar = car;
    this.toggleForm = !this.toggleForm;

  }

  deleteCar(car){
    console.log('car id is : '+car.car_id);
    this.dataService.deleteCar(car.car_id)
    .subscribe(data => {
      console.log(data);
      if(data){
        for(var i=0 ; i<this.carList.length; i++){
          if(car.car_id == this.carList[i].car_id){

            this.carList.splice(i,1);
            console.log('on is deleted ');
          }
        }
      }
    })
  }*/

  

   

  ngOnInit() {
    this.getCars();
   
      // get dummy data
     
    /*  this.http.get('https://jsonplaceholder.typicode.com/posts')
          .map((response: Response) => response.json())
          .subscribe(data => {
              // set items to json response
              this.allItems = data;

              // initialize to page 1
              this.setPage(1);
          }); */
  }

  setPage(page: number) {
      if (page < 1 || page > this.pager.totalPages) {
          return;
      }

      // get pager object from service
      this.pager = this.pagerService.getPager(this.allItems.length, page);

      // get current page of items
      this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
      console.log("paged items:"+this.pagedItems[0].IMAGE_URL);
  }

}
