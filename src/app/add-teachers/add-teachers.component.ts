import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {createUserWithEmailAndPassword, getAuth, onAuthStateChanged} from 'firebase/auth';
import {auth, db} from '../services/FireSetUp';
import {Router} from '@angular/router';
import {collection, doc, runTransaction, setDoc} from 'firebase/firestore';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teachers.component.html',
  styleUrls: ['./add-teachers.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
})
export class AddTeacherComponent {
  constructor(private router: Router) {}

  PrimeiroNome: string = '';
  SegundoNome: string = '';
  Email: string = '';
  Password: string = '';
  Educacao: string = '';
  Genero: string = '';
  Subject: string = "";

  async AddTeacher() {
    try {
      await createUserWithEmailAndPassword(auth, this.Email, this.Password);
      // Reference to the counter document
      const counterDocRef = doc(db, 'counters', 'classesTeacher');
      const collectionRef = collection(db, 'Professor'); // Your target collection

      // Use a Firestore transaction to handle concurrency and get a new auto-incremented ID
      const newId = await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterDocRef);

        let newCounterValue = 1; // Default if counter doesn't exist
        if (counterDoc.exists()) {
          // Access `currentValue` using bracket notation
          newCounterValue = counterDoc.data()['currentValue'] + 1;
        }

        // Update the counter document
        transaction.set(counterDocRef, { currentValue: newCounterValue });

        return newCounterValue;
      });

      // Add the new document with the incremented ID
      await setDoc(doc(collectionRef, String(newId)), {
        PrimeiroNome: this.PrimeiroNome,
        SegundoNome: this.SegundoNome,
        Email: this.Email,
        Password: this.Password,
        Educacao: this.Educacao,
        Genero: this.Genero,
        Subject: this.Subject,
      });

      console.log('Teacher added successfully with ID:', newId);
      alert("Professor adicionado com sucesso");

      // Optionally clear the form fields
      this.PrimeiroNome = '';
      this.SegundoNome = '';
      this.Email = '';
      this.Password = '';
      this.Educacao = '';
      this.Genero = '';
      this.Subject = '';
    } catch (error) {
      console.error('Error adding Teacher:', error);
    }
  }

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



}
