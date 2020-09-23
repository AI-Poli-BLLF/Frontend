import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftViewComponent } from './draft-view.component';

describe('DraftViewComponent', () => {
  let component: DraftViewComponent;
  let fixture: ComponentFixture<DraftViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
