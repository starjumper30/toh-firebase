import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';

import { combineLatest, from, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';
import { environment } from '../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class HeroService {

  private heroesUrl = `${environment.firebase.cloudFunctionsURL}/heroes/`;  // URL to cloud function

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private storage: AngularFireStorage) { }

  /** GET heroes from the server */
  getHeroes (): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', []))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addHero (hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap(h => this.log(`added hero w/ id=${h.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero (hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /** PUT: update the hero on the server */
  updateHero (hero: Hero, profilePhoto?: File): Observable<any> {
    return combineLatest(
      this.http.put(this.heroesUrl, hero, httpOptions)
        .pipe(
          tap(_ => this.log(`updated hero id=${hero.id}`)),
          catchError(this.handleError<any>('updateHero'))
        ),
      profilePhoto ? this.uploadFile(profilePhoto, hero) : of(null)
    );
  }

  getHeroProfileImage(hero: Hero): Observable<string | null> {
    const filePath = this.buildFileName(hero);
    const ref = this.storage.ref(filePath);
    return ref.getDownloadURL().pipe(catchError(e => of(undefined)));
  }

  private buildFileName(hero: Hero) {
    return 'hero-photo-' + hero.id;
  }

  private uploadFile(file: File, hero: Hero) {
    const filePath = this.buildFileName(hero);
    const ref: AngularFireStorageReference = this.storage.ref(filePath);
    const task: AngularFireUploadTask = ref.put(file);
    return from(task)
      .pipe(catchError(this.handleError<any>('updateHeroProfilePhoto')));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
