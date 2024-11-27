import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-game-result-modal',
  standalone: true,
  imports: [MatButton],
  templateUrl: './game-result-modal.component.html',
  styleUrl: './game-result-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameResultModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: boolean,
    private dialogRef: DialogRef,
  ) {}

  public ngOnInit(): void {
    this.dialogRef.addPanelClass('result-modal');
  }

  public get title(): string {
    return this.data ? 'Congratulate!' : 'Game Over!';
  }

  public get text(): string {
    return this.data ? 'Victory is Yours!' : 'Don’t Give Up! Try Again!';
  }

  public get isLose(): boolean {
    return !this.data;
  }

  public close(): void {
    this.dialogRef.close();
  }
}
