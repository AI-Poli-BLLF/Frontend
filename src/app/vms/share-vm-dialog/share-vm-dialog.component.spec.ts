import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareVmDialogComponent } from './share-vm-dialog.component';

describe('ShareVmDialogComponent', () => {
  let component: ShareVmDialogComponent;
  let fixture: ComponentFixture<ShareVmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareVmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareVmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
