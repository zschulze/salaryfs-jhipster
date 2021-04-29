import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IMsfGameScore } from 'app/shared/model/msf-game-score.model';
import { MsfGameScoreService } from './msf-game-score.service';

@Component({
  selector: 'jhi-msf-game-score-update',
  templateUrl: './msf-game-score-update.component.html'
})
export class MsfGameScoreUpdateComponent implements OnInit {
  private _msfGameScore: IMsfGameScore;
  isSaving: boolean;

  constructor(private msfGameScoreService: MsfGameScoreService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ msfGameScore }) => {
      this.msfGameScore = msfGameScore;
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    if (this.msfGameScore.id !== undefined) {
      this.subscribeToSaveResponse(this.msfGameScoreService.update(this.msfGameScore));
    } else {
      this.subscribeToSaveResponse(this.msfGameScoreService.create(this.msfGameScore));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IMsfGameScore>>) {
    result.subscribe((res: HttpResponse<IMsfGameScore>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  private onSaveError() {
    this.isSaving = false;
  }
  get msfGameScore() {
    return this._msfGameScore;
  }

  set msfGameScore(msfGameScore: IMsfGameScore) {
    this._msfGameScore = msfGameScore;
  }
}
