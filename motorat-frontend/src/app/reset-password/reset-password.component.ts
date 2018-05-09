import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  error:any;
  email:any;

  
  constructor(public auth: AuthService,private router: Router) {}

  ngOnInit() {
  }

  onSubmit(formData) {
    if(formData.valid) {
      console.log(formData.value);
      this.auth.resetPassword(
         formData.value.email,
        
      ).then(
        (success) => {
        console.log(success);
        alert("Reset Email has been send to your email kindly check your inbox");
        this.router.navigate(['/login']);
      }).catch(
        (err) => {
        console.log("hi eror:"+err);
        this.error = err;
        alert(this.error);
      })
    }
  }

}
