import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import {Utils} from '../../util';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  toggleLanguage = false;

   constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    
  }

  switchLanguage(language: string) {
    // <HTMLElement>document.querySelector(".details").Style.cssText = "--my-var: #000";
    Utils.toggleLanguage = !Utils.toggleLanguage;
     this.toggleLanguage = Utils.toggleLanguage;
     if(Utils.toggleLanguage == true)
        this.translate.use('ar');
     else
        this.translate.use('en')
   }

  

  ngOnInit() {

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.toggleLanguage = Utils.toggleLanguage;
      // do something
    });
  }

}
