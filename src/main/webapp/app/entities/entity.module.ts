import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SalaryfsMsfGameModule } from './msf-game/msf-game.module';
import { SalaryfsMsfGameScoreModule } from './msf-game-score/msf-game-score.module';
import { SalaryfsMsfGameQuarterModule } from './msf-game-quarter/msf-game-quarter.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
  imports: [
    SalaryfsMsfGameModule,
    SalaryfsMsfGameScoreModule,
    SalaryfsMsfGameQuarterModule
    /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
  ],
  declarations: [],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SalaryfsEntityModule {}
