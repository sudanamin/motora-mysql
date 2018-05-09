import { Component, OnInit, HostBinding } from '@angular/core';
//import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Router } from '@angular/router';
//import { moveIn } from '../router.animations';
import { AuthService } from '../auth.service';
//import { AngularFirestore } from 'angularfire2/firestore';

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
  constructor(public auth: AuthService,private router: Router) {

     
   
  }
  

  ngOnInit() {
    if(this.auth.user ){
      this.router.navigate(['/members']);
    }
  }

  ngAfterViewInit() {
  //  document.querySelector('body').classList.add('blue');
    document.body.style.backgroundImage = "url(../../assets/aa.jpg)";
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
