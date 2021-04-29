import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MsfGame } from 'app/shared/model/msf-game.model';
import { MsfGameService } from './msf-game.service';
import { MsfGameComponent } from './msf-game.component';
import { MsfGameDetailComponent } from './msf-game-detail.component';
import { MsfGameUpdateComponent } from './msf-game-update.component';
import { MsfGameDeletePopupComponent } from './msf-game-delete-dialog.component';
import { IMsfGame } from 'app/shared/model/msf-game.model';

@Injectable({ providedIn: 'root' })
export class MsfGameResolve implements Resolve<IMsfGame> {
  constructor(private service: MsfGameService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(map((msfGame: HttpResponse<MsfGame>) => msfGame.body));
    }
    return of(new MsfGame());
  }
}

export const msfGameRoute: Routes = [
  {
    path: 'msf-game',
    component: MsfGameComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'MsfGames'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'msf-game/:id/view',
    component: MsfGameDetailComponent,
    resolve: {
      msfGame: MsfGameResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'MsfGames'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'msf-game/new',
    component: MsfGameUpdateComponent,
    resolve: {
      msfGame: MsfGameResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'MsfGames'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'msf-game/:id/edit',
    component: MsfGameUpdateComponent,
    resolve: {
      msfGame: MsfGameResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'MsfGames'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const msfGamePopupRoute: Routes = [
  {
    path: 'msf-game/:id/delete',
    component: MsfGameDeletePopupComponent,
    resolve: {
      msfGame: MsfGameResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'MsfGames'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
