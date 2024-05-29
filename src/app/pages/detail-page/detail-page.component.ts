import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Olympic,CountryDetails } from 'src/app/core/models/Olympic';
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
  public detailsCountry$! : Observable<CountryDetails[]>;
  public viewTab!: [number, number];

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
  ) {
    this.checkDeviceType();
  }

  ngOnInit(): void {
    const countryId = +this.route.snapshot.params['id'];
    this.country$ = this.olympicService.getCountryById(countryId);
    this.totalMedals$ = this.olympicService.getTotalMedals(countryId);
    this.totalAthletes$ = this.olympicService.getTotalAthletes(countryId);
    this.detailsCountry$ = this.olympicService.getDetailsCountry(countryId).pipe(map((data : CountryDetails) => {
       return [data]; 
    }) )
  }
  

  checkDeviceType() : void {
    const width = window.innerWidth;
    if (width < 600) {
      this.viewTab = [500, 400];
    } else if (width >= 600 && width < 1200) {
      this.viewTab = [600, 400];
    } else {
      this.viewTab = [700, 500];
    }
  }

  // options for the chart
  view = this.viewTab;
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';
  yAxisLabel: string = 'Medals';
  timeline: boolean = true;
  colorScheme = {
    domain: ['#ff7296', '#6c11ff', '#8dc5ff', '#3bff1b', '#7e555f'],
  };
}
