import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssignmentDialogComponent } from './add-assignment-dialog.component';

describe('AddAssignmentDialogComponent', () => {
  let component: AddAssignmentDialogComponent;
  let fixture: ComponentFixture<AddAssignmentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAssignmentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssignmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
