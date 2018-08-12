import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SalaryfsSharedModule } from 'app/shared';
import {
  MsfGameQuarterComponent,
  MsfGameQuarterDetailComponent,
  MsfGameQuarterUpdateComponent,
  MsfGameQuarterDeletePopupComponent,
  MsfGameQuarterDeleteDialogComponent,
  msfGameQuarterRoute,
  msfGameQuarterPopupRoute
} from './';

const ENTITY_STATES = [...msfGameQuarterRoute, ...msfGameQuarterPopupRoute];

@NgModule({
  imports: [SalaryfsSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    MsfGameQuarterComponent,
    MsfGameQuarterDetailComponent,
    MsfGameQuarterUpdateComponent,
    MsfGameQuarterDeleteDialogComponent,
    MsfGameQuarterDeletePopupComponent
  ],
  entryComponents: [
    MsfGameQuarterComponent,
    MsfGameQuarterUpdateComponent,
    MsfGameQuarterDeleteDialogComponent,
    MsfGameQuarterDeletePopupComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SalaryfsMsfGameQuarterModule {}
