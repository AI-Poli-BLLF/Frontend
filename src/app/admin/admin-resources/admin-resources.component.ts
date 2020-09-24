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
  // ipotizzo una configurazione massima disponibile di 100 cpu, 1 TB di ram, 100 TB di HDD, 10000 vm di cui 1000 attive contemporaneamente
  total: VmConfig = new VmConfig(-1, undefined, undefined, 100, 1048576, 100 * 1024, 10000, 1000);
  used: VmConfig = new VmConfig(-1, undefined, undefined, 0, 0, 0, 0, 0);
  reserved: VmConfig = new VmConfig(-1, undefined, undefined, 0, 0, 0, 0, 0);
  allocated: VmConfig = new VmConfig(-1, undefined, undefined, 0, 0, 0, 0, 0);
  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {
    // alla costruzione dell'elemento vengono richiesti i dati al backend delle risorse
    // se si verificano errori li notifico con delle snackbar
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
