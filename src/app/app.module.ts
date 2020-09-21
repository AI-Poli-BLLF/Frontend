import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {StudentsComponent} from './teacher-view/students/students.component';
import {StudentsContComponent} from './teacher-view/students/students-cont.component';
import {AppRoutingModule} from './app-routing-module';
import {HomeComponent} from './home.component';
import {PageNotFoundComponent} from './page-not-found.component';
import {VmsComponent} from './vms/vms.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {LoginDialogComponent, LoginDialogContentComponent} from './login-dialog/login-dialog.component';
import {JwtInterceptor} from './auth/JwtInterceptor';
import {TabComponentComponent} from './tab-component/tab-component.component';
import {RegistrationDialogComponent} from './registration-dialog/registration-dialog.component';
import {AddCourseDialogComponent} from './teacher-view/add-course-dialog/add-course-dialog.component';
import {TeacherViewComponent} from './teacher-view/teacher-view.component';
import {WelcomeComponent} from './welcome.component';
import {DeleteConfirmDialogComponent} from './teacher-view/delete-confirm-dialog/delete-confirm-dialog.component';
import {StudentViewComponent} from './student-view/student-view.component';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import {ProfileViewComponent} from './profile-view/profile-view.component';
import {ProfileViewButtonComponent} from './profile-view/profile-view-button.component';
import {VmTableComponent} from './vms/vm-table/vm-table.component';
import {VmSubTableComponent} from './vms/vm-sub-table/vm-sub-table.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {EditCourseDialogComponent} from './teacher-view/edit-course-dialog/edit-course-dialog.component';
import {TeamComponent} from './teams/team.component';
import {CreateTeamDialogComponent} from './teams/create-team-dialog/create-team-dialog.component';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {VmsStudentsComponent} from './vms/vms-students/vms-students.component';
import {CreateVmDialogComponent} from './vms/create-vm-dialog/create-vm-dialog.component';
import {AssignmentComponent} from './assignment/assignment.component';
import {AssignmentsContComponent} from './assignment/assignments-cont.component';
import {DraftComponent} from './assignment/draft/draft.component';
import {ShareDialogComponent} from './share-dialog/share-dialog.component';
import {TeamResourcesComponent} from './vms/team-resources/team-resources.component';
import {VmViewComponent} from './vms/vm-view/vm-view.component';
import {VmEditResourcesComponent} from './vms/vm-edit-resources/vm-edit-resources.component';
import {TokenComponent} from './token/token.component';
import {ShareVmButtonComponent} from './share-dialog/share-vm-button';
import {ShareCourseButtonComponent} from './share-dialog/share-course-button';
import {AdminViewComponent} from './admin-view/admin-view.component';
import {VmModelsTableComponent} from './vms/vm-models-table/vm-models-table.component';
import {VmModelsComponent} from './vms/vm-models/vm-models.component';
import { AddVmModelComponent } from './add-vm-model/add-vm-model.component';
import { AddVmModelVersionsComponent } from './add-vm-model-versions/add-vm-model-versions.component';
import { ProfessorTeamsComponent } from './professor-teams/professor-teams.component';
import { TeamCardComponent } from './team-card/team-card.component';


@NgModule({
  declarations: [
    AppComponent,
    StudentsComponent,
    StudentsContComponent,
    HomeComponent,
    PageNotFoundComponent,
    VmsComponent,
    LoginDialogComponent,
    LoginDialogContentComponent,
    TabComponentComponent,
    RegistrationDialogComponent,
    AddCourseDialogComponent,
    TeacherViewComponent,
    TeamComponent,
    WelcomeComponent,
    DeleteConfirmDialogComponent,
    StudentViewComponent,
    ProfileViewComponent,
    ProfileViewButtonComponent,
    VmTableComponent,
    VmSubTableComponent,
    EditCourseDialogComponent,
    CreateTeamDialogComponent,
    VmsStudentsComponent,
    CreateVmDialogComponent,
    AssignmentComponent,
    AssignmentsContComponent,
    DraftComponent,
    ShareDialogComponent,
    TeamResourcesComponent,
    VmViewComponent,
    VmEditResourcesComponent,
    TokenComponent,
    ShareVmButtonComponent,
    ShareCourseButtonComponent,
    AdminViewComponent,
    VmModelsTableComponent,
    VmModelsComponent,
    AddVmModelComponent,
    AddVmModelVersionsComponent,
    ProfessorTeamsComponent,
    TeamCardComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatSortModule,
    MatPaginatorModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatCardModule,
    MatSelectModule
  ],
  entryComponents: [LoginDialogComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {duration: 2500}
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
