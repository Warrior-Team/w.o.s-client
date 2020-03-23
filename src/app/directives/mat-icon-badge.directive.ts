import {Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';

@Directive({selector: '[appBadgeIcon]'})
export class MatBadgeIconDirective implements OnInit {
  @Input() matBadgeIconClass: string;
  @Output() badgeClicked: EventEmitter<void>;

  @HostListener('click') onClick() {
    this.badgeClicked.emit();
  }

  constructor(private el: ElementRef) {
    this.badgeClicked = new EventEmitter<void>();
  }

  ngOnInit() {
    const badge = this.el.nativeElement.querySelector('.mat-badge-content');
    badge.style.marginRight = '5px';
    badge.style.marginTop = '5px';
    badge.style.display = 'flex';
    badge.style.alignItems = 'center';
    badge.style.justifyContent = 'center';
    badge.innerHTML = `<span class="${this.matBadgeIconClass}" style="font-size: 1.3em"></span>`;
  }
}
