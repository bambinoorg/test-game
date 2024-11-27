import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Self,
} from '@angular/core';
import { IGame, IScore } from '../../models/game.model';
import { colors } from '../../constants/colors';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  concatMap,
  finalize,
  interval,
  map,
  Observable,
  of,
  startWith,
  takeWhile,
  tap,
  timer,
} from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GameResultModalComponent } from '../modals/game-result-modal/game-result-modal.component';

@Component({
  selector: 'app-game-field',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './game-field.component.html',
  styleUrl: './game-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameFieldComponent implements OnInit {
  @Input() timeValue: number;

  @Output() scoreChanged = new EventEmitter<IScore>();

  public gameField: IGame[] = [];
  public gameStarted = false;
  public usedIdx = new Set<number>([]);
  public activeIdx: number = null;
  public score: IScore = { computer: 0, player: 0 };
  public gameCanceled = false;

  constructor(
    @Self() private destroyRef: DestroyRef,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.generateNewField();
  }

  public startGame(): void {
    this.gameStarted = true;

    interval(this.timeValue)
      .pipe(
        startWith(0),
        takeWhile(() => this.gameStarted),
        takeWhile(() => !this.checkScore()),
        takeUntilDestroyed(this.destroyRef),
        map(() => this.getRandomIdx()),
        concatMap(idx => {
          if (this.checkScore()) {
            this.gameStarted = false;
            return of(void 0);
          }

          return this.startRound(idx);
        }),
        finalize(() => {
          if (!this.gameCanceled) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = this.score.player === 10;
            this.dialog.open(GameResultModalComponent, dialogConfig);
          } else {
            this.gameCanceled = false;
          }

          this.resetGameState();
        }),
      )
      .subscribe();
  }

  public handleField(idx: number): void {
    if (!this.gameStarted || this.activeIdx !== idx) return;

    this.gameField[idx] = {
      ...this.gameField[idx],
      isPlayerClicked: true,
      color: colors.green,
    };
  }

  public cancelGame(): void {
    this.gameCanceled = true;
    this.resetGameState();
  }

  private startRound(idx: number): Observable<void> {
    const chosenGameField = this.gameField[idx];

    chosenGameField.color = colors.yellow;

    this.cdr.detectChanges();

    return timer(this.timeValue).pipe(
      tap(() => {
        if (!chosenGameField.isPlayerClicked) {
          chosenGameField.color = colors.red;
        }
      }),
      takeWhile(() => this.gameStarted),
      tap(() => {
        this.gameField[idx].isPlayerClicked
          ? (this.score.player += 1)
          : (this.score.computer += 1);

        this.scoreChanged.emit(this.score);
      }),
      map(() => void 0),
    );
  }

  private getRandomIdx(): number {
    let randomId: number;

    do {
      randomId = Math.floor(Math.random() * 100);
    } while (this.usedIdx.has(randomId));

    this.usedIdx.add(randomId);
    this.activeIdx = randomId;

    return randomId;
  }

  private generateNewField(): void {
    this.gameField = Array.from({ length: 100 }, () => ({
      color: colors.blue,
      isPlayerClicked: false,
    }));
  }

  private checkScore(): boolean {
    return Object.values(this.score).includes(10);
  }

  private resetGameState(): void {
    this.gameStarted = false;
    this.activeIdx = null;
    this.score.player = 0;
    this.score.computer = 0;
    this.scoreChanged.emit(this.score);
    this.generateNewField();
  }
}
