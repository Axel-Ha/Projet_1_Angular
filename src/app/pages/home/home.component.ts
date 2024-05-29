import { Component, OnInit, HostListener } from '@angular/core';
import { Observable, of , map} from 'rxjs';
import { OlympicService,  } from 'src/app/core/services/olympic.service';
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
  public countryAndMedals$!: Observable<{name: string; value: number;}[]>;
  public viewTab!: [number, number] 

  constructor(private olympicService: OlympicService, private route: ActivatedRoute, private router: Router) {
    this.checkDeviceType();
  }
  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.numberOfCountries$ = this.olympicService.getNumberOfCountries();
    this.numberOfJOs$ = this.olympicService.getNumberOfJOs();
    this.countryAndMedals$ = this.olympicService.getCountryAndTotalMedals().pipe(map((data : {name: string; value: number;}[]) => {
       return data;
    }))
  }
  checkDeviceType() : void {
    const width = window.innerWidth;
    if (width < 600) {
      this.viewTab = [400, 400];
    } else if (width >= 600 && width < 1200) {
      this.viewTab = [500, 400];
    } else {
      this.viewTab = [700, 500];
    }
  }

  // options for the chart
  view = this.viewTab
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  colorScheme = {
    domain: ['#ff7296', '#6c11ff', '#8dc5ff', '#3aaf1b','#7e555f'],
  };

  onSelect(data: { name: string, value : number }): void {
     this.olympicService.getCountryByName(data.name).subscribe((data) => {
      this.router.navigateByUrl(`detail/${data.id}`);
    });
  }

  // onActivate(data: any): void {}
  // onDeactivate(data: any): void { }
}
