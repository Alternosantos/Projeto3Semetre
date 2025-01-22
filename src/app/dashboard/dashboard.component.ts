import { Component } from '@angular/core';
import {Router, RouterLink, RouterModule} from '@angular/router';
import { getAuth, onAuthStateChanged} from 'firebase/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  ngOnInit(): void {

    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === 'admin@example.com') {
        } else {
          this.router.navigate(['/profile']);
        }
      } else {
        console.log('User not logged in');
        this.router.navigate(['/']);
      }
    });
  }
  constructor(private router: Router) {}
}
