import { Component, OnInit, ViewChild } from '@angular/core';
import { car } from '../../car';
import { DataService } from '../data.service'
import { PagerService } from '../_services/index'
import { Utils } from '../../util';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

//import { Http ,Response } from '@angular/http';
/* import { HttpClient, HttpEventType } from '@angular/common/http'; */

import { PhotoSwipeComponent } from '../photo-swipe/photo-swipe.component';
/* import { IImage              } from '../interfaces/image'; */
import { Router } from "@angular/router";
/* import '../../dist/powerange.min.js'; */

declare var Slider: any;

@Component({
  selector: 'app-car-item',
  templateUrl: './car-item.component.html',
  styleUrls: ['./car-item.component.css'],
  providers: [DataService]
})
export class CarItemComponent implements OnInit {

  carList: car[] = [];
  selectedCar: car;

  SortBy:string = 'Date';

  slider1:any;
  slider2:any;
  slider3:any;
  CityToSearch: string = '';
  ManufacturerToSearch: string ='';
  ModelToSearch: string = '';
  YearToSearch: string = '';
  ColorToSearch: string = '';
  cylinderToSearch:string = '';
  transmissionToSearch: string = '';
  specificationToSearch: string ='';
  toggleForm: boolean = false;
  show_me: boolean = true;
  showModel: Boolean = false;

  theHtmlString: string = 'Phone:'

  //firstTime: boolean = true;
  cities = ["Abu Dabu", "Ajman", "Al ain", "Dubai", "Fujuira", "Ras Alkhima", "Sharjah", "Um Alquiin"];
  specs = ["GCC", "AMERICAN", "JAPANESE", "EUROPE", "OTHER"];

  carsObjects = [];
  ManufacturersObject = [];
  ModelsObject = [];
  toggleLanguage = false;
  rtl = 'rtl';

