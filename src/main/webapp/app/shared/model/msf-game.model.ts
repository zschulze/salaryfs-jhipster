import { IMsfGameScore } from 'app/shared/model//msf-game-score.model';

export interface IMsfGame {
  id?: number;
  week?: string;
  startTime?: string;
  venueAllegiance?: string;
  msfGame?: IMsfGameScore;
}

export class MsfGame implements IMsfGame {
  constructor(
    public id?: number,
    public week?: string,
    public startTime?: string,
    public venueAllegiance?: string,
    public msfGame?: IMsfGameScore
  ) {}
}
