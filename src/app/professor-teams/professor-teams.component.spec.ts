import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorTeamsComponent } from './professor-teams.component';

describe('ProfessorTeamsComponent', () => {
  let component: ProfessorTeamsComponent;
  let fixture: ComponentFixture<ProfessorTeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfessorTeamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessorTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
