import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from '@angular/router';
import {getAuth, onAuthStateChanged,} from 'firebase/auth';
import { db } from '../services/FireSetUp';
import {collection, doc, runTransaction, setDoc} from 'firebase/firestore';

@Component({
  selector: 'app-candidatura',
  standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './candidatura.component.html',
  styleUrl: './candidatura.component.css'
})
export class CandidaturaComponent {
  constructor(private router: Router) {}

  PrimeiroNome: string = '';
  SegundoNome: string = '';
  Email: string = '';
  Educacao: string = '';
  Genero: string = '';
  Subject: string = "";

  async AddTeacher() {
    try {
      const counterDocRef = doc(db, 'counters', 'classesCandidatura');
      const collectionRef = collection(db, 'Candidatura'); // Your target collection

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
      this.Educacao = '';
      this.Genero = '';
      this.Subject = '';
    } catch (error) {
      console.error('Error adding Teacher:', error);
    }
  }

  ngOnInit(): void {
    console.log()
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === 'admin@example.com') {
        } else if (user.email === null){
          this.router.navigate(['/candidatura-espontanea']);
        } else {
          this.router.navigate(['/candidatura-espontanea']);
        }
      } else {
        console.log('User not logged in');
      }
    });

  }

}
