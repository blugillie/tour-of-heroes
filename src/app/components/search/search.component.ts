import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../../model/hero.model';
import { HeroService } from '../../services/hero.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  heroes: Observable<Hero[]>;

  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.heroes = this.searchTerms.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(t => this.heroService.searchHeroes(t)),
        );
    this.heroes.subscribe();
  }

  search(term: string) {
    this.searchTerms.next(term);
  }

}
