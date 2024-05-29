import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, observable, of } from 'rxjs';
import { catchError, count, map, tap } from 'rxjs/operators';
import { Olympic, CountryDetails } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);
  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      })
    );
  }
  getNumberOfCountries(): Observable<number> {
    return this.olympics$.pipe(map((countries) => countries.length));
  }

  getCountryById(countryId: number): Observable<Olympic> {
    return this.olympics$.pipe(
      map((countries) => {
        const country = countries.find((country) => country.id === countryId);
        if (country) {
          const updatedCountry = {
            ...country,
            numberOfParticipation: country.participations.length,
          };
          return updatedCountry;
        }
        return {
          id: -1,
          country: 'Not Found',
          participations: [],
          numberOfParticipation: 0,
        }; // Objet par défaut
      })
    );
  }
  getCountryByName(countryName : string ) : Observable<Olympic>{
    return this.olympics$.pipe(
      map((countries) => {
        const country = countries.find((country) => country.country === countryName);
        if (country) {
          const updatedCountry = {
            ...country,
            numberOfParticipation: country.participations.length,
          };
          return updatedCountry;
        }
        return {
          id: -1,
          country: 'Not Found',
          participations: [],
          numberOfParticipation: 0,
        }; 
      })
    );
  }

  getDetailsCountry(countryId: number): Observable<CountryDetails>{
    return this.getCountryById(countryId).pipe(
      map((country) => {
        return {
          name: country.country,
          series: country.participations.map((participation) => {
            return {
              name: (participation.year).toString(),
              value: participation.medalsCount,
            };
          }),
        };
      })
    )
  }
  getTotalMedals(countryId: number): Observable<number> {
    const currentCountry = this.getCountryById(countryId);
    return currentCountry.pipe(
      map((country) => {
        return country.participations.reduce((totalMedals, participation) => {
          return totalMedals + participation.medalsCount;
        }, 0);
      })
    );
  }

  getTotalAthletes(countryId: number): Observable<number> {
    const currentCountry = this.getCountryById(countryId);
    return currentCountry.pipe(
      map((country) => {
        return country.participations.reduce((totalAthletes, participation) => {
          return totalAthletes + participation.athleteCount;
        }, 0);
      })
    );
  }

  getNumberOfJOs(): Observable<number[]> {
    return this.olympics$.pipe(
      map((countries) =>
        countries.map((country) => country.participations.length).slice(0, 1)
      )
    );
  }

  getCountryAndTotalMedals(): Observable<{ name: string; value: number }[]>{
    return this.olympics$.pipe(
      map((countries) => {
        return countries.map((country => {
          return {
            name: country.country,
            value: country.participations.reduce((totalMedals, participation) => {
              return totalMedals + participation.medalsCount;
            }, 0)
          }
        }))
      }
    ));
  }
  
  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }
}
