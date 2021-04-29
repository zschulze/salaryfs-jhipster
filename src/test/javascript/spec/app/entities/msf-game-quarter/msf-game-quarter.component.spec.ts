/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SalaryfsTestModule } from '../../../test.module';
import { MsfGameQuarterComponent } from 'app/entities/msf-game-quarter/msf-game-quarter.component';
import { MsfGameQuarterService } from 'app/entities/msf-game-quarter/msf-game-quarter.service';
import { MsfGameQuarter } from 'app/shared/model/msf-game-quarter.model';

describe('Component Tests', () => {
  describe('MsfGameQuarter Management Component', () => {
    let comp: MsfGameQuarterComponent;
    let fixture: ComponentFixture<MsfGameQuarterComponent>;
    let service: MsfGameQuarterService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SalaryfsTestModule],
        declarations: [MsfGameQuarterComponent],
        providers: []
      })
        .overrideTemplate(MsfGameQuarterComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MsfGameQuarterComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MsfGameQuarterService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new MsfGameQuarter(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.msfGameQuarters[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
