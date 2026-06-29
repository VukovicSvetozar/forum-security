import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTopicArchiveComponent } from './modal-topic-archive.component';

describe('ModalTopicArchiveComponent', () => {
  let component: ModalTopicArchiveComponent;
  let fixture: ComponentFixture<ModalTopicArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTopicArchiveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalTopicArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
