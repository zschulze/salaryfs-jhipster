import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IMsfGameScore } from 'app/shared/model/msf-game-score.model';

type EntityResponseType = HttpResponse<IMsfGameScore>;
type EntityArrayResponseType = HttpResponse<IMsfGameScore[]>;

@Injectable({ providedIn: 'root' })
export class MsfGameScoreService {
  private resourceUrl = SERVER_API_URL + 'api/msf-game-scores';

  constructor(private http: HttpClient) {}

  create(msfGameScore: IMsfGameScore): Observable<EntityResponseType> {
    return this.http.post<IMsfGameScore>(this.resourceUrl, msfGameScore, { observe: 'response' });
  }

  update(msfGameScore: IMsfGameScore): Observable<EntityResponseType> {
    return this.http.put<IMsfGameScore>(this.resourceUrl, msfGameScore, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMsfGameScore>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMsfGameScore[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
