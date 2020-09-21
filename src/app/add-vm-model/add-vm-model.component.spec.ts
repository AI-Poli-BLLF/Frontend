import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVmModelComponent } from './add-vm-model.component';

describe('AddVmModelComponent', () => {
  let component: AddVmModelComponent;
  let fixture: ComponentFixture<AddVmModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVmModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVmModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
