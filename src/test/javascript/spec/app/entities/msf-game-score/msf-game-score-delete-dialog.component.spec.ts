/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { SalaryfsTestModule } from '../../../test.module';
import { MsfGameScoreDeleteDialogComponent } from 'app/entities/msf-game-score/msf-game-score-delete-dialog.component';
import { MsfGameScoreService } from 'app/entities/msf-game-score/msf-game-score.service';

describe('Component Tests', () => {
  describe('MsfGameScore Management Delete Component', () => {
    let comp: MsfGameScoreDeleteDialogComponent;
    let fixture: ComponentFixture<MsfGameScoreDeleteDialogComponent>;
    let service: MsfGameScoreService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SalaryfsTestModule],
        declarations: [MsfGameScoreDeleteDialogComponent]
      })
        .overrideTemplate(MsfGameScoreDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MsfGameScoreDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MsfGameScoreService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
