import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectionViewComponent } from './correction-view.component';

describe('CorrectionViewComponent', () => {
  let component: CorrectionViewComponent;
  let fixture: ComponentFixture<CorrectionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrectionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
