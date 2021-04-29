import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IMsfGameQuarter } from 'app/shared/model/msf-game-quarter.model';
import { MsfGameQuarterService } from './msf-game-quarter.service';
import { IMsfGameScore } from 'app/shared/model/msf-game-score.model';
import { MsfGameScoreService } from 'app/entities/msf-game-score';

@Component({
  selector: 'jhi-msf-game-quarter-update',
  templateUrl: './msf-game-quarter-update.component.html'
})
export class MsfGameQuarterUpdateComponent implements OnInit {
  private _msfGameQuarter: IMsfGameQuarter;
  isSaving: boolean;

  msfgamescores: IMsfGameScore[];

  constructor(
    private jhiAlertService: JhiAlertService,
    private msfGameQuarterService: MsfGameQuarterService,
    private msfGameScoreService: MsfGameScoreService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ msfGameQuarter }) => {
      this.msfGameQuarter = msfGameQuarter;
    });
    this.msfGameScoreService.query().subscribe(
      (res: HttpResponse<IMsfGameScore[]>) => {
        this.msfgamescores = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    if (this.msfGameQuarter.id !== undefined) {
      this.subscribeToSaveResponse(this.msfGameQuarterService.update(this.msfGameQuarter));
    } else {
      this.subscribeToSaveResponse(this.msfGameQuarterService.create(this.msfGameQuarter));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IMsfGameQuarter>>) {
    result.subscribe((res: HttpResponse<IMsfGameQuarter>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
  get msfGameQuarter() {
    return this._msfGameQuarter;
  }

  set msfGameQuarter(msfGameQuarter: IMsfGameQuarter) {
    this._msfGameQuarter = msfGameQuarter;
  }
}
