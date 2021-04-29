import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IMsfGame } from 'app/shared/model/msf-game.model';
import { MsfGameService } from './msf-game.service';
import { IMsfGameScore } from 'app/shared/model/msf-game-score.model';
import { MsfGameScoreService } from 'app/entities/msf-game-score';

@Component({
  selector: 'jhi-msf-game-update',
  templateUrl: './msf-game-update.component.html'
})
export class MsfGameUpdateComponent implements OnInit {
  private _msfGame: IMsfGame;
  isSaving: boolean;

  msfgames: IMsfGameScore[];

  constructor(
    private jhiAlertService: JhiAlertService,
    private msfGameService: MsfGameService,
    private msfGameScoreService: MsfGameScoreService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ msfGame }) => {
      this.msfGame = msfGame;
    });
    this.msfGameScoreService.query({ filter: 'msfgame-is-null' }).subscribe(
      (res: HttpResponse<IMsfGameScore[]>) => {
        if (!this.msfGame.msfGame || !this.msfGame.msfGame.id) {
          this.msfgames = res.body;
        } else {
          this.msfGameScoreService.find(this.msfGame.msfGame.id).subscribe(
            (subRes: HttpResponse<IMsfGameScore>) => {
              this.msfgames = [subRes.body].concat(res.body);
            },
            (subRes: HttpErrorResponse) => this.onError(subRes.message)
          );
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    if (this.msfGame.id !== undefined) {
      this.subscribeToSaveResponse(this.msfGameService.update(this.msfGame));
    } else {
      this.subscribeToSaveResponse(this.msfGameService.create(this.msfGame));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IMsfGame>>) {
    result.subscribe((res: HttpResponse<IMsfGame>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackMsfGameScoreById(index: number, item: IMsfGameScore) {
    return item.id;
  }
  get msfGame() {
    return this._msfGame;
  }

  set msfGame(msfGame: IMsfGame) {
    this._msfGame = msfGame;
  }
}
