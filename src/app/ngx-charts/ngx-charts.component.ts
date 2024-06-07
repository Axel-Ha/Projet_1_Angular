import { Component, Input, OnInit } from '@angular/core';
import { CountryDetails, Olympic } from 'src/app/core/models/Olympic';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, map } from 'rxjs';
import { OlympicService } from '../core/services/olympic.service';

@Component({
  selector: 'app-ngx-charts',
  templateUrl: './ngx-charts.component.html',
  styleUrls: ['./ngx-charts.component.scss'],
})
export class NgxChartsComponent implements OnInit {
  @Input() dataCountries$!: Observable<{ name: string; value: number }[]>;
  @Input() dataDetailsCountry$!: Observable<CountryDetails[]>;
  @Input() whatIsIt!: string;

  public detailsCountry$!: Observable<CountryDetails[]>;
  public olympics$: Observable<Olympic[]> = of([]);

  // option for the chart
  public colorScheme = {
    domain: ['#ff7296', '#6c11ff', '#8dc5ff', '#3aaf1b', '#7e555f'],
  };

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics(); // On récupère les données des pays.
  }

  /**
   * Redirige vers la page de détail du pays.
   * @param data Données du pays.
   * @returns void
   */
  onSelect(data: { name: string; value: number }): void {
    this.olympicService.getCountryByName(data.name).subscribe((data) => {
      this.router.navigateByUrl(`detail/${data.id}`);
    });
  }
}
