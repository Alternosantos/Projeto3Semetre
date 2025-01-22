import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../services/FireSetUp';

@Component({
  selector: 'app-manage-classes',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './manage-classes.component.html',
  styleUrls: ['./manage-classes.component.css']
})
export class ManageClassesComponent {
  classes: any[] = [];
  teachers: any[] = [];
  selectedClass: any | null = null;
  selectedTeacher: any | null = null;
  isEditing: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.fetchClasses();
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === 'admin@example.com') {
          // Admin is logged in
        } else {
          this.router.navigate(['/profile']);
        }
      } else {
        console.log('User not logged in');
        this.router.navigate(['/']);
      }
    });
  }

  async fetchClasses(): Promise<void> {
    try {
      const colRef = collection(db, 'Aula');
      const snapshot = await getDocs(colRef);
      this.classes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as { id: string; Disciplina: string; IdProfessor: string }[];
      console.log('Fetched classes:', this.classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }

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

  onEditClass(classItem: any): void {
    this.selectedClass = classItem;
    this.isEditing = true;
    this.fetchTeachers();
  }

  onCancelEdit(): void {
    this.selectedClass = null;
    this.selectedTeacher = null;
    this.isEditing = false;
  }

  onSelectTeacher(teacher: any): void {
    this.selectedTeacher = teacher;
    console.log('Selected teacher:', teacher);
  }

  async saveTeacherAssignment(): Promise<void> {
    if (this.selectedClass && this.selectedTeacher) {
      try {
        const classDocRef = doc(db, 'Aula', this.selectedClass.id);
        await setDoc(classDocRef, {
          IdProfessor: this.selectedTeacher.id
        }, { merge: true });

        console.log('Teacher assigned successfully to the class');
        this.onCancelEdit();
      } catch (error) {
        console.error('Error saving teacher assignment:', error);
      }
    } else {
      console.error('Class or teacher not selected.');
    }
  }
}
