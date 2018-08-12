import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMsfGame } from 'app/shared/model/msf-game.model';

@Component({
  selector: 'jhi-msf-game-detail',
  templateUrl: './msf-game-detail.component.html'
})
export class MsfGameDetailComponent implements OnInit {
  msfGame: IMsfGame;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ msfGame }) => {
      this.msfGame = msfGame;
    });
  }

  previousState() {
    window.history.back();
  }
}
