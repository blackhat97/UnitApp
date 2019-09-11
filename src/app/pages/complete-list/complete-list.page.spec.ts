import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteListPage } from './complete-list.page';

describe('CompleteListPage', () => {
  let component: CompleteListPage;
  let fixture: ComponentFixture<CompleteListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
