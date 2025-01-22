import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {getFirestore, doc, setDoc, collection, runTransaction, getDocs} from 'firebase/firestore';
import { db } from "../services/FireSetUp";
import { Router } from '@angular/router';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-add-class',
  standalone: true,
  imports: [
    FormsModule,CommonModule
  ],
  templateUrl: './add-class.component.html',
  styleUrl: './add-class.component.css'
})
export class AddClassComponent {
  classes: any[] = [];
  teachers: any[] = [];
  selectedClass: any | null = null; // Holds the class being edited
  selectedTeacher: any | null = null; // Holds the selected teacher
  isEditing: boolean = false;
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
  async fetchTeachers(): Promise<void> {
    try {
      const colRef = collection(db, 'Professor');
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

  onAddTeacher(): void {
    this.isEditing = true;
    this.fetchTeachers(); // Fetch the list of professors
  }

  onCancelEdit(): void {
    this.selectedClass = null;
    this.selectedTeacher = null;
    this.isEditing = false;
  }

  onSelectTeacher(teacher: any): void {
    this.selectedTeacher = teacher; // Store the selected teacher
    console.log('Selected teacher:', teacher);
  }

  DiaSemana: string = '';
  Disciplina: string = '';
  Horario: string = '';
  id: string = '';
  Turma: string = '';
  DiaMes: string = '';

  async addClass() {
    try {
      // Reference to the counter document
      const counterDocRef = doc(db, 'counters', 'classesCounter');
      const collectionRef = collection(db, 'Aula'); // Your target collection

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
        DiaSemana: this.DiaSemana,
        Disciplina: this.Disciplina,
        Hora: this.Horario,
        IdProfessor: this.selectedTeacher.id | 0,
        Turma: this.Turma,
        DiaMes: this.DiaMes,
      });

      console.log('Class added successfully with ID:', newId);
      alert("Aulas adicionada com sucesso");

      // Optionally clear the form fields
      this.DiaSemana = '';
      this.Disciplina = '';
      this.Horario = '';
      this.id = '';
      this.Turma = '';
      this.DiaMes = '';
      this.onCancelEdit();
    } catch (error) {
      console.error('Error adding class:', error);
    }
  }
}
