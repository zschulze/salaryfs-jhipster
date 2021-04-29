import { IMsfGameScore } from 'app/shared/model//msf-game-score.model';

export interface IMsfGameQuarter {
  id?: number;
  quarterName?: string;
  msfGameScore?: IMsfGameScore;
}

export class MsfGameQuarter implements IMsfGameQuarter {
  constructor(public id?: number, public quarterName?: string, public msfGameScore?: IMsfGameScore) {}
}
