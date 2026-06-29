import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserDeactivateComponent } from './modal-user-deactivate.component';

describe('ModalUserDeactivateComponent', () => {
  let component: ModalUserDeactivateComponent;
  let fixture: ComponentFixture<ModalUserDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUserDeactivateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalUserDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
