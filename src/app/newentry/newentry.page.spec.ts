import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEntryPage } from './newentry.page';

describe('NewEntryPage', () => {
  let component: NewEntryPage;
  let fixture: ComponentFixture<NewEntryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEntryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEntryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
