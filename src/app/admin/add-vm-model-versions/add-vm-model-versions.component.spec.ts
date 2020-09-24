import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVmModelVersionsComponent } from './add-vm-model-versions.component';

describe('AddVmModelVersionsComponent', () => {
  let component: AddVmModelVersionsComponent;
  let fixture: ComponentFixture<AddVmModelVersionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVmModelVersionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVmModelVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
