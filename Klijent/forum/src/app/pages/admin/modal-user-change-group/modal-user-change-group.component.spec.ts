import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserChangeGroupComponent } from './modal-user-change-group.component';

describe('ModalUserChangeGroupComponent', () => {
  let component: ModalUserChangeGroupComponent;
  let fixture: ComponentFixture<ModalUserChangeGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUserChangeGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalUserChangeGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