  // array of all items to be paged
  private allItems: any[];

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];
  index: number = 1;
  @ViewChild('photoSwipe') photoSwipe: PhotoSwipeComponent;
  currentOffset: number =0;
  currentPage: number =1;
  toSearch: any = {};
  count: any;
  router: Router;


  constructor( router: Router,
    private pagerService: PagerService, private dataService: DataService, private translate: TranslateService) {
    translate.setDefaultLang('en');
    this.router = router;

  }

  switchLanguage() {
    // <HTMLElement>document.querySelector(".details").Style.cssText = "--my-var: #000";
    Utils.toggleLanguage = !Utils.toggleLanguage;
    this.toggleLanguage = Utils.toggleLanguage;
    if (Utils.toggleLanguage == true){
      this.translate.use('ar');
      this.rtl = 'rtl'
    }
    else{
      this.translate.use('en')
      this.rtl = 'ltr'
    }
  }


  // ========================================================================
  openSlideshow(i, j) {

    /*    const index = this.index;
     

     
        const images = [

       { src: 'http://via.placeholder.com/600x400', w: 600, h: 400 },
       { src: 'http://via.placeholder.com/800x600', w: 800, h: 600 },
       // ...
   ]; 
*/


    //this.photoSwipe.openGallery(images,index);
    console.log('i is :' + i);
    console.log('j is :' + j);
    this.photoSwipe.openGallery(this.carsObjects[i].images, j);
  }

  getCarsThumbnail() {

    //console.log("the lord of the ring " );
    //  let im=[];
    this.carsObjects = [];
    let gofiForGallery = [];
    let gofThumbsForShow = [];
    // var arr = input.split(',');
    //console.log("length;"+this.pagedItems.length);
    for (var i = 0; i < this.pagedItems.length; i++) {


      var gofi = this.pagedItems[i].gofi;
     // if (gofi) var Gofi = gofi.split(','); else Gofi = [];
     if (gofi) var Gofi = gofi; else Gofi = [];
      // console.log(arr[0]);
      for (var j = 0; j < Gofi.length; j++) {

        var thumbForShow = Gofi[j];

        var imgUrl = Gofi[j].replace("_thumb", "");
        console.log("description is : " + this.pagedItems[i].details);
        var iForGallery = { thumb: thumbForShow, src: imgUrl, w: 1600, h: 900, title: this.pagedItems[i].details };
        // this.im.push( this.pagedItems[i].REF_APP_ID,obj);
        gofThumbsForShow.push(thumbForShow);
        gofiForGallery.push(iForGallery);
        // obj=null;

      }

      /*  console.log("gofThumbsForShow lengh:"+gofThumbsForShow[i]);
       console.log("gofiForGallery lengh:"+gofiForGallery[i].src); */
      console.log('price is ' + this.pagedItems[i].price);
      var carObject = {
        id: this.pagedItems[i].ref_app_id,
        thums: gofThumbsForShow, images: gofiForGallery,
        manufacture: this.pagedItems[i].manufacture_name,
        model: this.pagedItems[i].model_name,
        color: Utils.convertIntToColor(this.pagedItems[i].color),
        city: Utils.convertIntToCity(this.pagedItems[i].emirate),
        date: this.pagedItems[i].ddate,
        kilometers: this.pagedItems[i].miles,
        price: this.pagedItems[i].price,
        year: this.pagedItems[i].year,
        specs: Utils.convertIntToSpecs(this.pagedItems[i].specs),
        warranty: Utils.convertIntToWaranty(this.pagedItems[i].waranty),
        transmission: Utils.convertIntToTransmission(this.pagedItems[i].transmission),
        cylinder: this.pagedItems[i].cylinders,
        phone: this.pagedItems[i].phone
      };
      this.carsObjects.push(carObject);
      gofiForGallery = [];
      gofThumbsForShow = [];
      //  ims.push({'app_id':this.pagedItems[i]},im);
      //  console.log(ims[0]);
      //this.photoSwipe.openGallery(images,index);

      // this.photoSwipe.openGallery(this.pagedItems,index);

    }


  }

  showPhone(phone,event){
    //alert('phone is +'+JSON.stringify($event.target));
    var target = event.target || event.srcElement;
    target.innerHTML = phone;

   // alert ( target.innerHTML ); 
    //$event.target.inner
  }

  getCars(toSearch,offset) {
    /*  this.allItems =[];
     this.pagedItems =[];
     this.pager.pages = []; */
    //  var toSearch = {model:model,color:color}
    var offsetObject =  {'offset': offset};
    //var Count =  {'count': count};

   

    
    Object.assign(toSearch,offsetObject);

   var sort;
    switch (this.SortBy){
      case 'Price lowest to highest' :{sort = "APrice";   break;  }
      case 'Price highest to lowest' : {sort = "DPrice";   break;  }
      case 'Date' :{sort = "Date";   break;  }
      default: { 
        //statements; 
        break; 
     } 
     // default: sort = 0;
  }
  var Sortby =  {'sortby': sort};
 // console.log('aaaaaaaa: '+Sortby.sortby)
      Object.assign(toSearch,Sortby);
    

    this.dataService.getCImages(toSearch)
      .subscribe(cars => {

        var a = cars.slice(0, 1);
        this.count = a[0].count;
        console.log("count is :"+this.count);
        this.allItems = cars.slice(1, cars.length);
        this.currentOffset = offset;
        //if(this.firstTime == true )this.setPage(1);
       // if (! (toSearch.offset>1)) {
     //   if (this.currentOffset != toSearch.offset){

          if (this.allItems.length > 0) {
            this.setPage(this.currentPage);
          }
          else { this.carsObjects = [] }
          //this.setPage(1);
          //this.firstTime = false;
          //  this.getCarsThumbnail();
      //  }
      //  this.setPage(this.currentPage);


      })
  }

  SearchCar(SearchFrm) {

    //console.log('car id is :' + this.selectedCar.APPLICATION_ID);
    this.carsObjects = [];

    var minYear = (this.slider3.getValue())[0];
    var maxYear = (this.slider3.getValue())[1];

    var minKilo = this.slider2.getValue()[0] * 1000;
    var maxKilo = this.slider2.getValue()[1] * 1000;

    var minPrice = this.slider1.getValue()[0] * 1000;
    var maxPrice = this.slider1.getValue()[1] * 1000;

    

    //alert(SearchFrm.value.manufacturerToSearch+' +' +SearchFrm.value.modelToSearch+' '+SearchFrm.value.cityToSearch);

       this.CityToSearch = SearchFrm.value.cityToSearch;
       this.ManufacturerToSearch = SearchFrm.value.manufacturerToSearch;
       this.ModelToSearch = SearchFrm.value.modelToSearch;
       

    var toSearch = {
      city: Utils.convertCitytoInt(SearchFrm.value.cityToSearch),
      manufacturer:  SearchFrm.value.manufacturerToSearch,
      model:   SearchFrm.value.modelToSearch,
      color: Utils.convertColorToInt(SearchFrm.value.colorToSearch),
      minYear:minYear,
      maxYear:maxYear,
      minKilo:minKilo,
      maxKilo:maxKilo,
      minPrice:minPrice,
      maxPrice:maxPrice,
      cylinder: SearchFrm.value.cylinderToSearch,
      specification:  Utils.convertSpecsToInt(SearchFrm.value.specificationToSearch),
      transmission:  Utils.convertTransmissionToInt(SearchFrm.value.transmissionToSearch),

    }
     
    console.log('manufatures to search : '+JSON.stringify(toSearch));
    this.currentPage = 1;
    this.toSearch = toSearch;
    this.getCars(this.toSearch,0)

  }

  resetSearch(all){
    switch (all){
      case 'allCiteis':{ 
         this.toSearch.city = '';
         this.CityToSearch = '';

         this.toSearch.manufacturer = '';
         this.ManufacturerToSearch = '';

         this.toSearch.model = '';
         this.ModelToSearch = '';
        
         this.getCars(this.toSearch,0); 
         break;
        }
      case 'AllManufacturer':{ 
        this.toSearch.manufacturer = '';
        this.ManufacturerToSearch = '';

        this.toSearch.model = '';
        this.ModelToSearch = '';

        this.getCars(this.toSearch,0); 
        break;
      }
      case 'AllModel':{ 
        this.toSearch.model = '';this.getCars(this.toSearch,0); 
        this.ModelToSearch = '';
        break;
      }
    }
  }

  onSortByChange(newValue) {
   // console.log(newValue);
    this.SortBy = newValue;
     
    this.getCars(this.toSearch,0);

    // ... do other stuff here ...
    }

