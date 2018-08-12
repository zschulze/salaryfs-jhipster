import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IMsfGame } from 'app/shared/model/msf-game.model';
import { Principal } from 'app/core';
import { MsfGameService } from './msf-game.service';

@Component({
  selector: 'jhi-msf-game',
  templateUrl: './msf-game.component.html'
})
export class MsfGameComponent implements OnInit, OnDestroy {
  msfGames: IMsfGame[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    private msfGameService: MsfGameService,
    private jhiAlertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private principal: Principal
  ) {}

  loadAll() {
    this.msfGameService.query().subscribe(
      (res: HttpResponse<IMsfGame[]>) => {
        this.msfGames = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  ngOnInit() {
    this.loadAll();
    this.principal.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInMsfGames();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IMsfGame) {
    return item.id;
  }

  registerChangeInMsfGames() {
    this.eventSubscriber = this.eventManager.subscribe('msfGameListModification', response => this.loadAll());
  }

  private onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
