import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IMsfGame } from 'app/shared/model/msf-game.model';

type EntityResponseType = HttpResponse<IMsfGame>;
type EntityArrayResponseType = HttpResponse<IMsfGame[]>;

@Injectable({ providedIn: 'root' })
export class MsfGameService {
  private resourceUrl = SERVER_API_URL + 'api/msf-games';

  constructor(private http: HttpClient) {}

  create(msfGame: IMsfGame): Observable<EntityResponseType> {
    return this.http.post<IMsfGame>(this.resourceUrl, msfGame, { observe: 'response' });
  }

  update(msfGame: IMsfGame): Observable<EntityResponseType> {
    return this.http.put<IMsfGame>(this.resourceUrl, msfGame, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMsfGame>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMsfGame[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
