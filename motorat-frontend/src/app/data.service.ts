import { Injectable } from '@angular/core';
//import {HttpClient, Response, Headers} from '@angular/common/http'
import {HttpClient,HttpHeaders } from '@angular/common/http'
import {car} from '../car'
import 'rxjs/add/operator/map'
import { environment } from '../environments/environment';



@Injectable()
export class DataService {

 // hostName:string  = "http://localhost:8080/";
 apiUrl = environment.hostname;


  constructor(private http: HttpClient) { }

  /*getCarsImages(){
    return this.http.get<Array<car>>("http://localhost:3000/api/carsimgs")
    //.map(res => res.json())
  }*/

  setAdd(appId,formData){
    
    return this.http.post(this.apiUrl +"api/setimg/"+appId, formData, {
      reportProgress: true,
      observe: 'events',
      //[params:string]: newCar.color
    })

    }

  getCImages(toSearch  ){

    
    
    return this.http.get<Array<any>>(this.apiUrl +"api/cimages", {
      params: toSearch/* {
        model: model ,
        color: color,
        userID: userID
      } */
    //.map(res => res.json())
  }
    )}


  getManufacturers( ){

      return this.http.get<Array<any>>(this.apiUrl +"api/manufacturers"  )
    }

  
    getModels(Manufacturer ){

      return this.http.get<Array<any>>(this.apiUrl +"api/models",{
      params: {  manufacturer: Manufacturer }
    })
  }

  deleteCar(id){
    return this.http.delete<car>(this.apiUrl +"api/car/"+id)
   // .map(res => res.json());
  }

  deleteImage(carID,shortName){
   // var image_name = image_url.substring(22);
   // console.log('image name is '+image_name +"image url is "+image_url);
   
    console.log("image_url" + carID);
    return this.http.delete(this.apiUrl +"api/image/", {
      params:   {
        carid: carID  ,
        shortName : shortName 
         
      }  
    //.map(res => res.json())
  });
   // .map(res => res.json());
  }

  updateCar(carID , formData ){
    let headers = new HttpHeaders();

    headers.append('content-type','application/json');
   /*  return this.http.put<car>("http://localhost:3000/api/car/"+carID, car, {headers:headers}) */
   return this.http.put<car>(this.apiUrl +"api/car/"+carID, formData, {headers:headers})
    //.map( res => res.json());

  }

}
