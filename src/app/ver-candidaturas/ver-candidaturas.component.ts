import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { collection, doc, getDocs, runTransaction, setDoc } from 'firebase/firestore';
import {createUserWithEmailAndPassword, getAuth, onAuthStateChanged} from 'firebase/auth';
import {auth, db} from '../services/FireSetUp';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-ver-candidaturas',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './ver-candidaturas.component.html',
  styleUrls: ['./ver-candidaturas.component.css'],
})
export class VerCandidaturasComponent implements OnInit {
  candidaturas: any[] = [];

  constructor(private router: Router) {}

  // Fetch candidaturas from Firestore
  async fetchCandidaturas(): Promise<void> {
    try {
      const colRef = collection(db, 'Candidatura');
      const snapshot = await getDocs(colRef);
      this.candidaturas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Fetched candidaturas:', this.candidaturas);
    } catch (error) {
      console.error('Error fetching candidaturas:', error);
    }
  }

  async chooseCandidatura(candidatura: any): Promise<void> {
    try {
      // Create a user account for the candidatura
      await createUserWithEmailAndPassword(auth, candidatura.Email, "password123");

      // Reference the counter document and the "Professor" collection
      const counterDocRef = doc(db, 'counters', 'classesTeacher');
      const collectionRef = collection(db, 'Professor');
      const candidaturaDocRef = doc(db, 'Candidatura', candidatura.id);

      await runTransaction(db, async (transaction) => {
        // Step 1: Read the current counter value
        const counterDoc = await transaction.get(counterDocRef);
        let currentValue = 1;

        if (counterDoc.exists()) {
          currentValue = counterDoc.data()['currentValue'];
        }

        // Step 2: Increment the counter
        const newCounterValue = currentValue + 1;
        transaction.set(counterDocRef, { currentValue: newCounterValue });

        // Step 3: Add the candidatura to the "Professor" collection
        transaction.set(doc(collectionRef, String(newCounterValue)), {
          PrimeiroNome: candidatura.PrimeiroNome,
          SegundoNome: candidatura.SegundoNome,
          Email: candidatura.Email,
          Password: "password123",
          Educacao: candidatura.Educacao,
          Genero: candidatura.Genero,
          Subject: candidatura.Subject,
        });

        // Step 4: Delete the candidatura from the "Candidatura" collection
        transaction.delete(candidaturaDocRef);

        // Step 5: Decrement the counter value
        transaction.set(counterDocRef, { currentValue: currentValue });
      });

      console.log('Candidatura processed successfully.');
      alert('Professor adicionado com sucesso! \n A sua password é "password123"');
    } catch (error) {
      console.error('Error handling candidatura:', error);
    }
  }




  ngOnInit(): void {
    this.fetchCandidaturas();

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email !== 'admin@example.com') {
          this.router.navigate(['/profile']);
        }
      } else {
        console.log('User not logged in');
        this.router.navigate(['/']);
      }
    });
  }
}
