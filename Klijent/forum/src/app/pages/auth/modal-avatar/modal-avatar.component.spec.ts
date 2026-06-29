import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAvatarComponent } from './modal-avatar.component';

describe('ModalAvatarComponent', () => {
  let component: ModalAvatarComponent;
  let fixture: ComponentFixture<ModalAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAvatarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
