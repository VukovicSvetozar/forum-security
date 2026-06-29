import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCommentDeleteComponent } from './modal-comment-delete.component';

describe('ModalCommentDeleteComponent', () => {
  let component: ModalCommentDeleteComponent;
  let fixture: ComponentFixture<ModalCommentDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCommentDeleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalCommentDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
