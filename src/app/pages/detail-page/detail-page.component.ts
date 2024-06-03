import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Olympic, CountryDetails } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss'],
})
export class DetailPageComponent implements OnInit {
  public totalMedals$!: Observable<number>;
  public totalAthletes$!: Observable<number>;
  public country$!: Observable<Olympic>;
  public countryName!: string;
  public detailsCountry$!: Observable<CountryDetails[]>;
  public viewTab!: [number, number];

  public showLabels = true;
  public animations = true;
  public xAxis = true;
  public yAxis = true;
  public showYAxisLabel = true;
  public showXAxisLabel = true;
  public xAxisLabel = 'Dates';
  public yAxisLabel = 'Medals';
  public timeline = true;
  public colorScheme = {
    domain: ['#ff7296', '#6c11ff', '#8dc5ff', '#3bff1b', '#7e555f'],
  };

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const countryId = +this.route.snapshot.params['id'];
    this.country$ = this.olympicService.getCountryById(countryId);
    this.totalMedals$ = this.olympicService.getTotalMedals(countryId);
    this.totalAthletes$ = this.olympicService.getTotalAthletes(countryId);
    this.detailsCountry$ = this.loadDetailsCountry(countryId);
  }

  private loadDetailsCountry(countryId: number): Observable<CountryDetails[]> {
    return this.olympicService.getDetailsCountry(countryId).pipe(
      map((data: CountryDetails) => {
        return [data];
      })
    );
  }
}
