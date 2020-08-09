import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-home',
  template: '<h2>Home component works!!</h2><p>Qui si potrebbe spiegare all\'utente cosa può fare.</p>',
  styleUrls: []
})
export class HomeComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
  }
}
