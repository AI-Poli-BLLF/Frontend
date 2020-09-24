import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftHistoryComponent } from './draft-history.component';

describe('DraftHistoryComponent', () => {
  let component: DraftHistoryComponent;
  let fixture: ComponentFixture<DraftHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
