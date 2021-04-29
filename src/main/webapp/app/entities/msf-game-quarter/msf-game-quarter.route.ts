import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MsfGameQuarter } from 'app/shared/model/msf-game-quarter.model';
import { MsfGameQuarterService } from './msf-game-quarter.service';
import { MsfGameQuarterComponent } from './msf-game-quarter.component';
import { MsfGameQuarterDetailComponent } from './msf-game-quarter-detail.component';
import { MsfGameQuarterUpdateComponent } from './msf-game-quarter-update.component';
import { MsfGameQuarterDeletePopupComponent } from './msf-game-quarter-delete-dialog.component';
import { IMsfGameQuarter } from 'app/shared/model/msf-game-quarter.model';

@Injectable({ providedIn: 'root' })
export class MsfGameQuarterResolve implements Resolve<IMsfGameQuarter> {
  constructor(private service: MsfGameQuarterService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(map((msfGameQuarter: HttpResponse<MsfGameQuarter>) => msfGameQuarter.body));
    }
    return of(new MsfGameQuarter());
  }
}

export const msfGameQuarterRoute: Routes = [
  {
    path: 'msf-game-quarter',
    component: MsfGameQuarterComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'MsfGameQuarters'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'msf-game-quarter/:id/view',
    component: MsfGameQuarterDetailComponent,
    resolve: {
      msfGameQuarter: MsfGameQuarterResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'MsfGameQuarters'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'msf-game-quarter/new',
    component: MsfGameQuarterUpdateComponent,
    resolve: {
      msfGameQuarter: MsfGameQuarterResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'MsfGameQuarters'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'msf-game-quarter/:id/edit',
    component: MsfGameQuarterUpdateComponent,
    resolve: {
      msfGameQuarter: MsfGameQuarterResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'MsfGameQuarters'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const msfGameQuarterPopupRoute: Routes = [
  {
    path: 'msf-game-quarter/:id/delete',
    component: MsfGameQuarterDeletePopupComponent,
    resolve: {
      msfGameQuarter: MsfGameQuarterResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'MsfGameQuarters'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
