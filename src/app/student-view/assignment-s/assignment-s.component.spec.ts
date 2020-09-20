import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentSComponent } from './assignment-s.component';

describe('AssignmentSComponent', () => {
  let component: AssignmentSComponent;
  let fixture: ComponentFixture<AssignmentSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
