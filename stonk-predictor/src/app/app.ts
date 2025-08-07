import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatChipRemove, MatChipRow } from '@angular/material/chips';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [
    ReactiveFormsModule,
    MatIconButton,
    MatIconModule,
    MatFormFieldModule,
    MatLabel,
    MatInputModule,
    MatChipRow,
    MatChipRemove,
  ],
})
export class App {
  protected readonly isLoadingStocksApi = signal(false);
  protected readonly isLoadingPredictions = signal(false);
  protected readonly hasReport = signal(false);

  protected readonly tickers = signal<string[]>([]);
  protected readonly tickerForm = new FormGroup({
    ticker: new FormControl(''),
  });

  addTicker() {
    const tickerValue = this.tickerForm.get('ticker')?.value;

    if (tickerValue && this.tickers().length < 3) {
      this.tickers.set([...this.tickers(), tickerValue.toUpperCase()]);
      this.tickerForm.reset();
    }
  }

  removeTicker(index: number) {
    this.tickers.set([
      ...this.tickers().slice(0, index),
      ...this.tickers().slice(index + 1),
    ]);
  }
}
