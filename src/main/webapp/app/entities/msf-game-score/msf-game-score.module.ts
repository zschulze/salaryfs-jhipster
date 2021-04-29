import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SalaryfsSharedModule } from 'app/shared';
import {
  MsfGameScoreComponent,
  MsfGameScoreDetailComponent,
  MsfGameScoreUpdateComponent,
  MsfGameScoreDeletePopupComponent,
  MsfGameScoreDeleteDialogComponent,
  msfGameScoreRoute,
  msfGameScorePopupRoute
} from './';

const ENTITY_STATES = [...msfGameScoreRoute, ...msfGameScorePopupRoute];

@NgModule({
  imports: [SalaryfsSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    MsfGameScoreComponent,
    MsfGameScoreDetailComponent,
    MsfGameScoreUpdateComponent,
    MsfGameScoreDeleteDialogComponent,
    MsfGameScoreDeletePopupComponent
  ],
  entryComponents: [
    MsfGameScoreComponent,
    MsfGameScoreUpdateComponent,
    MsfGameScoreDeleteDialogComponent,
    MsfGameScoreDeletePopupComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SalaryfsMsfGameScoreModule {}
