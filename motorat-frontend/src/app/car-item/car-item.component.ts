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
  toggleForm: boolean = false;

  getCars(){
    this.dataService.getCars()
    .subscribe( cars => {
      this.carList = cars;
     
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

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getCars();
  }

}
