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

  // option for the chart
  public colorScheme = {
    domain: ['#ff7296', '#6c11ff', '#8dc5ff', '#3aaf1b', '#7e555f'],
  };

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics(); // On récupère les données des pays.
    this.numberOfCountries$ = this.olympicService.getNumberOfCountries(); // On récupère le nombre de pays.
    this.numberOfJOs$ = this.olympicService.getNumberOfJOs(); // On récupère le nombre de JO.
    this.countryAndMedals$ = this.loadCountriesMedals(); // On récupère les pays et le nombre de médailles.
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
