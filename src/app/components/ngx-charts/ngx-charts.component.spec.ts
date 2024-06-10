import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxChartsComponent } from './ngx-charts.component';

describe('NgxChartsComponent', () => {
  let component: NgxChartsComponent;
  let fixture: ComponentFixture<NgxChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxChartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
