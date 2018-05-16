import { Component, ViewChild, ElementRef, Input } from '@angular/core';

// Import PhotoSwipe
//mport PhotoSwipe           from 'photoswipe';
//import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import * as PhotoSwipe from "photoswipe"; 
import * as PhotoSwipeUI_Default from "photoswipe/dist/photoswipe-ui-default"
// Image Interface
import { IImage } from '../interfaces/image';

@Component({
    selector   : 'app-photo-swipe',
    templateUrl: './photo-swipe.component.html',
    styleUrls  : ['./photo-swipe.component.css']
})
export class PhotoSwipeComponent
{
    @ViewChild('photoSwipe') photoSwipe: ElementRef;

    @Input() images: IImage[] = [];

    // ========================================================================
    constructor() { }

    // ========================================================================
    openGallery(images?: IImage[],index?:number)
    {
        // Build gallery images array
        images = images || this.images;

        // define options (if needed)
        const options = {
            // optionName: 'option value'
            // for example:
            index: index || 1 // start at first slide
        };

        // Initializes and opens PhotoSwipe
        const gallery = new PhotoSwipe(this.photoSwipe.nativeElement, PhotoSwipeUI_Default, images, options);
        gallery.init();
        
    }
    // ========================================================================
}
