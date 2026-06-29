import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserChangePermissionsComponent } from './modal-user-change-permissions.component';

describe('ModalUserChangePermissionsComponent', () => {
  let component: ModalUserChangePermissionsComponent;
  let fixture: ComponentFixture<ModalUserChangePermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUserChangePermissionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalUserChangePermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
