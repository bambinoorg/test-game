import {ChangeDetectionStrategy, Component, DestroyRef, OnInit, Self} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IScore } from '../../core/models/game.model';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePageComponent implements OnInit {
  public timeControl: FormControl<number>;
  public score: IScore;

  constructor(@Self() private destroyRef: DestroyRef) {}

  ngOnInit(): void {
    this.timeControl = new FormControl(0, [Validators.required]);
  }

  public handleScore(score: IScore): void {
    this.score = score;
  }
}
