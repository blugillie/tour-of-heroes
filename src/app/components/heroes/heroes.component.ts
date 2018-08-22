import { Component, OnInit } from '@angular/core';

import { Hero } from '../../model/hero.model';
import { HeroService } from '../../services/hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Array<Hero> = [];

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }

  addHero(name: string) {
    name = name.trim();

    if (!name) {
      return;
    }

    this.heroService.addHero({name} as Hero)
      .subscribe(h => this.heroes.push(h));
  }

  deleteHero(hero: Hero) {
    this.heroService.deleteHero(hero).subscribe(h => this.getHeroes());
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe(h => this.heroes = h);
  }
}
