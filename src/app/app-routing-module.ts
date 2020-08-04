import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {StudentsContComponent} from './teacher/students-cont.component';
import {HomeComponent} from './home.component';
import {PageNotFoundComponent} from './page-not-found.component';
import {VmsComponent} from './vms.component';
import {AuthGuard} from './auth/auth.guard';

const routes: Routes = [
  {path: 'home', component: HomeComponent },
  {path: '', component: HomeComponent },
  {path: 'teacher/course',
    canActivate: [AuthGuard],
    children: [
      {path: 'applicazioni-internet/students', component: StudentsContComponent, canActivateChild: [AuthGuard] },
      {path: 'applicazioni-internet/vms', component: VmsComponent, canActivateChild: [AuthGuard] },
    ]},
  {path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false } )],
  exports: [RouterModule]
})

export class AppRoutingModule { }
