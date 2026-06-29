import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserVerificationComponent } from './modal-user-verification.component';

describe('ModalUserVerificationComponent', () => {
  let component: ModalUserVerificationComponent;
  let fixture: ComponentFixture<ModalUserVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUserVerificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalUserVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
