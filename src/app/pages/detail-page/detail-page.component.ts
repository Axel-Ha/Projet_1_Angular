import { Component, OnInit } from '@angular/core';
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
   * Constructeur du composant.
   * @param olympicService Service permettant de récupérer les données des JO.
   * @param route Service permettant de récupérer les paramètres de la route.
   * @returns void
   */
  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
  ) {}

  /**
   * Méthode appelée à l'initialisation du composant.
   * On récupère les données du pays, le nombre de médailles, le nombre d'athlètes et les informations du pays.
   * On les stocke dans des variables pour les afficher dans le template.
   * On abonne les observables à `subscriptions`.
   * @returns void
   */
  ngOnInit(): void {
    const countryId = +this.route.snapshot.params['id'];

    this.subscriptions.add(
      // On récupère les données du pays.
      this.olympicService.getCountryById(countryId).subscribe((data) => {
        this.country$ = of(data);
      })
    );
    this.subscriptions.add(
      // On récupère le nombre de médailles.
      this.olympicService.getTotalMedals(countryId).subscribe((data) => {
        this.totalMedals$ = of(data);
      })
    );
    this.subscriptions.add(
      // On récupère le nombre d'athlètes.
      this.olympicService.getTotalAthletes(countryId).subscribe((data) => {
        this.totalAthletes$ = of(data);
      })
    );

    this.subscriptions.add(
      // On récupère les informations du pays.
      this.loadDetailsCountry(countryId).subscribe((data) => {
        this.detailsCountry$ = of(data);
      })
    );
    this.detailsCountry$ = this.loadDetailsCountry(countryId);
  }

  /**
   * Méthode appelée à la destruction du composant.
   * On annule tous les abonnements ajoutés à `subscriptions`.
   * @returns void
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Return les informations du pays.
   * @param countryId Id du pays.
   * @returns Observable contenant les informations du pays.
   */
  private loadDetailsCountry(countryId: number): Observable<CountryDetails[]> {
    return this.olympicService.getDetailsCountry(countryId).pipe(
      map((data: CountryDetails) => {
        // On renvoie les données telles quelles pour les afficher dans le graphique.
        return [data];
      })
    );
  }
}
