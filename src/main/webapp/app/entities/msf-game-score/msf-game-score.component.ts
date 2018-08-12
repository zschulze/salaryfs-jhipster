import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IMsfGameScore } from 'app/shared/model/msf-game-score.model';
import { Principal } from 'app/core';
import { MsfGameScoreService } from './msf-game-score.service';

@Component({
  selector: 'jhi-msf-game-score',
  templateUrl: './msf-game-score.component.html'
})
export class MsfGameScoreComponent implements OnInit, OnDestroy {
  msfGameScores: IMsfGameScore[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    private msfGameScoreService: MsfGameScoreService,
    private jhiAlertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private principal: Principal
  ) {}

  loadAll() {
    this.msfGameScoreService.query().subscribe(
      (res: HttpResponse<IMsfGameScore[]>) => {
        this.msfGameScores = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  ngOnInit() {
    this.loadAll();
    this.principal.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInMsfGameScores();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IMsfGameScore) {
    return item.id;
  }

  registerChangeInMsfGameScores() {
    this.eventSubscriber = this.eventManager.subscribe('msfGameScoreListModification', response => this.loadAll());
  }

  private onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
