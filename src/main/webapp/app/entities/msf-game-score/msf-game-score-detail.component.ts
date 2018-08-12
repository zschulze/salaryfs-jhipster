import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMsfGameScore } from 'app/shared/model/msf-game-score.model';

@Component({
  selector: 'jhi-msf-game-score-detail',
  templateUrl: './msf-game-score-detail.component.html'
})
export class MsfGameScoreDetailComponent implements OnInit {
  msfGameScore: IMsfGameScore;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ msfGameScore }) => {
      this.msfGameScore = msfGameScore;
    });
  }

  previousState() {
    window.history.back();
  }
}
