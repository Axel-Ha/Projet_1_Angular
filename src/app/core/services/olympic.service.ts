import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic, CountryDetails } from '../models/Olympic';
import { Participation } from '../models/Participation';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]); // BehaviorSubject contenant un tableau d'objets Olympic
  constructor(private http: HttpClient) {}

  /**
   * Renvoie un Observable qui émet un tableau d'objets Olympic
   * @param value Valeur à émettre.
   * @param caught Observable à émettre.
   * @returns Observable contenant un tableau d'objets Olympic.
   */
  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Return le nombre de Pays total.
   * @returns Observable contenant le nombre de pays.
   */
  getNumberOfCountries(): Observable<number> {
    return this.olympics$.pipe(map((countries) => countries.length));
  }

  /**
   * Return les informations d'un pays par son Id.
   * @param countryId Id du pays.
   * @returns Observable contenant les informations d'un pays.
   */
  getCountryById(countryId: number): Observable<Olympic> {
    return this.olympics$.pipe(
      map(
        (countries) =>
          countries.find((country) => country.id === countryId) || {
            id: -1,
            country: 'Not Found',
            participations: [],
            numberOfParticipation: 0,
          }
      )
    );
  }

  /**
   * Return les informations d'un pays par son nom.
   * @param countryName Nom du pays.
   * @returns Observable contenant les informations d'un pays.
   */
  getCountryByName(countryName: string): Observable<Olympic> {
    return this.olympics$.pipe(
      map(
        (countries) =>
          countries.find((country) => country.country === countryName) || {
            id: -1,
            country: 'Not Found',
            participations: [],
            numberOfParticipation: 0,
          }
      )
    );
  }

  /**
   * Return les informations des JO d'un pays.
   * @param countryId Id du pays.
   * @returns Observable contenant les informations des JO d'un pays.
   */
  getDetailsCountry(countryId: number): Observable<CountryDetails> {
    return this.getCountryById(countryId).pipe(
      map((country) => {
        return {
          name: country.country,
          series: this.getYearsAndMedals(country.participations), // Récupère les années et le nombre de médailles
        };
      })
    );
  }

  /**
   * Return les années et le nombre de médailles d'un pays.
   * @param country Les participations du pays.
   * @returns Tableau d'objets contenant les années et le nombre de médailles.
   */
  getYearsAndMedals(
    country: Participation[]
  ): { name: string; value: number }[] {
    return country.map((participation) => {
      return {
        name: participation.year.toString(),
        value: participation.medalsCount,
      };
    });
  }

  /**
   * Return le nombre total de médailles d'un pays.
   * @param countryId Id du pays.
   * @returns Observable contenant le nombre total de médailles.
   */
  getTotalMedals(countryId: number): Observable<number> {
    const currentCountry = this.getCountryById(countryId);
    return currentCountry.pipe(
      map((country) => {
        return country.participations.reduce((totalMedals, participation) => {
          // Réduit les participations pour obtenir le nombre total de médailles
          return totalMedals + participation.medalsCount;
        }, 0);
      })
    );
  }

  /**
   * Return le nombre total d'athlètes d'un pays.
   * @param countryId Id du pays.
   * @returns Observable contenant le nombre total d'athlètes.
   */
  getTotalAthletes(countryId: number): Observable<number> {
    const currentCountry = this.getCountryById(countryId);
    return currentCountry.pipe(
      map((country) => {
        // Réduit les participations pour obtenir le nombre total d'athlètes
        return country.participations.reduce((totalAthletes, participation) => {
          return totalAthletes + participation.athleteCount;
        }, 0);
      })
    );
  }

  /**
   * Return le nombre total de JO.
   * @returns Observable contenant le nombre total de JO.
   */
  getNumberOfJOs(): Observable<number[]> {
    return this.olympics$.pipe(
      map(
        (countries) =>
          countries.map((country) => country.participations.length).slice(0, 1) // Récupère le nombre de JO du premier pays
      )
    );
  }

  /**
   * Return le nombre total de médailles par pays.
   * @returns Observable contenant le nombre total de médailles par pays.
   */
  getCountryAndTotalMedals(): Observable<{ name: string; value: number }[]> {
    return this.olympics$.pipe(
      map((countries) => {
        return countries.map((country) => {
          return {
            name: country.country,
            value: country.participations.reduce(
              // Réduit les participations pour obtenir le nombre total de médailles du pays
              (totalMedals, participation) => {
                return totalMedals + participation.medalsCount;
              },
              0
            ),
          };
        });
      })
    );
  }

  /**
   * Donne un moyen d'observer les données olympiques actuelles sous forme d'observable.
   * @returns Observable contenant un tableau d'objets Olympic.
   */
  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }
}
