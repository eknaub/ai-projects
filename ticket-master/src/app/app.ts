import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Content } from './content/content';

@Component({
  selector: 'app-root',
  imports: [Content],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'ticket-master';
}
