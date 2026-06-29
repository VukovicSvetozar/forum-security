import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCommentAddComponent } from './modal-comment-add.component';

describe('ModalCommentAddComponent', () => {
  let component: ModalCommentAddComponent;
  let fixture: ComponentFixture<ModalCommentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCommentAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalCommentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
