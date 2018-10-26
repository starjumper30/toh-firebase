import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes.length > 4 ? heroes.slice(0, 4) : heroes);
  }

  getProfilePic(hero: Hero): Observable<string> {
    return this.heroService.getHeroProfileImage(hero)
      .pipe(filter(p => !!p));
  }
}
