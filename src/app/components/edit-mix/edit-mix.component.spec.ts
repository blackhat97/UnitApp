import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMixComponent } from './edit-mix.component';

describe('EditMixComponent', () => {
  let component: EditMixComponent;
  let fixture: ComponentFixture<EditMixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
