import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSeriesPage } from './time-series.page';

describe('TimeSeriesPage', () => {
  let component: TimeSeriesPage;
  let fixture: ComponentFixture<TimeSeriesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSeriesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSeriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
