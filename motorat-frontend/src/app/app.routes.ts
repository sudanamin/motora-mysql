import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* import { AppComponent } from './app.component'; */
import { MembersComponent } from './members/members.component';
//import { AuthGuard } from './auth.guard';

import { AuthGuard } from './auth.guard';
import { MainComponent } from './main/main.component';
import { LoginComponent} from './login/login.component';
import { SignupComponent} from './signup/signup.component';
import { ResetPasswordComponent} from './reset-password/reset-password.component';

import { ContactComponent} from './contact/contact.component';
import { AboutComponent} from './about/about.component';




export const router: Routes = [
    { path: '',   redirectTo: 'main', pathMatch: 'full' },
    
    { path:'main', component: MainComponent},
    { path: 'contact', component: ContactComponent },
    { path: 'about', component: AboutComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
   // { path: 'login-email', component: EmailComponent },
    { path: 'reset', component: ResetPasswordComponent },
   
    { path: 'members', component: MembersComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/main', pathMatch: 'full' },
   
  // { path: 'members', component: MembersComponent }

   
]

export const routes: ModuleWithProviders = RouterModule.forRoot(router);