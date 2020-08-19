import { Component, OnInit } from '@angular/core';
import {StudentService} from "../services/student.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  isEditing = false;
  editButton = 'Modifica';
  service: any;

  constructor(private authService: AuthService, private studentService: StudentService) {
    // switch (authService.getRole()) {
    //
    // }authService.getRole('ROLE_STUDENT')
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {

  }

  edit() {
    this.isEditing = !this.isEditing;
    this.editButton = this.isEditing ? 'Salva' : 'Modifica';
  }
}
