import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {System, SystemWithStat} from '../../models/system';

@Component({
  selector: 'app-systems-container',
  templateUrl: './systems-container.component.html',
  styleUrls: ['./systems-container.component.css']
})
export class SystemsContainerComponent {
  @Input() systems: SystemWithStat[];
  @Input() iconClass?: string;
  @Input() shouldAddBadge?: boolean;
  @Input() badgeColor?: ThemePalette;
  @Output() iconClickedEmitter: EventEmitter<System>;

  constructor() {
    this.iconClass = '';
    this.badgeColor = 'primary';
    this.shouldAddBadge = false;
    this.iconClickedEmitter = new EventEmitter<System>();
  }

  handleBadgeClicked(system: System) {
    this.iconClickedEmitter.emit(system);
  }
}
