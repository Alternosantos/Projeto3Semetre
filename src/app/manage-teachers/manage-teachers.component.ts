import { Component } from '@angular/core';
import { RouterModule,Router } from '@angular/router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/FireSetUp'
import { getAuth, onAuthStateChanged} from 'firebase/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-teachers',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './manage-teachers.component.html',
  styleUrl: './manage-teachers.component.css'
})

export class ManageTeachersComponent {
  ngOnInit(): void {
    this.fetchTeachers();
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === 'admin@example.com') {
          console.log(user.email);
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

  navigateToAddTeacher(): void {
    this.router.navigate(['/add-teacher'])
      .then(success => {
        if (success) {
          console.log('Navigation successful!');
        } else {
          console.warn('Navigation failed.');
        }
      })
      .catch(error => {
        console.error('Navigation error:', error);
      });

  }
  teachers: any[] = [];
  async fetchTeachers(): Promise<void> {
    try {
      const colRef = collection(db, 'Professor'); // Replace 'teachers' with your collection name
      const snapshot = await getDocs(colRef);
      this.teachers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as { id: string; PrimeiroNome: string; Subject: string }[];
      console.log('Fetched teachers:', this.teachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  }
}


