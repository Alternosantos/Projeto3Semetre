import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ManageTeachersComponent} from './manage-teachers/manage-teachers.component';
import {ManageClassesComponent} from './manage-classes/manage-classes.component';
import {AddTeacherComponent} from './add-teachers/add-teachers.component';
import {ProfessorPageComponent} from './profile/professor-profile.component';
import {AddClassComponent} from './add-class/add-class.component';
import {EditClassComponent} from './edit-class/edit-class.component';
import {CandidaturaComponent} from './candidatura/candidatura.component';
import {VerCandidaturasComponent} from './ver-candidaturas/ver-candidaturas.component';


export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component:DashboardComponent},
  { path: 'manage-teachers', component: ManageTeachersComponent},
  { path: 'manage-classes', component: ManageClassesComponent },
  { path: 'add-teacher', component: AddTeacherComponent},
  { path: 'profile', component: ProfessorPageComponent},
  { path: 'add-class', component: AddClassComponent},
  { path: 'edit-class', component: EditClassComponent},
  { path: 'candidatura-espontanea', component: CandidaturaComponent},
  { path: 'candidatura', component: VerCandidaturasComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
