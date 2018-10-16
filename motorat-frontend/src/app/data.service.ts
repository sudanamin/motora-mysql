import { Injectable } from '@angular/core';
//import {HttpClient, Response, Headers} from '@angular/common/http'
import {HttpClient,HttpHeaders } from '@angular/common/http'
import {car} from '../car'
import 'rxjs/add/operator/map'


@Injectable()
export class DataService {

 // hostName:string  = "http://localhost:8080/";

  constructor(private http: HttpClient) { }

  /*getCarsImages(){
    return this.http.get<Array<car>>("http://localhost:3000/api/carsimgs")
    //.map(res => res.json())
  }*/

  getCImages(toSearch  ){

    
    
    return this.http.get<Array<any>>(/* this.hostName +*/"api/cimages", {
      params: toSearch/* {
        model: model ,
        color: color,
        userID: userID
      } */
    //.map(res => res.json())
  }
    )}


  getManufacturers( ){

      return this.http.get<Array<any>>(/* this.hostName +*/"api/manufacturers"  )
    }

  
    getModels(Manufacturer ){

      return this.http.get<Array<any>>(/* this.hostName+ */"api/models",{
      params: {  manufacturer: Manufacturer }
    })
  }

  deleteCar(id){
    return this.http.delete<car>(/* this.hostName+ */"api/car/"+id)
   // .map(res => res.json());
  }

  deleteImage(image_url){
   // var image_name = image_url.substring(22);
   // console.log('image name is '+image_name +"image url is "+image_url);
   
    
    return this.http.delete(/* this.hostName+ */"api/image/"+image_url);
   // .map(res => res.json());
  }

  updateCar(carID , formData ){
    let headers = new HttpHeaders();

    headers.append('content-type','application/json');
   /*  return this.http.put<car>("http://localhost:3000/api/car/"+carID, car, {headers:headers}) */
   return this.http.put<car>(/* this.hostName+ */"api/car/"+carID, formData, {headers:headers})
    //.map( res => res.json());

  }

}
