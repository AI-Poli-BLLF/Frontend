import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Vm} from '../../models/vm.model';
import {Student} from '../../models/student.model';
import {FormControl, Validators} from '@angular/forms';
import {VmConfig} from '../../models/vm.config.model';
import {CourseService} from '../../services/course.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-vm-sub-table',
  templateUrl: './vm-sub-table.component.html',
  styleUrls: ['./vm-sub-table.component.css']
})
export class VmSubTableComponent implements OnInit{
  cpuValidator = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(8)]);
  diskValidator = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(512)]);
  ramValidator = new FormControl('', [Validators.required, Validators.minLength(128), Validators.maxLength(10240)]);

  @Input()
  vmConfig: VmConfig;
  @Input()
  courseName: string;

  @Output()
  updateElement = new EventEmitter<VmConfig>();

  vmConfigNew: VmConfig;

  columnsToDisplay: string[] = ['id', 'creator', 'state', 'cpu', 'ramSize', 'diskSize'];
  dataSource: Vm[];

  constructor(
    private courseService: CourseService,
    private snackBar: MatSnackBar) {
  }

  save(){
    this.courseService.editCourseVmConfig(this.courseName, this.vmConfigNew.teamId, this.vmConfigNew.groupName, this.vmConfigNew)
      .subscribe(
        data => {
          // console.log(data);
          this.updateElement.emit(data);
        },
        error => {
          // console.log(error);
          this.snackBar.open('Si è verificato un errore.', 'Chiudi');
        }
      );
  }

  ngOnInit(): void {
    this.courseService.getTeamVMs(this.courseName, this.vmConfig.teamId)
      .subscribe(vm => this.dataSource = vm);
    this.vmConfigNew = new VmConfig(
      this.vmConfig.id, this.vmConfig.teamId, this.vmConfig.groupName,
      this.vmConfig.maxCpu, this.vmConfig.maxRam, this.vmConfig.maxDisk,
      this.vmConfig.maxVm, this.vmConfig.maxActive
    );
    // console.log(this.vmConfigNew);
  }
}
