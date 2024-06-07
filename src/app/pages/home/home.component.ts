import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics(); // On récupère les données des pays.
    this.numberOfCountries$ = this.olympicService.getNumberOfCountries(); // On récupère le nombre de pays.
    this.numberOfJOs$ = this.olympicService.getNumberOfJOs(); // On récupère le nombre de JO.
    this.countryAndMedals$ = this.loadCountriesMedals(); // On récupère les pays et le nombre de médailles.
  }

  ngOnDestroy(): void {}

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
