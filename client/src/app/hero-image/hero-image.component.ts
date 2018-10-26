import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';

import {Hero} from '../hero';
import {HeroService} from '../hero.service';

@Component({
  selector: 'app-hero-image',
  template: `
    <div [style.height]="height">
      <img *ngIf="profileUrl" [src]="profileUrl" [attr.height]="height"/>
      <span *ngIf="looking">Looking for image...</span>
      <span *ngIf="!looking && !profileUrl">No image found</span>
    </div>`
})
export class HeroImageComponent implements OnInit, OnDestroy {

  @Input() hero: Hero;
  @Input() height = '150px';

  profileUrl: string | null | undefined;
  looking = true;

  private sub: Subscription;

  constructor(private svc: HeroService) {
  }

  ngOnInit() {
    this.sub = this.svc.getHeroProfileImage(this.hero)
      .subscribe(pu => {
        this.profileUrl = pu;
        this.looking = false;
      });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
