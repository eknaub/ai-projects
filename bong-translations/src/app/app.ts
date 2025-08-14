import { Component } from '@angular/core';
import { Header } from './header/header';
import { Content } from './content/content';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.less',
  imports: [Header, Content],
})
export class App {}