onManufacturersChange(event){
    
  console.log('manufatrer chaned'+JSON.stringify(event))
   
   if( event !='' && event !='All'){
    this.showModel = true;
    this.dataService.getModels(event)
    .subscribe(models => { this.ModelsObject = models; });
    
   }
   else{
     this.showModel = false;
   }
}

  ngOnInit() {

    this.dataService.getManufacturers()
    .subscribe(manufacturers => { this.ManufacturersObject = manufacturers; 
    console.log('manucaturers : '+ JSON.stringify(manufacturers));
    });

    


    this.getCars(this.toSearch,0);

  /*   var slider = new Slider("#ex1", {
      id: "slider1",
      tooltip: 'always',
   
  }); */

    this.slider1 = new Slider("#price", {
    id: "slider2",
 /*    tooltip: 'always', */
    tooltip_position:'bottom',
     ticks: [0,    100 ],  
     ticks_labels: [' 0k',     '≥100k'],
     
  /*   ticks_snap_bounds: 30 */
});



/* slider1.on("click", function(sliderValue) {
	alert(sliderValue);
}); */

this.slider2 = new Slider("#kilo", {
  id: "slider3",
  /* tooltip: 'always', */
  tooltip_position:'bottom',
   ticks: [0,    200 ],  
   ticks_labels: [' 0k',     '≥200k']
/*   ticks_snap_bounds: 30 */
});

this.slider3 = new Slider("#year", {
  id: "slider4",
  
  tooltip_position:'bottom',
   ticks: [1990,    2018 ],  
   ticks_labels: ['≤1990',     '2018'], 
    ticks_snap_bounds: 5 
});


 /*  var sliderC = new Slider("#ex12c", { id: "slider12c", min: 0, max: 10, range: true, value: [3, 7] }); */



    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.toggleLanguage = Utils.toggleLanguage;
      // do something
    });


  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get pager object from service
    //this.im = [];
    this.currentPage = page;
    let offset: number  = Math.floor((page-1)/10)  * 100;
    if(offset != this.currentOffset){
      //var toSearch= { offset:offset};
      this.getCars(this.toSearch,offset)
      return;
      
    }
    
     
    
   // this.pager = this.pagerService.getPager(this.allItems.length, page);   //count(*)
   this.pager =  this.pagerService.getPager(this.count, page,10);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex - offset, this.pager.endIndex + 1 - offset);



    this.getCarsThumbnail();
    // console.log("paged items:"+this.pagedItems[0].REF_APP_ID);
    console.log("all  is : " + this.allItems.length);


  }




}
