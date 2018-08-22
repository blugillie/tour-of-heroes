import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Observable, of, from } from 'rxjs';

import { MessageService } from './message.service';

import { Hero } from '../model/hero.model';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private messageService: MessageService) { }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(h => this.log(`added hero id: ${h.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }

  deleteHero(hero: Hero) {
    if (!hero) {
      return;
    }

    return this.http.delete<Hero>(`${this.heroesUrl}/${hero.id}`, this.httpOptions)
      .pipe(
        tap(h => this.log(`deleted hero id: ${hero.id}`)),
        catchError(this.handleError('deleteHero'))
      );
  }

  getHero(id: number): Observable<Hero> {
    this.messageService.add(`HeroService: fetched hero with id: ${id}`);
    return this.http.get<Hero>(`${this.heroesUrl}/${id}`)
      .pipe(
        tap(h => this.log(`fetched hero with id: ${id}`)),
        catchError(this.handleError<Hero>(`getHero id: ${id}`))
      );
  }

  getHeroes(): Observable<Hero[]> {
    const data: Observable<Hero[]> = this.http.get<Array<Hero>>(this.heroesUrl)
      .pipe(
        tap(h => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', []))
      );

      return data;
  }

  // getHeroes(): Observable<Hero[]> {
  //   return from<Hero[]>(this.getHeroesAsync());
  // }

  // async getHeroesAsync() {
  //   const data = await from(this.http.get<Array<Hero>>(this.heroesUrl)
  //     .pipe(
  //       tap(h => this.log('fetched heroes')),
  //       catchError(this.handleError('getHeroes', []))
  //     )
  //     .toPromise()
  // );

  //   return data;
  // }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  searchHeroes(name: string): Observable<Hero[]> {
    if (!name.trim()) {
      return of(new Array<Hero>());
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${name}`)
      .pipe(
        tap(h => this.log(`searched for hero with name: ${name}`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
  }

  updateHero(hero: Hero) {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(h => this.log(`updated hero id: ${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
