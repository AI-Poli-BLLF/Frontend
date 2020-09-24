import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftSComponent } from './draft-s.component';

describe('DraftSComponent', () => {
  let component: DraftSComponent;
  let fixture: ComponentFixture<DraftSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
