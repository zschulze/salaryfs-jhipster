import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMsfGameQuarter } from 'app/shared/model/msf-game-quarter.model';

@Component({
  selector: 'jhi-msf-game-quarter-detail',
  templateUrl: './msf-game-quarter-detail.component.html'
})
export class MsfGameQuarterDetailComponent implements OnInit {
  msfGameQuarter: IMsfGameQuarter;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ msfGameQuarter }) => {
      this.msfGameQuarter = msfGameQuarter;
    });
  }

  previousState() {
    window.history.back();
  }
}
