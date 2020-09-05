import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVmDialogComponent } from './create-vm-dialog.component';

describe('CreateVmDialogComponent', () => {
  let component: CreateVmDialogComponent;
  let fixture: ComponentFixture<CreateVmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
