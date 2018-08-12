/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SalaryfsTestModule } from '../../../test.module';
import { MsfGameComponent } from 'app/entities/msf-game/msf-game.component';
import { MsfGameService } from 'app/entities/msf-game/msf-game.service';
import { MsfGame } from 'app/shared/model/msf-game.model';

describe('Component Tests', () => {
  describe('MsfGame Management Component', () => {
    let comp: MsfGameComponent;
    let fixture: ComponentFixture<MsfGameComponent>;
    let service: MsfGameService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SalaryfsTestModule],
        declarations: [MsfGameComponent],
        providers: []
      })
        .overrideTemplate(MsfGameComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MsfGameComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MsfGameService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new MsfGame(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.msfGames[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
