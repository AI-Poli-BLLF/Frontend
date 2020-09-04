import {Component, Input, OnInit} from '@angular/core';
import {Vm} from '../../models/vm.model';
import {Student} from '../../models/student.model';
import {FormControl, Validators} from '@angular/forms';
import {VmConfig} from '../../models/vm.config.model';
import {CourseService} from '../../services/course.service';

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

  columnsToDisplay: string[] = ['id', 'creator', 'state', 'cpu', 'ramSize', 'diskSize'];
  dataSource: Vm[];

  constructor(private courseService: CourseService) {
  }

  ngOnInit(): void {
    this.courseService.getTeamVMs(this.courseName, this.vmConfig.teamId)
      .subscribe(vm => this.dataSource = vm);
  }
}
