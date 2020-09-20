import { Component, OnInit } from '@angular/core';
import {VmModel} from '../../models/vm.model.model';
import {CourseService} from '../../services/course.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {VmModelsList} from '../../models/vm.models.list.model';

@Component({
  selector: 'app-vm-models',
  templateUrl: './vm-models.component.html',
  styleUrls: ['./vm-models.component.css']
})
export class VmModelsComponent implements OnInit {
 vmModelsList: VmModelsList[] = [];
  constructor(private courseService: CourseService, private snackBar: MatSnackBar) {
    courseService.getAllVmModels()
      .subscribe(
        data => this.vmModelsList = data,
        error => {
          this.snackBar.open('Errore caricamento modelli vm', 'Chudi');
          this.vmModelsList = [];
          console.log(error);
        }
      );
  }

  ngOnInit(): void {
  }

}
