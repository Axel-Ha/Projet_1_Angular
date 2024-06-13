import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, map } from 'rxjs';
import { Olympic, CountryDetails } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Subscription } from 'rxjs';

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

  private subscriptions: Subscription = new Subscription();

  // option for the chart
  public colorScheme = {
    domain: ['#ff7296'],
  };

  /**
   * Constructor of the HomeComponent.
   * @param olympicService Service to get the data of the countries.
   * @param route to get the parameters of the URL.
   * @returns void
   */
  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
  ) {}

  /**
   * Function called when the component is initialized.
   * We call the initialisation function.
   * @returns void
   */
  ngOnInit(): void {
    const countryId = +this.route.snapshot.params['id'];

    this.initialisation(countryId);
  }
  /**
   * Function called when the component is destroyed.
   * We unsubscribe to the observables.
   * @returns void
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Initialisation of the component.
   * Getting the data of the countries, the number of countries, the number of JOs and the countries and the number of medals.
   * We subscribe to the observables returned by the functions.
   * @returns void
   */
  private initialisation(countryId: number) {
    this.subscriptions.add(
      // We subscribe to the observable returned by the getOlympics function.
      this.olympicService.getCountryById(countryId).subscribe((data) => {
        this.country$ = of(data); //of operator converts the data to an observable.
      })
    );
    this.subscriptions.add(
      this.olympicService.getTotalMedals(countryId).subscribe((data) => {
        this.totalMedals$ = of(data);
      })
    );
    this.subscriptions.add(
      this.olympicService.getTotalAthletes(countryId).subscribe((data) => {
        this.totalAthletes$ = of(data);
      })
    );

    this.subscriptions.add(
      this.loadDetailsCountry(countryId).subscribe((data) => {
        this.detailsCountry$ = of(data);
      })
    );
    this.detailsCountry$ = this.loadDetailsCountry(countryId);
  }

  /**
   * Return country information.
   * @param countryId Id of the country.
   * @returns Observable having the country information.
   */
  private loadDetailsCountry(countryId: number): Observable<CountryDetails[]> {
    return this.olympicService.getDetailsCountry(countryId).pipe(
      map((data: CountryDetails) => {
        //Data we get from the getDetailsCountry function, we return them as they are to display them in the chart.
        return [data];
      })
    );
  }
}
