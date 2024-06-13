import { Component, Input, OnInit } from '@angular/core';
import { CountryDetails, Olympic } from 'src/app/core/models/Olympic';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { OlympicService } from '../../core/services/olympic.service';

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

  private subscription: Subscription = new Subscription();

  // option for the chart
  public colorScheme = {
    domain: ['#ff7296', '#6c11ff', '#8dc5ff', '#3aaf1b', '#7e555f'],
  };

  /**
   * Constructor of the HomeComponent.
   * @param olympicService Service to get the data of the countries.
   * @param route to get the parameters of the URL.
   * @returns void
   */
  constructor(private olympicService: OlympicService, private router: Router) {}

  /**
   * Function called when the component is initialized.
   * Get the data of the countries.
   * Observable is added to the subscriptions.
   * @returns void
   */
  ngOnInit(): void {
    this.subscription.add(
      // Get the data of the countries
      this.olympicService.getOlympics().subscribe((data) => {
        this.olympics$ = of(data);
      })
    );
  }

  /**
   * Function called when the component is destroyed.
   * We unsubscribe to the observables.
   * @returns void
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Redirect to the detail page of the country.
   * @param data data of the country.
   * @returns void
   */
  onSelect(data: { name: string; value: number }): void {
    this.olympicService.getCountryByName(data.name).subscribe((data) => {
      this.router.navigateByUrl(`detail/${data.id}`);
    });
  }
}
