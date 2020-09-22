import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftEvaluateComponent } from './draft-evaluate.component';

describe('DraftEvaluateComponent', () => {
  let component: DraftEvaluateComponent;
  let fixture: ComponentFixture<DraftEvaluateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftEvaluateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftEvaluateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
