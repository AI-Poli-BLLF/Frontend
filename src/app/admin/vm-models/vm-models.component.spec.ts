import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmModelsComponent } from './vm-models.component';

describe('VmModelsComponent', () => {
  let component: VmModelsComponent;
  let fixture: ComponentFixture<VmModelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmModelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
