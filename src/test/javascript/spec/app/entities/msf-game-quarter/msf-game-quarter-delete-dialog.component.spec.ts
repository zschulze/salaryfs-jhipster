/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { SalaryfsTestModule } from '../../../test.module';
import { MsfGameQuarterDeleteDialogComponent } from 'app/entities/msf-game-quarter/msf-game-quarter-delete-dialog.component';
import { MsfGameQuarterService } from 'app/entities/msf-game-quarter/msf-game-quarter.service';

describe('Component Tests', () => {
  describe('MsfGameQuarter Management Delete Component', () => {
    let comp: MsfGameQuarterDeleteDialogComponent;
    let fixture: ComponentFixture<MsfGameQuarterDeleteDialogComponent>;
    let service: MsfGameQuarterService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SalaryfsTestModule],
        declarations: [MsfGameQuarterDeleteDialogComponent]
      })
        .overrideTemplate(MsfGameQuarterDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MsfGameQuarterDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MsfGameQuarterService);
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
