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
import {StudentsComponent} from './teacher/students/students.component';
import {StudentsContComponent} from './teacher/students/students-cont.component';
import {AppRoutingModule} from './app-routing-module';
import {HomeComponent} from './home/home.component';
import {PageNotFoundComponent} from './page-not-found.component';
import {VmsComponent} from './vms/teacher/vms-teacher/vms.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {LoginDialogComponent, LoginDialogContentComponent} from './login/login-dialog/login-dialog.component';
import {JwtInterceptor} from './auth/JwtInterceptor';
import {TabComponentComponent} from './tab-component/tab-component.component';
import {RegistrationDialogComponent} from './login/registration-dialog/registration-dialog.component';
import {AddCourseDialogComponent} from './teacher/courses/add-course-dialog/add-course-dialog.component';
import {WelcomeComponent} from './welcome.component';
import {DeleteConfirmDialogComponent} from './teacher/courses/delete-confirm-dialog/delete-confirm-dialog.component';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import {ProfileViewComponent} from './profile-view/profile-view.component';
import {ProfileViewButtonComponent} from './profile-view/profile-view-button.component';
import {VmTableComponent} from './vms/teacher/vm-table/vm-table.component';
import {VmSubTableComponent} from './vms/teacher/vm-sub-table/vm-sub-table.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {EditCourseDialogComponent} from './teacher/courses/edit-course-dialog/edit-course-dialog.component';
import {TeamComponent} from './teams/team-student/team.component';
import {CreateTeamDialogComponent} from './teams/create-team-dialog/create-team-dialog.component';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {ShareDialogComponent} from './teacher/share-dialog/share-dialog.component';
import {ShareVmButtonComponent} from './teacher/share-dialog/share-vm-button';
import {ShareCourseButtonComponent} from './teacher/share-dialog/share-course-button';
import {VmModelsTableComponent} from './admin/vm-models-table/vm-models-table.component';
import {VmModelsComponent} from './admin/vm-models/vm-models.component';
import {VmsStudentsComponent} from './vms/student/vms-students/vms-students.component';
import {CreateVmDialogComponent} from './vms/student/create-vm-dialog/create-vm-dialog.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {TeamResourcesComponent} from './vms/team-resources/team-resources.component';
import {VmViewComponent} from './vms/vm-view/vm-view.component';
import {VmEditResourcesComponent} from './vms/teacher/vm-edit-resources/vm-edit-resources.component';
import {TokenComponent} from './token/token.component';
import {AssignmentSComponent} from './assignments/student/assignment-s/assignment-s.component';
import {DraftSComponent} from './assignments/student/draft-s/draft-s.component';
import {AddAssignmentDialogComponent} from './assignments/teacher/add-assignment-dialog/add-assignment-dialog.component';
import {AddDraftDialogComponent} from './assignments/student/draft-s/add-draft-dialog/add-draft-dialog.component';
import {AddVmModelComponent} from './admin/add-vm-model/add-vm-model.component';
import {AddVmModelVersionsComponent} from './admin/add-vm-model-versions/add-vm-model-versions.component';
import {AssignmentsContComponent} from './assignments/teacher/assignments-cont.component';
import {AssignmentComponent} from './assignments/teacher/assignment.component';
import {ProfessorTeamsComponent} from './teams/professor-teams/professor-teams.component';
import {TeamCardComponent} from './teams/team-card/team-card.component';
import {ProfessorsContComponent} from './admin/professors-cont/professors-cont.component';
import {UsersTableComponent} from './users-table/users-table.component';
import {AdminResourcesComponent} from './admin/admin-resources/admin-resources.component';
import {MatMenuModule} from '@angular/material/menu';
import {NotificationsMenuComponent} from './notifications/notifications-menu.component';
import {NotificationCardComponent} from './notifications/content/notification-card.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import {DeleteVersionComponent} from './admin/delete-version/delete-version.component';
import {AssignmentStudentsComponent} from './assignments/teacher/assignment-students/assignment-students.component';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import {DraftEvaluateComponent} from './assignments/teacher/draft-evaluate/draft-evaluate.component';
import {DraftHistoryComponent} from './assignments/teacher/draft-history/draft-history.component';
import {DraftViewComponent} from './assignments/draft-view/draft-view.component';
import {AssignmentViewComponent} from './assignments/assignment-view/assignment-view.component';
import {MatBadgeModule} from '@angular/material/badge';
import {CorrectionViewComponent} from './assignments/correction-view/correction-view.component';
import {EnrollCourseDialogComponent} from './student/enroll-course-dialog/enroll-course-dialog.component';
import {BaseViewComponent} from './base-view/base-view.component';

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
    TeamComponent,
    WelcomeComponent,
    DeleteConfirmDialogComponent,
    ProfileViewComponent,
    ProfileViewButtonComponent,
    VmTableComponent,
    VmSubTableComponent,
    EditCourseDialogComponent,
    CreateTeamDialogComponent,
    VmsStudentsComponent,
    CreateVmDialogComponent,
    ShareDialogComponent,
    AssignmentComponent,
    AssignmentsContComponent,
    ShareDialogComponent,
    AssignmentSComponent,
    DraftSComponent,
    TeamResourcesComponent,
    VmViewComponent,
    VmEditResourcesComponent,
    TokenComponent,
    VmEditResourcesComponent,
    AddAssignmentDialogComponent,
    AssignmentViewComponent,
    AddDraftDialogComponent,
    TokenComponent,
    ShareVmButtonComponent,
    ShareCourseButtonComponent,
    VmModelsTableComponent,
    VmModelsComponent,
    AddVmModelComponent,
    AddVmModelVersionsComponent,
    ProfessorTeamsComponent,
    TeamCardComponent,
    ProfessorsContComponent,
    UsersTableComponent,
    AdminResourcesComponent,
    NotificationsMenuComponent,
    NotificationCardComponent,
    DeleteVersionComponent,
    AssignmentStudentsComponent,
    DraftEvaluateComponent,
    DraftHistoryComponent,
    DraftViewComponent,
    CorrectionViewComponent,
    EnrollCourseDialogComponent,
    BaseViewComponent
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
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMenuModule,
        MatGridListModule,
        MatExpansionModule,
        MaterialFileInputModule,
        MatBadgeModule
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
    },
    MatDatepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
