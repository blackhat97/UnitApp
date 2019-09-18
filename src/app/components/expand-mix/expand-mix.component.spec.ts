import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandMixComponent } from './expand-mix.component';

describe('ExpandMixComponent', () => {
  let component: ExpandMixComponent;
  let fixture: ComponentFixture<ExpandMixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandMixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandMixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
