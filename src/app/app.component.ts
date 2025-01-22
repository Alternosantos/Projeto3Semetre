import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {signOut} from "firebase/auth"
import {auth} from './services/FireSetUp';
import {Router} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgOptimizedImage, RouterLink,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private router: Router) {}

  async Logout()  {
    try {
      await signOut(auth);
      this.router.navigate(['']);
    } catch (e) {
      console.log(e);
    }

  }


}


