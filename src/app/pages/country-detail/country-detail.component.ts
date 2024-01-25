import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MedalsPerYear } from 'src/app/core/models/MedalsPerYear';
import { Olympics } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss']
})
export class CountryDetailComponent implements OnInit, OnDestroy {
	public countryName: string = ""
	public numberOfMedals: number = 0
	public numberOfAthletes: number = 0
	public numberOfEntries: number = 0
	//TODO : faire une interface
	public numberOfMedalsPerYear!: MedalsPerYear[]

	private ngUnsubscribe = new Subject();
	
	public errMsg: string = ""
	public error: boolean = false
	
  	constructor(private route: ActivatedRoute,private router: Router,  private olympicService: OlympicService) { }


	  ngOnInit(): void {
		this.route.params.pipe(
		  takeUntil(this.ngUnsubscribe)
		).subscribe({
		  next: (params) => {
			const countryId = +params['id'];
			if (typeof countryId === 'number') {
			  this.olympicService.getCountryById(countryId)
				.pipe(takeUntil(this.ngUnsubscribe))
				.subscribe({
				  next: (country) => {
					if (country) {
					  this.countryName = country.country ?? '';
					  this.numberOfEntries = country.participations?.length ?? 0;
					  this.numberOfMedals = this.calculateTotalMedals(country);
					  this.numberOfAthletes = this.calculateTotalAthletes(country);
					  this.numberOfMedalsPerYear = [
						{
						  "name": country.country ?? '',
						  "series": this.calculateMedalsByYear(country)
						}
					  ];
					} else {
					  this.errMsg = 'Le pays n\'a pas été trouvé.';
					  this.error = true;
					}
				  },
				  error: (error) => {
					this.errMsg = error;
					this.error = true;
				  }
				});
			}
		  },
		  error: (error) => {
			this.errMsg = error;
			this.error = true;
		  }
		});
	  }

	ngOnDestroy(): void {
		this.ngUnsubscribe.next(null);
		this.ngUnsubscribe.complete();
	}
	
	calculateTotalMedals(country: Olympics): number {
		return country.participations?.reduce((total, participation) => total + (participation.medalsCount ?? 0), 0) ?? 0;
	}
	calculateTotalAthletes(country: Olympics): number {
		return country.participations?.reduce((total, participation) => total + (participation.athleteCount ?? 0), 0) ?? 0;
	}
	calculateMedalsByYear(country: Olympics): any { 
		return country.participations?.map(participation => ({
			name: participation.year?.toString() ?? '',
			value: participation.medalsCount,
		  })) ?? [];
	  }

	goBack(): void {
		this.router.navigate(['../../'], { relativeTo: this.route });
		// home
		// this.router.navigateByUrl('/');
	}
}
