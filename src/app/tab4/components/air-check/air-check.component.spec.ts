import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirCheckComponent } from './air-check.component';

describe('AirCheckComponent', () => {
  let component: AirCheckComponent;
  let fixture: ComponentFixture<AirCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
