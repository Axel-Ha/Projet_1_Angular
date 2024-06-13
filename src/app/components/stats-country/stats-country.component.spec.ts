import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsCountryComponent } from './stats-country.component';

describe('StatsCountryComponent', () => {
  let component: StatsCountryComponent;
  let fixture: ComponentFixture<StatsCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsCountryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
