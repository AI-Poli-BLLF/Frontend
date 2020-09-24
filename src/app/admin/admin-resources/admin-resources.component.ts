import { Component, OnInit } from '@angular/core';
import {AdminService} from '../../services/admin.service';
import {VmConfig} from '../../models/vm.config.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-resources',
  templateUrl: './admin-resources.component.html',
  styleUrls: ['./admin-resources.component.css']
})
export class AdminResourcesComponent implements OnInit {
  total: VmConfig = new VmConfig(-1, undefined, undefined, 100, 1048576, 100 * 1024, 10000, 1000);
  used: VmConfig = new VmConfig(-1, undefined, undefined, 0, 0, 0, 0, 0);
  reserved: VmConfig = new VmConfig(-1, undefined, undefined, 0, 0, 0, 0, 0);
  allocated: VmConfig = new VmConfig(-1, undefined, undefined, 0, 0, 0, 0, 0);
  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {
    adminService.getReservedResources()
      .subscribe(
        data => this.reserved = data,
        error => {
          console.log(error);
          snackBar.open('Impossibile caricare risorse riservate', 'Chiudi');
        }
      );
    adminService.getUsedResources()
      .subscribe(
        data => this.used = data,
        error => {
          console.log(error);
          snackBar.open('Impossibile caricare risorse usate', 'Chiudi');
        }
      );
    adminService.getAllocatedResources()
      .subscribe(
        data => this.allocated = data,
        error => {
          console.log(error);
          snackBar.open('Impossibile caricare risorse allocate', 'Chiudi');
        }
      );
  }

  ngOnInit(): void {
  }

}
