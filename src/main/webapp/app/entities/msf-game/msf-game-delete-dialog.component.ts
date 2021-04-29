import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMsfGame } from 'app/shared/model/msf-game.model';
import { MsfGameService } from './msf-game.service';

@Component({
  selector: 'jhi-msf-game-delete-dialog',
  templateUrl: './msf-game-delete-dialog.component.html'
})
export class MsfGameDeleteDialogComponent {
  msfGame: IMsfGame;

  constructor(private msfGameService: MsfGameService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.msfGameService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'msfGameListModification',
        content: 'Deleted an msfGame'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-msf-game-delete-popup',
  template: ''
})
export class MsfGameDeletePopupComponent implements OnInit, OnDestroy {
  private ngbModalRef: NgbModalRef;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ msfGame }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(MsfGameDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.msfGame = msfGame;
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
