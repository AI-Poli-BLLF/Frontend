import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmSubTableComponent } from './vm-sub-table.component';

describe('VmSubTableComponent', () => {
  let component: VmSubTableComponent;
  let fixture: ComponentFixture<VmSubTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmSubTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmSubTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
