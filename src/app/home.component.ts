import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-home',
  template: '<h2>Home component works!!</h2><p>Selected course: {{name}}</p>',
  styleUrls: []
})
export class HomeComponent implements OnInit {
  name  = '';

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => this.name = params.name);
  }

  ngOnInit(): void {
  }
}
