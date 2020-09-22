import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateDraftDialogComponent } from './evaluate-draft-dialog.component';

describe('ReviewDraftDialogComponent', () => {
  let component: EvaluateDraftDialogComponent;
  let fixture: ComponentFixture<EvaluateDraftDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateDraftDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateDraftDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
