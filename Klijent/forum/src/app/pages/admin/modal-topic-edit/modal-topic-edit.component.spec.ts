import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTopicEditComponent } from './modal-topic-edit.component';

describe('ModalTopicEditComponent', () => {
  let component: ModalTopicEditComponent;
  let fixture: ComponentFixture<ModalTopicEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTopicEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalTopicEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
