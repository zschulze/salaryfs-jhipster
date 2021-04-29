import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SalaryfsSharedModule } from 'app/shared';
import {
  MsfGameComponent,
  MsfGameDetailComponent,
  MsfGameUpdateComponent,
  MsfGameDeletePopupComponent,
  MsfGameDeleteDialogComponent,
  msfGameRoute,
  msfGamePopupRoute
} from './';

const ENTITY_STATES = [...msfGameRoute, ...msfGamePopupRoute];

@NgModule({
  imports: [SalaryfsSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    MsfGameComponent,
    MsfGameDetailComponent,
    MsfGameUpdateComponent,
    MsfGameDeleteDialogComponent,
    MsfGameDeletePopupComponent
  ],
  entryComponents: [MsfGameComponent, MsfGameUpdateComponent, MsfGameDeleteDialogComponent, MsfGameDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SalaryfsMsfGameModule {}
