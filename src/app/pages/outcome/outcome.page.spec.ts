import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutcomePage } from './outcome.page';

describe('OutcomePage', () => {
  let component: OutcomePage;
  let fixture: ComponentFixture<OutcomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutcomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutcomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
