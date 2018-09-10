import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  error: any;
  i:number = 0;
  constructor(public auth: AuthService,private router: Router) {
  }
  ngOnInit() {
  }

/*   EditCar(editForm){
    console.log(editForm.value.carManufacturer)
    this.i++;
  }
 */
  onSubmit(signupForm) {
    if(signupForm.valid) {
      var email = signupForm.value.email;
      console.log("sign in form data"+ email);
      this.auth.emailSignUp(
        signupForm.value.email,
        signupForm.value.password
      ).then(
        (success) => {
        console.log(success);
       // this.router.navigate(['/login'])
      }).then(() => {
        this.auth.emailLogin(signupForm.value.email,signupForm.value.password)
      }).then(
        () => {
       // console.log(success);
        this.router.navigate(['/members']);
      }).
      catch(
        (err) => {
        alert(err);
        this.error = err;
      })
    }

}
}
