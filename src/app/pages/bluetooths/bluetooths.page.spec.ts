import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BluetoothsPage } from './bluetooths.page';

describe('BluetoothsPage', () => {
  let component: BluetoothsPage;
  let fixture: ComponentFixture<BluetoothsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BluetoothsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BluetoothsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
