import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmModelsTableComponent } from './vm-models-table.component';

describe('VmModelsTableComponent', () => {
  let component: VmModelsTableComponent;
  let fixture: ComponentFixture<VmModelsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmModelsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmModelsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
