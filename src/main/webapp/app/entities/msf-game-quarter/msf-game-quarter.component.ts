import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IMsfGameQuarter } from 'app/shared/model/msf-game-quarter.model';
import { Principal } from 'app/core';
import { MsfGameQuarterService } from './msf-game-quarter.service';

@Component({
  selector: 'jhi-msf-game-quarter',
  templateUrl: './msf-game-quarter.component.html'
})
export class MsfGameQuarterComponent implements OnInit, OnDestroy {
  msfGameQuarters: IMsfGameQuarter[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    private msfGameQuarterService: MsfGameQuarterService,
    private jhiAlertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private principal: Principal
  ) {}

  loadAll() {
    this.msfGameQuarterService.query().subscribe(
      (res: HttpResponse<IMsfGameQuarter[]>) => {
        this.msfGameQuarters = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  ngOnInit() {
    this.loadAll();
    this.principal.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInMsfGameQuarters();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IMsfGameQuarter) {
    return item.id;
  }

  registerChangeInMsfGameQuarters() {
    this.eventSubscriber = this.eventManager.subscribe('msfGameQuarterListModification', response => this.loadAll());
  }

  private onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
