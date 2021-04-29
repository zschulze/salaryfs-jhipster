/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { SalaryfsTestModule } from '../../../test.module';
import { MsfGameQuarterUpdateComponent } from 'app/entities/msf-game-quarter/msf-game-quarter-update.component';
import { MsfGameQuarterService } from 'app/entities/msf-game-quarter/msf-game-quarter.service';
import { MsfGameQuarter } from 'app/shared/model/msf-game-quarter.model';

describe('Component Tests', () => {
  describe('MsfGameQuarter Management Update Component', () => {
    let comp: MsfGameQuarterUpdateComponent;
    let fixture: ComponentFixture<MsfGameQuarterUpdateComponent>;
    let service: MsfGameQuarterService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SalaryfsTestModule],
        declarations: [MsfGameQuarterUpdateComponent]
      })
        .overrideTemplate(MsfGameQuarterUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MsfGameQuarterUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MsfGameQuarterService);
    });

    describe('save', () => {
      it(
        'Should call update service on save for existing entity',
        fakeAsync(() => {
          // GIVEN
          const entity = new MsfGameQuarter(123);
          spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
          comp.msfGameQuarter = entity;
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
          const entity = new MsfGameQuarter();
          spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
          comp.msfGameQuarter = entity;
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
