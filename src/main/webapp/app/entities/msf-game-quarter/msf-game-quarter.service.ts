import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IMsfGameQuarter } from 'app/shared/model/msf-game-quarter.model';

type EntityResponseType = HttpResponse<IMsfGameQuarter>;
type EntityArrayResponseType = HttpResponse<IMsfGameQuarter[]>;

@Injectable({ providedIn: 'root' })
export class MsfGameQuarterService {
  private resourceUrl = SERVER_API_URL + 'api/msf-game-quarters';

  constructor(private http: HttpClient) {}

  create(msfGameQuarter: IMsfGameQuarter): Observable<EntityResponseType> {
    return this.http.post<IMsfGameQuarter>(this.resourceUrl, msfGameQuarter, { observe: 'response' });
  }

  update(msfGameQuarter: IMsfGameQuarter): Observable<EntityResponseType> {
    return this.http.put<IMsfGameQuarter>(this.resourceUrl, msfGameQuarter, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMsfGameQuarter>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMsfGameQuarter[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
