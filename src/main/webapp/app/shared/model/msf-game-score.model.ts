import { IMsfGameQuarter } from 'app/shared/model//msf-game-quarter.model';

export interface IMsfGameScore {
  id?: number;
  currentQuarter?: number;
  seconds?: number;
  msfGameQuarters?: IMsfGameQuarter[];
}

export class MsfGameScore implements IMsfGameScore {
  constructor(public id?: number, public currentQuarter?: number, public seconds?: number, public msfGameQuarters?: IMsfGameQuarter[]) {}
}
