import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserSuspendComponent } from './modal-user-suspend.component';

describe('ModalUserSuspendComponent', () => {
  let component: ModalUserSuspendComponent;
  let fixture: ComponentFixture<ModalUserSuspendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUserSuspendComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalUserSuspendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
