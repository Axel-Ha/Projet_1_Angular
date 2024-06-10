import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
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
   * Constructeur du composant.
   * @param olympicService Service permettant de récupérer les données des JO.
   * @returns void
   */
  constructor(private olympicService: OlympicService) {}

  /**
   * Méthode appelée à l'initialisation du composant.
   * On récupère les données des pays, le nombre de pays, le nombre de JO et les pays et le nombre de médailles.
   * On les stocke dans des variables pour les afficher dans le template.
   * On abonne les observables à `subscriptions`.
   * @returns void
   */
  ngOnInit(): void {
    this.subscriptions.add(
      // On récupère les données des pays.
      this.olympicService.getOlympics().subscribe((data) => {
        this.olympics$ = of(data);
      })
    );

    this.subscriptions.add(
      // On récupère le nombre de pays.
      this.olympicService.getNumberOfCountries().subscribe((data) => {
        this.numberOfCountries$ = of(data);
      })
    );

    this.subscriptions.add(
      // On récupère le nombre de JO.
      this.olympicService.getNumberOfJOs().subscribe((data) => {
        this.numberOfJOs$ = of(data);
      })
    );

    this.subscriptions.add(
      // On récupère les pays et le nombre de médailles.
      this.loadCountriesMedals().subscribe((data) => {
        this.countryAndMedals$ = of(data);
      })
    );
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
   * Return les pays et le nombre de médailles.
   * @returns Observable contenant les pays et le nombre de médailles.
   */
  private loadCountriesMedals(): Observable<{ name: string; value: number }[]> {
    return this.olympicService.getCountryAndTotalMedals().pipe(
      map((data: { name: string; value: number }[]) => {
        //Données qu'on récupère de la faction getCountryAndTotalMedals, on les renvoie telles quelles pour les afficher dans le graphique.
        return data;
      })
    );
  }
}
