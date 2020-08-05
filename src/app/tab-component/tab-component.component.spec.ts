import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabComponentComponent } from './tab-component.component';

describe('TabComponentComponent', () => {
  let component: TabComponentComponent;
  let fixture: ComponentFixture<TabComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
