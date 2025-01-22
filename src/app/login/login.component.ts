import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import {getAuth, signInWithEmailAndPassword,onAuthStateChanged} from "firebase/auth"
import {auth} from '../services/FireSetUp';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ]
})
export class LoginComponent  {
  constructor(private router: Router) {}

  Email: string = '';
  Password: string = '';
  async Login(){
    await signInWithEmailAndPassword(auth,this.Email,this.Password);
    console.log(auth.currentUser?.email);
    if(auth.currentUser?.email == 'admin@example.com'){
        await this.router.navigate(['/dashboard']);
    }
    else{
      await this.router.navigate(['/profile']);
    }
  }

  // Variable to control visibility of login form
  showLogin: boolean = false;
  showInt: boolean = true;

  // Function to show the login form when "Let's Get Started" is clicked
  showLoginForm() {
    this.showLogin = true;
  }
  hideIntro(){
    this.showInt = false;
  }
  ngOnInit(): void {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if(user){
        this.router.navigate(['/dashboard']);
      } else{
        console.log("User not logged in");
      }
    });

  }


}
