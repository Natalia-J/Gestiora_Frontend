import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-full-loader',
  imports: [],
  templateUrl: './full-loader.html',
  styleUrl: './full-loader.css'
})
export class FullLoader {
  @Input() isVisible: boolean = false;
}
