import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MsfGameScore } from 'app/shared/model/msf-game-score.model';
import { MsfGameScoreService } from './msf-game-score.service';
import { MsfGameScoreComponent } from './msf-game-score.component';
import { MsfGameScoreDetailComponent } from './msf-game-score-detail.component';
import { MsfGameScoreUpdateComponent } from './msf-game-score-update.component';
import { MsfGameScoreDeletePopupComponent } from './msf-game-score-delete-dialog.component';
import { IMsfGameScore } from 'app/shared/model/msf-game-score.model';

@Injectable({ providedIn: 'root' })
export class MsfGameScoreResolve implements Resolve<IMsfGameScore> {
  constructor(private service: MsfGameScoreService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(map((msfGameScore: HttpResponse<MsfGameScore>) => msfGameScore.body));
    }
    return of(new MsfGameScore());
  }
}

export const msfGameScoreRoute: Routes = [
  {
    path: 'msf-game-score',
    component: MsfGameScoreComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'MsfGameScores'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'msf-game-score/:id/view',
    component: MsfGameScoreDetailComponent,
    resolve: {
      msfGameScore: MsfGameScoreResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'MsfGameScores'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'msf-game-score/new',
    component: MsfGameScoreUpdateComponent,
    resolve: {
      msfGameScore: MsfGameScoreResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'MsfGameScores'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'msf-game-score/:id/edit',
    component: MsfGameScoreUpdateComponent,
    resolve: {
      msfGameScore: MsfGameScoreResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'MsfGameScores'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const msfGameScorePopupRoute: Routes = [
  {
    path: 'msf-game-score/:id/delete',
    component: MsfGameScoreDeletePopupComponent,
    resolve: {
      msfGameScore: MsfGameScoreResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'MsfGameScores'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
