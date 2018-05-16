import { Component, ElementRef, ViewChild } from '@angular/core';

import { PhotoSwipeComponent } from 'app/components/photo-swipe/photo-swipe.component';

// Image Interface
import { IImage              } from 'app/interfaces/image';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.css']
})
export class AppComponent
{
    index:number =1;
    @ViewChild('photoSwipe') photoSwipe: PhotoSwipeComponent;

    // ========================================================================
    openSlideshow()
    {
        const index = this.index;
        const images : IImage[] = [
            {
                src: '../../assets/ss.jpg',
                w: 600,
                h: 400,
                title: 'Image CaptionImage Caption'
            },
            {
                src: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/12-col/img%20(98).jpg',
                w: 1200,
                h: 900,
                title: 'Image Caption ImageCaption'
            },
            {
                src: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/12-col/img%20(131).jpg',
                w: 960,
                h: 960,
                title: 'Image Caption'
            },
            {
                src: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/12-col/img%20(128).jpg',
                w: 1080,
                h: 960,
                title: 'Image Caption'
            },
            {
                src: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/12-col/img%20(111).jpg',
                w: 1200,
                h: 900,
                title: 'Image Caption'
            },
        ];

        this.photoSwipe.openGallery(images,index);
    }


    // ========================================================================
}
