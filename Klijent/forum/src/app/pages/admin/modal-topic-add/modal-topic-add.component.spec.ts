import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTopicAddComponent } from './modal-topic-add.component';

describe('ModalTopicAddComponent', () => {
  let component: ModalTopicAddComponent;
  let fixture: ComponentFixture<ModalTopicAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTopicAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalTopicAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
