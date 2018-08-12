/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { SalaryfsTestModule } from '../../../test.module';
import { MsfGameUpdateComponent } from 'app/entities/msf-game/msf-game-update.component';
import { MsfGameService } from 'app/entities/msf-game/msf-game.service';
import { MsfGame } from 'app/shared/model/msf-game.model';

describe('Component Tests', () => {
  describe('MsfGame Management Update Component', () => {
    let comp: MsfGameUpdateComponent;
    let fixture: ComponentFixture<MsfGameUpdateComponent>;
    let service: MsfGameService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SalaryfsTestModule],
        declarations: [MsfGameUpdateComponent]
      })
        .overrideTemplate(MsfGameUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MsfGameUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MsfGameService);
    });

    describe('save', () => {
      it(
        'Should call update service on save for existing entity',
        fakeAsync(() => {
          // GIVEN
          const entity = new MsfGame(123);
          spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
          comp.msfGame = entity;
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
          const entity = new MsfGame();
          spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
          comp.msfGame = entity;
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
