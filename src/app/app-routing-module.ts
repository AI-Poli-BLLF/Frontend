import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {StudentsContComponent} from './teacher-view/students/students-cont.component';
import {HomeComponent} from './home.component';
import {PageNotFoundComponent} from './page-not-found.component';
import {VmsComponent} from './vms/vms.component';
import {TabComponentComponent} from './tab-component/tab-component.component';
import {TeacherViewComponent} from './teacher-view/teacher-view.component';
import {WelcomeComponent} from './welcome.component';
import {StudentViewComponent} from './student-view/student-view.component';
import {TeacherAuthGuard} from './auth/teacher-auth.guard';
import {StudentAuthGuard} from './auth/student-auth.guard';
import {TeamComponent} from './teams/team.component';
import {VmsStudentsComponent} from './vms/vms-students/vms-students.component';
import {VmViewComponent} from './vms/vm-view/vm-view.component';
import {TokenComponent} from './token/token.component';
import {AdminAuthGuard} from './auth/admin-auth.guard';
import {AdminViewComponent} from './admin-view/admin-view.component';
import {VmModelsComponent} from './vms/vm-models/vm-models.component';
import {AssignmentSComponent} from './student-view/assignment-s/assignment-s.component';
import {AssignmentsContComponent} from './teacher-view/assignment/assignments-cont.component';
import {ProfessorTeamsComponent} from './professor-teams/professor-teams.component';
import {ProfessorsContComponent} from './professors-cont/professors-cont.component';
import {AdminResourcesComponent} from './admin-resources/admin-resources.component';
import {DraftViewComponent} from './draft-view/draft-view.component';
import {AssignmentViewComponent} from './assignment-view/assignment-view.component';

const routes: Routes = [
  // {path: 'home', component: HomeComponent },
  {path: '', component: WelcomeComponent },
  {path: 'home', component: WelcomeComponent },
  {path: 'confirm-registration/:token', component: TokenComponent },
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
          {path: 'vms/:id', component: VmViewComponent },
          // todo: il prof deve vedere tutti i team del corso
          {path: 'teams', component: ProfessorTeamsComponent},
          {path: 'assignments',
            children: [
              {path: '', component: AssignmentsContComponent},
              {path: ':assignmentId',
                children: [
                  {path: '', component: AssignmentViewComponent},
                  {path: 'draft/:draftId', component: DraftViewComponent}
                ]}
            ]}
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
          {path: 'assignment/:id', component: AssignmentViewComponent},
          {path: 'teams', component: TeamComponent},
        ]},
    ]},
  {path: 'admin',
    canActivate: [AdminAuthGuard],
    component: AdminViewComponent,
    children: [
      {path: '', component: HomeComponent },
      {path: 'tools',
        component: TabComponentComponent,
        children: [
          {path: '', component: HomeComponent },
          {path: 'vmModels', component: VmModelsComponent },
          {path: 'professors', component: ProfessorsContComponent },
          {path: 'resources', component: AdminResourcesComponent }]
      },
      {path: 'course/:name',
        component: TabComponentComponent,
        children: [
          {path: '', component: HomeComponent },
          {path: 'students', component: StudentsContComponent},
          {path: 'vms', component: VmsComponent },
          {path: 'vms/:id', component: VmViewComponent },
          // todo: l'admin deve vedere tutti i team del corso
          {path: 'teams', component: ProfessorTeamsComponent}
        ]},
    ]},
  {path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false } )],
  exports: [RouterModule]
})

export class AppRoutingModule { }
