import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {StudentsContComponent} from './teacher-view/students/students-cont.component';
import {HomeComponent} from './home.component';
import {PageNotFoundComponent} from './page-not-found.component';
import {VmsComponent} from './vms/vms.component';
import {AuthGuard} from './auth/auth.guard';
import {TabComponentComponent} from './tab-component/tab-component.component';
import {TeacherViewComponent} from './teacher-view/teacher-view.component';
import {WelcomeComponent} from './welcome.component';
import {StudentViewComponent} from './student-view/student-view.component';
import {TeacherAuthGuard} from './auth/teacher-auth.guard';
import {StudentAuthGuard} from './auth/student-auth.guard';
import { TeamComponent } from './teams/team.component';
import {VmsStudentsComponent} from './vms/vms-students/vms-students.component';
import {AssignmentComponent} from './teacher-view/assignment/assignment.component';
import {AssignmentsContComponent} from './teacher-view/assignment/assignments-cont.component';
import {AssignmentSComponent} from './student-view/assignment-s/assignment-s.component';
import {VmViewComponent} from './vms/vm-view/vm-view.component';
import {AssignmentViewComponent} from './teacher-view/assignment/assignment-view/assignment-view.component';

const routes: Routes = [
  // {path: 'home', component: HomeComponent },
  {path: '', component: WelcomeComponent },
  {path: 'home', component: WelcomeComponent },
  {path: 'teacher',
    canActivate: [TeacherAuthGuard],
    component: TeacherViewComponent,
    children: [
      {path: '', component: HomeComponent },
      {path: 'course/:name',
        component: TabComponentComponent,
        children: [
          {path: '', component: HomeComponent },
          {path: 'students', component: StudentsContComponent},
          {path: 'vms', component: VmsComponent },
          {path: 'assignments', component: AssignmentsContComponent}
        ]},
    ]},
  {path: 'student',
    canActivate: [StudentAuthGuard],
    component: StudentViewComponent,
    children: [
      {path: '', component: HomeComponent },
      {path: 'course/:name',
        component: TabComponentComponent,
        children: [
          {path: '', component: HomeComponent },
          {path: 'vms', component: VmsStudentsComponent },
          {path: 'vms/:id', component: VmViewComponent },
          {path: 'teams', component: TeamComponent},
          {path: 'assignment', component: AssignmentSComponent},
          {path: 'assignment/:id', component: AssignmentViewComponent}
        ]},
    ]},
  {path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false } )],
  exports: [RouterModule]
})

export class AppRoutingModule { }
