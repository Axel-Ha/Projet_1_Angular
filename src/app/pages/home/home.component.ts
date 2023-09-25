import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, of, take, takeUntil } from 'rxjs';
import { Olympic, Olympics } from 'src/app/core/models/Olympic';
import { PieChartValue } from 'src/app/core/models/PieChartValue';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$!: Subject<boolean>;

  public olympics$: Observable<Olympics> = of(null);
  public olympics!: Olympics;
  public data!: Array<PieChartValue>;

  
  single!: any[];
  view: [number,number] = [700, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme : {domain: string[]} = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data : any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data : any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.destroy$ = new Subject<boolean>();
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (value) => {
        this.olympics = value
        this.data = value!.map((olympic : Olympic) => {return {name: olympic!.country, value: olympic!.participations.map((participation) => participation.medalsCount).reduce((a,b) => a+b)}})
      },
      error : (error) => {
        console.error("Received an error: " + error);
      }
    })
    
    
  }

  ngOnDestroy() : void {
    this.destroy$.next(true);
  }
}
