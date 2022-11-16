import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ImportAreaComponent} from './import-area.component';

describe('ImportAreaComponent', () => {
  let component: ImportAreaComponent;
  let fixture: ComponentFixture<ImportAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportAreaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
