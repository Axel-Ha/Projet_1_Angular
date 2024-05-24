import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[]> = of([]);
  public numberOfCountries$!: Observable<number>;
  public numberOfJOs$!: Observable<number[]>;
  public single: any[] = [];
  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.numberOfCountries$ = this.olympicService.getNumberOfCountries();
    this.numberOfJOs$ = this.olympicService.getNumberOfJOs();
    this.olympicService.getCountryAndTotalMedals().subscribe((data) => {
      this.single = data;
    });
  }

  // single = [
  //     { name: 'X', value: 2 },
  //     { name: 'Y', value: 2 },
  // ];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#ff7296', '#6c11ff', '#8dc5ff', '#3bff1b','#7e555f'],
  };

  onSelect(data: any): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    console.log(data)

  }

  onActivate(data: any): void {
    //  console.log(this.single)
    // console.log('Activate', data);
  }

  onDeactivate(data: any): void {


  }
}
