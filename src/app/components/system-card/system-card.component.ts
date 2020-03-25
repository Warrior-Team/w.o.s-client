import {HttpClient} from '@angular/common/http';
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Store} from '@ngrx/store';
import {toggleSystemGraphAction} from '../../actions/system.actions';
import {System, SystemWithStat} from '../../models/system';
import {State} from '../../reducers';
import {SystemsManagerService} from '../../services/systems-manager/systems-manager.service';

@Component({
  selector: 'app-system-card',
  templateUrl: './system-card.component.html',
  styleUrls: ['./system-card.component.css']
})
export class SystemCardComponent implements OnChanges {
  @Input() systemWithStat: SystemWithStat;
  @Output() clickEmitter: EventEmitter<string>;

  system: System;
  isGraphOpen: boolean;
  labels = [];
  data = [];

  constructor(private httpClient: HttpClient,
              private systemsManagerService: SystemsManagerService,
              private stateStore: Store<State>) {
    this.clickEmitter = new EventEmitter<string>();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.systemWithStat && this.systemWithStat) {
      this.system = this.systemWithStat.system;
      if (this.systemWithStat.stats) {
        this.labels = this.systemWithStat.stats.stats.map(s => s.request_time);
        this.data = this.systemWithStat.stats.stats.map(s => s.duration_ms);
      }
    }
  }

  handleToggleGraph() {
    this.stateStore.dispatch(toggleSystemGraphAction({systemId: this.system.id, isGraphOpen: !this.system.isGraphOpen}));
    this.systemsManagerService.getStat(this.system.id);
  }

  click() {
    this.httpClient.post('http://localhost:8080/systems/message', {data: 'hello'}, {withCredentials: false})
      .subscribe((d: { data: string }) => {
        this.clickEmitter.emit(d.data);
      });
  }
}
