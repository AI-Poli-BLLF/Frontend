import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftsSubTableComponent } from './drafts-sub-table.component';

describe('DraftComponent', () => {
  let component: DraftsSubTableComponent;
  let fixture: ComponentFixture<DraftsSubTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftsSubTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftsSubTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
