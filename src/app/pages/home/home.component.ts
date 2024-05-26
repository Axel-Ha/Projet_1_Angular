import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[]> = of([]);
  public numberOfCountries$!: Observable<number>;
  public numberOfJOs$!: Observable<number[]>;
  public countryAndMedals!: {name: string; value: number;}[];

  constructor(private olympicService: OlympicService,private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.numberOfCountries$ = this.olympicService.getNumberOfCountries();
    this.numberOfJOs$ = this.olympicService.getNumberOfJOs();
    this.olympicService.getCountryAndTotalMedals().subscribe((data) => {
      this.countryAndMedals = data;
    });
  }


  // options for the chart
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  colorScheme = {
    domain: ['#ff7296', '#6c11ff', '#8dc5ff', '#3bff1b','#7e555f'],
  };

  onSelect(data: { name: string, value : number }): void {
     this.olympicService.getCountryByName(data.name).subscribe((data) => {
      this.router.navigateByUrl(`detail/${data.id}`);
    });
  }

  // onActivate(data: any): void {}
  // onDeactivate(data: any): void { }
}
