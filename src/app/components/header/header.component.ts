import { Component, Input } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import { DrawerComponent } from '../drawer/drawer.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() drawer!: DrawerComponent;

  constructor(private translate: TranslateService){
    this.translate.setDefaultLang('fr');
    this.translate.use('fr');
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }
}
