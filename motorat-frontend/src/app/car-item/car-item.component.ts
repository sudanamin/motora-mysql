import { Component, OnInit } from '@angular/core';
import {car} from '../../car';
import {DataService} from '../data.service'
import { PagerService } from '../_services/index'
import { Http ,Response } from '@angular/http';



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


  constructor( private http:Http ,private pagerService: PagerService, private dataService: DataService) { }

  
  getCars(){
    this.dataService.getCars()
    .subscribe( cars => {
      this.carList = cars;
      this.allItems = cars;
      

              // initialize to page 1
      if(this.firstTime == false )this.setPage(1);
      this.firstTime = true;
     
    })
  }

  addCar(frm){
    
    let newCar: car = {
      model:frm.value.carModel,
      color: frm.value.carColor
    }

    this.dataService.addCar(newCar)
    .subscribe(car =>{
      console.log(car);
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
      console.log('original Item to be updated:'+result.affectedRows);
      this.getCars();
    });

    this.toggleForm = !this.toggleForm;
  }

  showEditForm(car){
    this.selectedCar = car;
    this.toggleForm = !this.toggleForm;

  }

  deleteCar(car){
    console.log('car id is : '+car.car_id);
    this.dataService.deleteCar(car.car_id)
    .subscribe(data => {
      console.log(data.affectedRows);
      if(data.affectedRows == 1){
        for(var i=0 ; i<this.carList.length; i++){
          if(car.car_id == this.carList[i].car_id){

            this.carList.splice(i,1);
            console.log('on is deleted ');
          }
        }
      }
    })
  }

  

   

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
  }

}
