import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCommentEditComponent } from './modal-comment-edit.component';

describe('ModalCommentEditComponent', () => {
  let component: ModalCommentEditComponent;
  let fixture: ComponentFixture<ModalCommentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCommentEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalCommentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
