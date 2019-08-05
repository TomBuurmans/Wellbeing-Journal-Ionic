import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewlogPage } from './newlog.page';

describe('NewlogPage', () => {
  let component: NewlogPage;
  let fixture: ComponentFixture<NewlogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewlogPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewlogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
