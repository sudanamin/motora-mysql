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
  constructor(public auth: AuthService,private router: Router) {
  }
  ngOnInit() {
  }

  onSubmit(formData) {
    if(formData.valid) {
      console.log(formData.value);
      this.auth.emailSignUp(
        formData.value.email,
         formData.value.password
      ).then(
        (success) => {
        console.log(success);
       // this.router.navigate(['/login'])
      }).then(() => {
        this.auth.emailLogin(formData.value.email,formData.value.password)
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
