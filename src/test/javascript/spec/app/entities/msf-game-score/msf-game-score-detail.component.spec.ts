/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SalaryfsTestModule } from '../../../test.module';
import { MsfGameScoreDetailComponent } from 'app/entities/msf-game-score/msf-game-score-detail.component';
import { MsfGameScore } from 'app/shared/model/msf-game-score.model';

describe('Component Tests', () => {
  describe('MsfGameScore Management Detail Component', () => {
    let comp: MsfGameScoreDetailComponent;
    let fixture: ComponentFixture<MsfGameScoreDetailComponent>;
    const route = ({ data: of({ msfGameScore: new MsfGameScore(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SalaryfsTestModule],
        declarations: [MsfGameScoreDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(MsfGameScoreDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MsfGameScoreDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.msfGameScore).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
