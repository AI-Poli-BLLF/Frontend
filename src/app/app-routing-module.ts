import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {StudentsContComponent} from './teacher/students-cont.component';
import {HomeComponent} from './home.component';
import {PageNotFoundComponent} from './page-not-found.component';
import {VmsComponent} from './vms.component';
import {AuthGuard} from './auth/auth.guard';
import {TabComponentComponent} from './tab-component/tab-component.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent },
  {path: '', component: HomeComponent },
  {path: 'teacher/course/:name',
    canActivate: [AuthGuard],
    component: TabComponentComponent,
    children: [
      {path: '', component: HomeComponent, canActivateChild: [AuthGuard] },
      {path: 'students', component: StudentsContComponent, canActivateChild: [AuthGuard] },
      {path: 'vms', component: VmsComponent, canActivateChild: [AuthGuard] },
    ]},
  {path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false } )],
  exports: [RouterModule]
})

export class AppRoutingModule { }
