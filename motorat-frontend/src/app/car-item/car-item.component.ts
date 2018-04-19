import { Component, OnInit } from '@angular/core';
import {car} from '../../car';
import {DataService} from '../data.service'

@Component({
  selector: 'app-car-item',
  templateUrl: './car-item.component.html',
  styleUrls: ['./car-item.component.css'],
  providers: [DataService]
})
export class CarItemComponent implements OnInit {

  carList: car[] = [];
  selectedCar: car;

  getCars(){
    this.dataService.getCars()
    .subscribe( cars => {
      this.carList = cars;
      console.log('data from backend server '+this.carList[0].color);
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

  EditCar(frm){
    console.log(frm.value);
  }

  showEditForm(car){
    this.selectedCar = car;

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

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getCars();
  }

}
