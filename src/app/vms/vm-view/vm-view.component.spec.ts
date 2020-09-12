import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmViewComponent } from './vm-view.component';

describe('VmViewComponent', () => {
  let component: VmViewComponent;
  let fixture: ComponentFixture<VmViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
