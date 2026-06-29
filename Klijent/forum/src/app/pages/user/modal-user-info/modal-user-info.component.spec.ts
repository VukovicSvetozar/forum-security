import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserInfoComponent } from './modal-user-info.component';

describe('ModalUserInfoComponent', () => {
  let component: ModalUserInfoComponent;
  let fixture: ComponentFixture<ModalUserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUserInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
