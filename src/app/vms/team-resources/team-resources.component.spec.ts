import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamResourcesComponent } from './team-resources.component';

describe('TeamResourcesComponent', () => {
  let component: TeamResourcesComponent;
  let fixture: ComponentFixture<TeamResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamResourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
