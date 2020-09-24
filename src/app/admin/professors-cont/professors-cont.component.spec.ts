import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorsContComponent } from './professors-cont.component';

describe('ProfessorsContComponent', () => {
  let component: ProfessorsContComponent;
  let fixture: ComponentFixture<ProfessorsContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfessorsContComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessorsContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
