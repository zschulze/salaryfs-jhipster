/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SalaryfsTestModule } from '../../../test.module';
import { MsfGameQuarterDetailComponent } from 'app/entities/msf-game-quarter/msf-game-quarter-detail.component';
import { MsfGameQuarter } from 'app/shared/model/msf-game-quarter.model';

describe('Component Tests', () => {
  describe('MsfGameQuarter Management Detail Component', () => {
    let comp: MsfGameQuarterDetailComponent;
    let fixture: ComponentFixture<MsfGameQuarterDetailComponent>;
    const route = ({ data: of({ msfGameQuarter: new MsfGameQuarter(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SalaryfsTestModule],
        declarations: [MsfGameQuarterDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(MsfGameQuarterDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MsfGameQuarterDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.msfGameQuarter).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
