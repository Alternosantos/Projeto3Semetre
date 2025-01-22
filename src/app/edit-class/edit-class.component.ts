import { Component } from '@angular/core';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {Router, RouterLink} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {collection, getDocs} from 'firebase/firestore';
import {db} from '../services/FireSetUp';

@Component({
  selector: 'app-edit-class',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './edit-class.component.html',
  styleUrl: './edit-class.component.css'
})
export class EditClassComponent {
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.fetchClasses();
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
  classes: any[] = [];
  async fetchClasses(): Promise<void> {
    try {
      const colRef = collection(db, 'Aula'); // Replace 'teachers' with your collection name
      const snapshot = await getDocs(colRef);
      this.classes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as { id: string; Disciplina: string; IdProfessor: string }[];
      console.log('Fetched classes:', this.classes);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  }
}
