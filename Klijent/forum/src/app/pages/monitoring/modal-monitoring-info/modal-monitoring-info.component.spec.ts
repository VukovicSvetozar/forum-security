import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMonitoringInfoComponent } from './modal-monitoring-info.component';

describe('ModalMonitoringInfoComponent', () => {
  let component: ModalMonitoringInfoComponent;
  let fixture: ComponentFixture<ModalMonitoringInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalMonitoringInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalMonitoringInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
