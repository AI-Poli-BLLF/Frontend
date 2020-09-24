import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {CourseService} from '../../services/course.service';
import {VmModel} from '../../models/vm.model.model';

@Component({
  selector: 'app-vm-view',
  templateUrl: './vm-view.component.html',
  styleUrls: ['./vm-view.component.css']
})
// componente che permette la visione dello screen della vm
// con in sovraimpressione il nome del corso, il modello e la versione
// view in comune tra studenti, professori e admin
// poichè secondo le specifiche non si ritiene attuabile l’avvio
// e il collegamento ad una VM reale, abbiamo utilizzato degli screenshots
// placeholder per i sistemi operativi più diffusi e un'immagine di default per gli altri
export class VmViewComponent {
  sub: Subscription;
  sub2: Subscription;
  vmModel: VmModel = new VmModel('', '', '');
  courseName: string;
  vmId: number;
  vmImgPath = 'defaultOs.jpg';

  constructor(private route: ActivatedRoute, private courseService: CourseService) {
    this.sub = this.route.parent.params.subscribe(params => {
      this.courseName = params.name;
      this.getModel(this.courseName);
    });
    this.sub2 = this.route.params.subscribe(params => this.vmId = params.id);
  }

  getModel(courseName): void {
    this.courseService.getCourseVmModel(courseName)
      .subscribe(
        data => {
          this.vmModel = data;
          this.chooseImg(data);
        },
        error => this.vmModel = new VmModel(undefined, 'Error', '')
      );
  }

  chooseImg(vmModel: VmModel){
    // console.log(vmModel);
    switch (vmModel.os) {
      case 'Ubuntu':
        this.vmImgPath = 'ubuntu2004.png';
        break;
      case 'Windows':
        this.vmImgPath = 'w10.png';
        break;
      case 'Android':
        this.vmImgPath = 'android.png';
        break;
      case 'MacOS':
        this.vmImgPath = 'macOS.jpg';
        break;
      default:
        this.vmImgPath = 'defaultOs.jpg';
    }
  }

}
