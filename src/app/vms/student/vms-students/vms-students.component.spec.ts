import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmsStudentsComponent } from './vms-students.component';

describe('VmsStudentsComponent', () => {
  let component: VmsStudentsComponent;
  let fixture: ComponentFixture<VmsStudentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmsStudentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmsStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
