import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatChipRemove, MatChipRow } from '@angular/material/chips';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { dates } from '../utils/dates';
import { environment } from '../environments/environment';

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
    MatButtonModule,
  ],
})
export class App {
  private http = inject(HttpClient);

  protected readonly isLoadingStocksApi = signal(false);
  protected readonly isLoadingPredictions = signal(false);
  protected readonly hasReport = signal(false);

  protected readonly tickers = signal<string[]>([]);
  protected readonly tickerForm = new FormGroup({
    ticker: new FormControl(''),
  });

  protected readonly hasTickers = computed(() => this.tickers().length > 0);

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

  async generateReport() {
    this.isLoadingStocksApi.set(true);
    const tickersArr = this.tickers();
    const requests = tickersArr.map((ticker) => {
      const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=${environment.polygonApiKey}`;
      return this.http.get(url).pipe(
        map((data) => ({ status: 200, data })),
        catchError((error) => of({ status: error.status || 500, data: null }))
      );
    });

    forkJoin(requests).subscribe((results) => {
      const stockData = results
        .filter((res) => res.status === 200)
        .map((res) => res.data);
      if (stockData.length === tickersArr.length) {
        // All succeeded
        this.fetchReport(stockData);
      }
      this.isLoadingStocksApi.set(false);
    });
  }

  fetchReport(stockData: any[]) {
    this.isLoadingPredictions.set(true);
    try {
      // Simulate using stockData to create a report
      setTimeout(() => {
        console.log('Fetched stock data:', stockData);
        this.hasReport.set(true);
        this.isLoadingPredictions.set(false);
      }, 2000);
    } catch (error) {
      console.error('Error fetching report:', error);
      this.isLoadingPredictions.set(false);
    }
  }
}
