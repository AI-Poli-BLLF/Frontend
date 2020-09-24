import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmEditResourcesComponent } from './vm-edit-resources.component';

describe('VmEditResourcesComponent', () => {
  let component: VmEditResourcesComponent;
  let fixture: ComponentFixture<VmEditResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmEditResourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmEditResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
