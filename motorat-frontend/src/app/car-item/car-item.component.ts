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

  getCars(){
    this.dataService.getCars()
    .subscribe( cars => {
      this.carList = cars;
      console.log('data from backend server '+this.carList[1].color);
    })
  }

  addCar(frm){

    console.log(frm.value);
  }

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getCars();
  }

}
