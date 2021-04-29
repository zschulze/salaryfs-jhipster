import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMsfGameQuarter } from 'app/shared/model/msf-game-quarter.model';
import { MsfGameQuarterService } from './msf-game-quarter.service';

@Component({
  selector: 'jhi-msf-game-quarter-delete-dialog',
  templateUrl: './msf-game-quarter-delete-dialog.component.html'
})
export class MsfGameQuarterDeleteDialogComponent {
  msfGameQuarter: IMsfGameQuarter;

  constructor(
    private msfGameQuarterService: MsfGameQuarterService,
    public activeModal: NgbActiveModal,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.msfGameQuarterService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'msfGameQuarterListModification',
        content: 'Deleted an msfGameQuarter'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-msf-game-quarter-delete-popup',
  template: ''
})
export class MsfGameQuarterDeletePopupComponent implements OnInit, OnDestroy {
  private ngbModalRef: NgbModalRef;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ msfGameQuarter }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(MsfGameQuarterDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.msfGameQuarter = msfGameQuarter;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
