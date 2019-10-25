import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicManagementComponent } from './basic-management.component';

describe('BasicManagementComponent', () => {
  let component: BasicManagementComponent;
  let fixture: ComponentFixture<BasicManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
