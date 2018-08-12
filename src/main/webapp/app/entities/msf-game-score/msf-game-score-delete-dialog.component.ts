import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMsfGameScore } from 'app/shared/model/msf-game-score.model';
import { MsfGameScoreService } from './msf-game-score.service';

@Component({
  selector: 'jhi-msf-game-score-delete-dialog',
  templateUrl: './msf-game-score-delete-dialog.component.html'
})
export class MsfGameScoreDeleteDialogComponent {
  msfGameScore: IMsfGameScore;

  constructor(
    private msfGameScoreService: MsfGameScoreService,
    public activeModal: NgbActiveModal,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.msfGameScoreService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'msfGameScoreListModification',
        content: 'Deleted an msfGameScore'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-msf-game-score-delete-popup',
  template: ''
})
export class MsfGameScoreDeletePopupComponent implements OnInit, OnDestroy {
  private ngbModalRef: NgbModalRef;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ msfGameScore }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(MsfGameScoreDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.msfGameScore = msfGameScore;
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
