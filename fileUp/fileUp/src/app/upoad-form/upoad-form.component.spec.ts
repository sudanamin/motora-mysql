import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpoadFormComponent } from './upoad-form.component';

describe('UpoadFormComponent', () => {
  let component: UpoadFormComponent;
  let fixture: ComponentFixture<UpoadFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpoadFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpoadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
