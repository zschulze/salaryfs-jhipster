/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { SalaryfsTestModule } from '../../../test.module';
import { MsfGameScoreUpdateComponent } from 'app/entities/msf-game-score/msf-game-score-update.component';
import { MsfGameScoreService } from 'app/entities/msf-game-score/msf-game-score.service';
import { MsfGameScore } from 'app/shared/model/msf-game-score.model';

describe('Component Tests', () => {
  describe('MsfGameScore Management Update Component', () => {
    let comp: MsfGameScoreUpdateComponent;
    let fixture: ComponentFixture<MsfGameScoreUpdateComponent>;
    let service: MsfGameScoreService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SalaryfsTestModule],
        declarations: [MsfGameScoreUpdateComponent]
      })
        .overrideTemplate(MsfGameScoreUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MsfGameScoreUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MsfGameScoreService);
    });

    describe('save', () => {
      it(
        'Should call update service on save for existing entity',
        fakeAsync(() => {
          // GIVEN
          const entity = new MsfGameScore(123);
          spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
          comp.msfGameScore = entity;
          // WHEN
          comp.save();
          tick(); // simulate async

          // THEN
          expect(service.update).toHaveBeenCalledWith(entity);
          expect(comp.isSaving).toEqual(false);
        })
      );

      it(
        'Should call create service on save for new entity',
        fakeAsync(() => {
          // GIVEN
          const entity = new MsfGameScore();
          spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
          comp.msfGameScore = entity;
          // WHEN
          comp.save();
          tick(); // simulate async

          // THEN
          expect(service.create).toHaveBeenCalledWith(entity);
          expect(comp.isSaving).toEqual(false);
        })
      );
    });
  });
});
