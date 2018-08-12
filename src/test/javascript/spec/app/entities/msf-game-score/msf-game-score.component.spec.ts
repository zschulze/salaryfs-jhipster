/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SalaryfsTestModule } from '../../../test.module';
import { MsfGameScoreComponent } from 'app/entities/msf-game-score/msf-game-score.component';
import { MsfGameScoreService } from 'app/entities/msf-game-score/msf-game-score.service';
import { MsfGameScore } from 'app/shared/model/msf-game-score.model';

describe('Component Tests', () => {
  describe('MsfGameScore Management Component', () => {
    let comp: MsfGameScoreComponent;
    let fixture: ComponentFixture<MsfGameScoreComponent>;
    let service: MsfGameScoreService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SalaryfsTestModule],
        declarations: [MsfGameScoreComponent],
        providers: []
      })
        .overrideTemplate(MsfGameScoreComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MsfGameScoreComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MsfGameScoreService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new MsfGameScore(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.msfGameScores[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
