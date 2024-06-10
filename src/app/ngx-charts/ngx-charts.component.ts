import { Component, Input, OnInit } from '@angular/core';
import { CountryDetails, Olympic } from 'src/app/core/models/Olympic';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
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

  private subscription: Subscription = new Subscription();

  // option for the chart
  public colorScheme = {
    domain: ['#ff7296', '#6c11ff', '#8dc5ff', '#3aaf1b', '#7e555f'],
  };
  /**
   * Constructeur du composant.
   * @param olympicService Service permettant de récupérer les données des JO.
   * @param router Service permettant de naviguer vers une autre page.
   * @returns void
   */
  constructor(private olympicService: OlympicService, private router: Router) {}

  /**
   * Méthode appelée à l'initialisation du composant.
   * On récupère les données du pays.
   * On abonne l'observables à `subscription`.
   * @returns void
   */
  ngOnInit(): void {
    this.subscription.add(
      // On récupère les données des pays.
      this.olympicService.getOlympics().subscribe((data) => {
        this.olympics$ = of(data);
      })
    );
  }

  /**
   * Méthode appelée à la destruction du composant.
   * On annule tous les abonnements ajoutés à `subscriptions`.
   * @returns void
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
