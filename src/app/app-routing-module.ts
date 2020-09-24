import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {StudentsContComponent} from './teacher/students/students-cont.component';
import {HomeComponent} from './home/home.component';
import {PageNotFoundComponent} from './page-not-found.component';
import {VmsComponent} from './vms/teacher/vms-teacher/vms.component';
import {TabComponentComponent} from './tab-component/tab-component.component';
import {TeacherViewComponent} from './teacher/teacher-view/teacher-view.component';
import {WelcomeComponent} from './welcome.component';
import {StudentViewComponent} from './student/student-view/student-view.component';
import {TeacherAuthGuard} from './auth/teacher-auth.guard';
import {StudentAuthGuard} from './auth/student-auth.guard';
import {TeamComponent} from './teams/team-student/team.component';
import {VmsStudentsComponent} from './vms/student/vms-students/vms-students.component';
import {VmViewComponent} from './vms/vm-view/vm-view.component';
import {TokenComponent} from './token/token.component';
import {AdminAuthGuard} from './auth/admin-auth.guard';
import {AdminViewComponent} from './admin/admin-view/admin-view.component';
import {VmModelsComponent} from './admin/vm-models/vm-models.component';
import {AssignmentSComponent} from './assignments/student/assignment-s/assignment-s.component';
import {AssignmentsContComponent} from './assignments/teacher/assignments-cont.component';
import {ProfessorTeamsComponent} from './teams/professor-teams/professor-teams.component';
import {ProfessorsContComponent} from './admin/professors-cont/professors-cont.component';
import {AdminResourcesComponent} from './admin/admin-resources/admin-resources.component';
import {DraftViewComponent} from './assignments/draft-view/draft-view.component';
import {AssignmentViewComponent} from './assignments/assignment-view/assignment-view.component';
import {CorrectionViewComponent} from './assignments/correction-view/correction-view.component';
import {BaseViewComponent} from './base-view/base-view.component';

const routes: Routes = [
  // {path: 'home', component: HomeComponent },
  {path: '', component: WelcomeComponent },
  {path: 'home', component: WelcomeComponent },
  {path: 'confirm-registration/:token', component: TokenComponent },
  {path: 'teacher',
    canActivate: [TeacherAuthGuard],
    component: BaseViewComponent,
    children: [
      {path: '', component: HomeComponent },
      {path: 'course/:name',
        component: TabComponentComponent,
        children: [
          {path: '', component: HomeComponent },
          {path: 'students', component: StudentsContComponent},
          {path: 'vms', component: VmsComponent },
          {path: 'vms/:id', component: VmViewComponent },
          {path: 'teams', component: ProfessorTeamsComponent},
          {path: 'assignments',
            children: [
              {path: '', component: AssignmentsContComponent},
              {path: ':assignmentId',
                children: [
                  {path: '', component: AssignmentViewComponent},
                  {path: 'drafts/:draftId', component: DraftViewComponent},
                  {path: 'drafts/:draftId/correction', component: CorrectionViewComponent}
                ]}
            ]}
        ]},
    ]},
  {path: 'student',
    canActivate: [StudentAuthGuard],
    component: BaseViewComponent,
    children: [
      {path: '', component: HomeComponent },
      {path: 'course/:name',
        component: TabComponentComponent,
        children: [
          {path: '', component: HomeComponent },
          {path: 'vms', component: VmsStudentsComponent },
          {path: 'vms/:id', component: VmViewComponent },
          {path: 'teams', component: TeamComponent},
          {path: 'assignments',
            children: [
              {path: '', component: AssignmentSComponent},
              {path: ':assignmentId',
                children: [
                  {path: '', component: AssignmentViewComponent},
                  {path: 'drafts/:draftId', component: DraftViewComponent},
                  {path: 'drafts/:draftId/correction', component: CorrectionViewComponent}
                ]}
            ]},
          {path: 'teams', component: TeamComponent},
        ]},
    ]},
  {path: 'admin',
    canActivate: [AdminAuthGuard],
    component: BaseViewComponent,
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
