import { Component, OnInit, HostBinding } from '@angular/core';
//import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Router } from '@angular/router';
//import { moveIn } from '../router.animations';
import { AuthService } from '../core/auth.service';
//import { AngularFirestore } from 'angularfire2/firestore';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Utils } from '../../util'; 



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
 // animations: [moveIn()],
 // host: {'[@moveIn]': ''}
})
export class LoginComponent implements OnInit {
 error:any;
 email:any;
 password:any;
 toggleLanguage = false;

 ShowReset = false;   


    
 rtl = 'rtl';

  constructor(public auth: AuthService,private router: Router ,private translate: TranslateService) {
    translate.setDefaultLang('en');

     
   
  }

  setShowReset(value){

    this.ShowReset = value;
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


  ngOnInit() {

     

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.toggleLanguage = Utils.toggleLanguage;
      // do something
    });


    if(this.auth.user ){
      this.router.navigate(['/members']);
    }
  }

  ngAfterViewInit() {
  //  document.querySelector('body').classList.add('blue');
  //document.body.style.backgroundImage = "url(../../assets/post-it-note.jpg)";
  //  document.body.style.backgroundRepeat = "no-repeat";
 //   document.body.style.backgroundPosition = "center"; 

}
ngOnDestroy(): void {
    document.body.style.backgroundImage = "";
}



onSubmit(formData) {
  if(formData.valid) {
    console.log(formData.value);
    this.auth.emailLogin(
       formData.value.email,
       formData.value.password
    ).then(
      (success) => {
      console.log(success);
      this.router.navigate(['/members']);
    }).catch(
      (err) => {
      console.log("hi eror:"+err);
      this.error = err;
      alert(this.error);
    })
  }
}
}
