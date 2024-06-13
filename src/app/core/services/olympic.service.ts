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
  private olympics$ = new BehaviorSubject<Olympic[]>([]); // BehaviorSubject Array of Olympic objects.
  constructor(private http: HttpClient) {}

  /**
   * Return observable that emits an array of Olympic objects.
   * @param value value to emit.
   * @param caught error to emit.
   * @returns Observable contenant un tableau d'objets Olympic.
   */
  loadInitialData() {
    // Initialisation of an HTTP request to get the olympic data
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)), // The BehaviorSubject (olympics$) is updated with the received data.
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Return the number of countries.
   * @returns Observable having the number of countries.
   */
  getNumberOfCountries(): Observable<number> {
    return this.olympics$.pipe(map((countries) => countries.length));
  }

  /**
   * Return the details of a country or a default object.
   * @param countryId Id of the country.
   * @returns Observable having the informations of a country.

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
   * Return the informations of a country or a default object .
   * @param countryName Name of the country.
   * @returns Observable having the informations of a country.
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
   * Return the details of a country or a default object.
   * @param countryId Id of the country.
   * @returns Observable having the details of a country.
   */
  getDetailsCountry(countryId: number): Observable<CountryDetails> {
    return this.getCountryById(countryId).pipe(
      map((country) => {
        return {
          name: country.country,
          series: this.getYearsAndMedals(country.participations),
        };
      })
    );
  }

  /**
   * Return the years and Medals.
   * @param country participations of a country.
   * @returns Array of years and medals.
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
   * Return the number of medals of a country.
   * @param countryId Id of the country.
   * @returns Observable having the number of medals.
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
   * Return the number of athletes of a country.
   * @param countryId Id of the country.
   * @returns Observable having the number of athletes.
   */
  getTotalAthletes(countryId: number): Observable<number> {
    const currentCountry = this.getCountryById(countryId);
    return currentCountry.pipe(
      map((country) => {
        // Reduces the participations to get the total number of athletes
        return country.participations.reduce((totalAthletes, participation) => {
          return totalAthletes + participation.athleteCount;
        }, 0);
      })
    );
  }

  /**
   * Return the number of JOs.
   * @returns Observable having the number of JOs.
   */
  getNumberOfJOs(): Observable<number[]> {
    return this.olympics$.pipe(
      map(
        (countries) =>
          countries.map((country) => country.participations.length).slice(0, 1) // Get the first country only for the number of JOs.
      )
    );
  }

  /**
   * Return the countries and the number of medals.
   * @returns Observable having the countries and the number of medals.
   */
  getCountryAndTotalMedals(): Observable<{ name: string; value: number }[]> {
    return this.olympics$.pipe(
      map((countries) => {
        return countries.map((country) => {
          return {
            name: country.country,
            value: country.participations.reduce(
              // Reduces the participations to get the total number of medals of the country
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
   * Give a way to observe the current Olympic data as an observable.
   * @returns Observable of Olympic objects.
   */
  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }
}
