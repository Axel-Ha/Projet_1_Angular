import { Component, OnInit, HostListener } from '@angular/core';
import { Observable, of, map } from 'rxjs';
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
  public countryAndMedals$!: Observable<{ name: string; value: number }[]>;
  public viewTab!: [number, number];

  // options for the chart
  public gradient = true;
  public showLabels = true;
  public isDoughnut = false;
  public colorScheme = {
    domain: ['#ff7296', '#6c11ff', '#8dc5ff', '#3aaf1b', '#7e555f'],
  };

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.numberOfCountries$ = this.olympicService.getNumberOfCountries();
    this.numberOfJOs$ = this.olympicService.getNumberOfJOs();
    this.countryAndMedals$ = this.loadCountriesMedals();
  }
  private loadCountriesMedals(): Observable<{ name: string; value: number }[]> {
    return this.olympicService.getCountryAndTotalMedals().pipe(
      map((data: { name: string; value: number }[]) => {
        return data;
      })
    );
  }
  onSelect(data: { name: string; value: number }): void {
    this.olympicService.getCountryByName(data.name).subscribe((data) => {
      this.router.navigateByUrl(`detail/${data.id}`);
    });
  }
}
