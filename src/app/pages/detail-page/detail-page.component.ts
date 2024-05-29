import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss'],
})
export class DetailPageComponent implements OnInit {
  public totalMedals?: Observable<number>;
  public totalAthletes?: Observable<number>;
  public country$!: Observable<Olympic>;
  public countryId!: number;
  public countryName!: string;
  public detailsCountry$!: { name: string; series: { name: string; value: number }[] }[];
  public viewTab!: [number, number];
  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
  ) {
    this.checkDeviceType();
  }

  ngOnInit(): void {
    this.countryId = +this.route.snapshot.params['id'];
    this.country$ = this.olympicService.getCountryById(this.countryId);
    this.totalMedals = this.olympicService.getTotalMedals(this.countryId);
    this.totalAthletes = this.olympicService.getTotalAthletes(this.countryId);
    this.olympicService.getDetailsCountry(this.countryId).subscribe((data) => {
      this.detailsCountry$ = [{
        name: data.name,
        series: data.series,
      }];
    });
  }
  

  checkDeviceType() {
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
