import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentGopYComponent } from './comment-gop-y.component';

describe('CommentGopYComponent', () => {
  let component: CommentGopYComponent;
  let fixture: ComponentFixture<CommentGopYComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentGopYComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentGopYComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
