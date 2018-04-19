import { Injectable } from '@angular/core';
import {Http, Response, Headers} from '@angular/http'
import 'rxjs/add/operator/map'


@Injectable()
export class DataService {

  constructor(private http: Http) { }

  getCars(){
    return this.http.get("http://localhost:3000/api/cars")
    .map(res => res.json())
  }

  addCar(newCar){
    let headers = new Headers();
    headers.append('content-type','application/json');
    return this.http.post('http://localhost:3000/api/car', newCar , {headers: headers})
           .map(res => res.json());

  }

  deleteCar(id){
    return this.http.delete("http://localhost:3000/api/car/"+id)
    .map(res => res.json());
  }

}
