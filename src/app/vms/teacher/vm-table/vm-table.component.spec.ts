import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmTableComponent } from './vm-table.component';

describe('VmTableComponent', () => {
  let component: VmTableComponent;
  let fixture: ComponentFixture<VmTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
