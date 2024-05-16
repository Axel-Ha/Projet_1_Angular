import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss']
})
export class DetailPageComponent implements OnInit {

  country$!: Observable<Olympic>; 
  constructor(private olympicService: OlympicService,
              private route : ActivatedRoute) { }

  ngOnInit(): void {
    const countryId = +this.route.snapshot.params['id']
    this.country$ = this.olympicService.getCountryById(countryId);
  }
}
