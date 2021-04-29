/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SalaryfsTestModule } from '../../../test.module';
import { MsfGameDetailComponent } from 'app/entities/msf-game/msf-game-detail.component';
import { MsfGame } from 'app/shared/model/msf-game.model';

describe('Component Tests', () => {
  describe('MsfGame Management Detail Component', () => {
    let comp: MsfGameDetailComponent;
    let fixture: ComponentFixture<MsfGameDetailComponent>;
    const route = ({ data: of({ msfGame: new MsfGame(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SalaryfsTestModule],
        declarations: [MsfGameDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(MsfGameDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MsfGameDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.msfGame).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
