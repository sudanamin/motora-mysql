import { Component, OnInit } from '@angular/core';
import {car} from '../../car';
import {DataService} from '../data.service'
//import { PagerService } from '../_services/index'

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
  providers: [DataService]
})
export class MembersComponent implements OnInit {

 


  constructor(  private dataService: DataService) { }

  





  

   

  ngOnInit() {
   // this.getCars();
   
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

 /* setPage(page: number) {
      if (page < 1 || page > this.pager.totalPages) {
          return;
      }

      // get pager object from service
      this.pager = this.pagerService.getPager(this.allItems.length, page);

      // get current page of items
      this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }*/

}

