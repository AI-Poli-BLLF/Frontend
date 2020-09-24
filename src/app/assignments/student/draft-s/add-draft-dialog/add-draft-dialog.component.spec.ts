import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDraftDialogComponent } from './add-draft-dialog.component';

describe('AddDraftDialogComponent', () => {
  let component: AddDraftDialogComponent;
  let fixture: ComponentFixture<AddDraftDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDraftDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDraftDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
