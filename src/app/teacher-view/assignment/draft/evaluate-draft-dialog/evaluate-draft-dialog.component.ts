import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Draft} from '../../../../models/draft.model';

@Component({
  selector: 'app-review-draft-dialog',
  templateUrl: './evaluate-draft-dialog.component.html',
  styleUrls: ['./evaluate-draft-dialog.component.css']
})
export class EvaluateDraftDialogComponent implements OnInit {
  correctness = new FormControl('', [Validators.required, Validators.min(0), Validators.max(30)]);
  usability = new FormControl('', [Validators.required, Validators.min(0), Validators.max(30)]);
  scalability = new FormControl('', [Validators.required, Validators.min(0), Validators.max(30)]);
  readability = new FormControl('', [Validators.required, Validators.min(0), Validators.max(30)]);
  efficiency = new FormControl('', [Validators.required, Validators.min(0), Validators.max(30)]);

  labelValue: string;
  draft: Draft;

  constructor() { }

  ngOnInit(): void {
  }

  evaluate(){
    // this.service.evaluate
  }

}
