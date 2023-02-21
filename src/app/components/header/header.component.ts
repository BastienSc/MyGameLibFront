import { Component, Input } from '@angular/core';
import { DrawerComponent } from '../drawer/drawer.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() drawer!: DrawerComponent;
}
