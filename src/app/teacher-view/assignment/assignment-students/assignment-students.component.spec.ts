import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentStudentsComponent } from './assignment-students.component';

describe('AssignmentStudentsComponent', () => {
  let component: AssignmentStudentsComponent;
  let fixture: ComponentFixture<AssignmentStudentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentStudentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
