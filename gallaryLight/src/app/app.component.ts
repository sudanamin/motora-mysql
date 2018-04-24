import {Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
 declare var $ :any;

declare var lightGallery: any; // this will prevent typescript compiler complaining about "lightGallery" not found

@Component({
  selector: 'app-root',
  template: `<div id="lightgallery" #selectElem>
  <a href="http://via.placeholder.com/350x150">
    <img src="http://via.placeholder.com/350x150" />
  </a>
  <a href="http://via.placeholder.com/350x150">
    <img src="http://via.placeholder.com/350x150" />
  </a>      
</div>`,
})
export class AppComponent  implements AfterViewInit {
  @ViewChild('selectElem') el:ElementRef;

  ngAfterViewInit() {
    $(this.el.nativeElement).lightGallery();      
  } 
}
