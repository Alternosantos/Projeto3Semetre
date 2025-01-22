import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/FireSetUp';

@Component({
  selector: 'app-professor-profile',
  standalone: true,
  templateUrl: './professor-profile.component.html',
  styleUrls: ['./professor-profile.component.css'],
  imports: [CommonModule, FormsModule, FullCalendarModule],
  encapsulation: ViewEncapsulation.None,
})
export class ProfessorPageComponent implements OnInit {
  teacher: any = null;
  classes: { id: string; Disciplina: string; IdProfessor: string; DiaMes: string; Hora: string }[] = [];
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [], // This will be populated dynamically
  };

  constructor() {}

  ngOnInit(): void {
    this.loadTeacherInfo();
    this.fetchClasses();
  }

  loadTeacherInfo(): void {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const colRef = collection(db, 'Professor');
        const q = query(colRef, where('Email', '==', user.email));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          this.teacher = snapshot.docs[0].data();
          this.teacher.id = snapshot.docs[0].id;
          console.log(this.teacher.id);
          this.populateCalendarEvents();
        }
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
      })) as { id: string; Disciplina: string; IdProfessor: string; DiaMes: string; Hora: string }[];
      console.log(this.classes)
      this.populateCalendarEvents();
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }

  populateCalendarEvents(): void {
    if (!this.teacher || !this.classes.length) return;

    const events = this.classes
      .filter((aula) => aula.IdProfessor === this.teacher.id)
      .map((aula) => ({
        title: `${aula.Disciplina} (${aula.Hora})`,
        date: aula.DiaMes, // DiaMes is expected to be in YYYY-MM-DD format
      }));

    this.calendarOptions = {
      ...this.calendarOptions,
      events,
    };
  }
}
