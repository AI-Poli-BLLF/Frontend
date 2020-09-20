import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentViewComponent } from './assignment-view.component';

describe('AssignmentViewComponent', () => {
  let component: AssignmentViewComponent;
  let fixture: ComponentFixture<AssignmentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
