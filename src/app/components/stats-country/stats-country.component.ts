import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';

@Component({
  selector: 'app-stats-country',
  templateUrl: './stats-country.component.html',
  styleUrls: ['./stats-country.component.scss'],
})
export class StatsCountryComponent implements OnInit {
  @Input() countryName!: String;
  @Input() totalMedals$!: Observable<number>;
  @Input() totalAthletes$!: Observable<number>;
  @Input() totalEntries!: number;
  constructor() {}

  ngOnInit(): void {}
}
