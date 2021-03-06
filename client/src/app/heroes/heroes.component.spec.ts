import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeroesComponent } from './heroes.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {HeroService} from '../hero.service';
import {of} from 'rxjs';
import {HEROES} from '../mock-heroes';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;

  beforeEach(async(() => {
    const heroService = jasmine.createSpyObj('HeroService', ['getHeroes', 'getHeroProfileImage']);
    heroService.getHeroes.and.returnValue( of(HEROES) );

    TestBed.configureTestingModule({
      declarations: [ HeroesComponent ],
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
      providers: [
        {provide: HeroService, useValue: heroService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
