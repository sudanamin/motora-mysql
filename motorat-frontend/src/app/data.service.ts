import { Injectable } from '@angular/core';
//import {HttpClient, Response, Headers} from '@angular/common/http'
import {HttpClient,HttpHeaders } from '@angular/common/http'
import {car} from '../car'
import 'rxjs/add/operator/map'


@Injectable()
export class DataService {

  constructor(private http: HttpClient) { }

  getCarsImages(){
    return this.http.get<Array<car>>("http://localhost:3000/api/carsimgs")
    //.map(res => res.json())
  }

  getCImages(){
    return this.http.get<Array<car>>("http://localhost:3000/api/cimages");
    //.map(res => res.json())
  }

  getCarThumb(){
    return this.http.get<Array<car>>("http://localhost:3000/api/carThum");
    //.map(res => res.json())
  }

  getCars(){
    return this.http.get<Array<car>>("http://localhost:3000/api/cars")
    //.map(res => res.json())
  }

  addCar(newCar){
    let headers = new HttpHeaders();
    headers.append('content-type','application/json');
    return this.http.post<car>('http://localhost:3000/api/car', newCar , {headers: headers})
          // .map(res => res.json());

  }

  deleteCar(id){
    return this.http.delete<car>("http://localhost:3000/api/car/"+id)
   // .map(res => res.json());
  }

  updateCar(car){
    let headers = new HttpHeaders();

    headers.append('content-type','application/json');
    return this.http.put<car>("http://localhost:3000/api/car/"+car.APPLICATION_ID, car, {headers:headers})
    //.map( res => res.json());

  }

}
