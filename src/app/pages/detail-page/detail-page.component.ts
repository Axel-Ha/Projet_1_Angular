import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Olympic, CountryDetails } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

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

  // option for the chart
  public colorScheme = {
    domain: ['#ff7296'],
  };

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const countryId = +this.route.snapshot.params['id'];
    this.country$ = this.olympicService.getCountryById(countryId); // On récupère les données du pays.
    this.totalMedals$ = this.olympicService.getTotalMedals(countryId); // On récupère le nombre de médailles.
    this.totalAthletes$ = this.olympicService.getTotalAthletes(countryId); // On récupère le nombre d'athlètes.
    this.detailsCountry$ = this.loadDetailsCountry(countryId); // On récupère les informations du pays.
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
