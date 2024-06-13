import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics$: Observable<Olympic[]> = of([]);
  public numberOfCountries$!: Observable<number>;
  public numberOfJOs$!: Observable<number[]>;
  public countryAndMedals$!: Observable<{ name: string; value: number }[]>;

  private subscriptions: Subscription = new Subscription();

  /**
   * Constructor of the HomeComponent.
   * @param olympicService Service to get the data of the countries.
   * @returns void
   */
  constructor(private olympicService: OlympicService) {}

  /**
   * Function called when the component is initialized.
   * We call the initialisation function.
   * @returns void
   */
  ngOnInit(): void {
    this.initialisation();
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
  private initialisation(): void {
    this.subscriptions.add(
      // We subscribe to the observable returned by the getOlympics function.
      this.olympicService.getOlympics().subscribe((data) => {
        this.olympics$ = of(data); //of operator converts the data to an observable.
      })
    );

    this.subscriptions.add(
      this.olympicService.getNumberOfCountries().subscribe((data) => {
        this.numberOfCountries$ = of(data);
      })
    );

    this.subscriptions.add(
      this.olympicService.getNumberOfJOs().subscribe((data) => {
        this.numberOfJOs$ = of(data);
      })
    );

    this.subscriptions.add(
      this.loadCountriesAndMedals().subscribe((data) => {
        this.countryAndMedals$ = of(data);
      })
    );
  }

  /**
   * Load the countries and the number of medals.
   * @returns Observable having the countries and the number of medals.
   */
  private loadCountriesAndMedals(): Observable<
    { name: string; value: number }[]
  > {
    return this.olympicService.getCountryAndTotalMedals().pipe(
      map((data: { name: string; value: number }[]) => {
        //Data we get from the getCountryAndTotalMedals function, we return them as they are to display them in the chart.
        return data;
      })
    );
  }
}
