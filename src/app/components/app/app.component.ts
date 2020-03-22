import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatSelectChange} from '@angular/material/select/select';
import {select, Store} from '@ngrx/store';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {toggleCreateAction, toggleViewAction} from '../../actions/layout.actions';
import {changeRealityAction} from '../../actions/realities.actions';
import {System, SystemStat, SystemWithStat} from '../../models/system';
import {State} from '../../reducers';
import {getCreate, getView} from '../../reducers/layout/layout.reducer';
import {getRealities, getSelectedReality, Reality} from '../../reducers/realities/realities.reducer';
import {getSystemsStats} from '../../reducers/stats/stats.reducer';
import {getSystems} from '../../reducers/systems/systems.reducer';
import {PushNotificationsService} from '../../services/push-notifications/push-notifications.service';
import {RealitiesManagerService} from '../../services/realities-manager/realities-manager.service';
import {SocketsManagerService} from '../../services/sockets-manager/sockets-manager.service';
import {SystemsManagerService} from '../../services/systems-manager/systems-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('snav') snav;
  systems: Observable<System[]>;
  realities: Observable<Reality[]>;
  selectedReality: string;
  selectedRealityOb: Observable<string>;
  realitiesForm;
  systemWithStats: Observable<SystemWithStat[]>;

  create$: Observable<boolean>;
  view$: Observable<boolean>;

  displaySystems = true;
  fillerNav = ['View', 'Create'];

  constructor(private pushNotificationsService: PushNotificationsService,
              private systemsManagerService: SystemsManagerService,
              private realitiesManagerService: RealitiesManagerService,
              private socketsManagerService: SocketsManagerService,
              private store: Store<State>) {
    this.realitiesForm = new FormControl();
  }

  ngOnInit(): void {
    this.initServices();
    this.systems = this.store.pipe(select(getSystems));
    const systemStats = this.store.pipe(select(getSystemsStats));
    this.realities = this.store.pipe(select(getRealities));
    this.systemWithStats = combineLatest([this.systems, systemStats])
      .pipe(map(([systems, systemsStats]) => {
        const statsMap: Map<number, SystemStat> = new Map<number, SystemStat>();
        for (const stat of systemsStats) {
          statsMap.set(stat.serverId, stat);
        }
        return systems.map(system => ({system, stats: statsMap.get(system.id)}));
      }));
    const selectedRealityOb = this.store.pipe(select(getSelectedReality));
    this.selectedRealityOb = combineLatest([this.realities, selectedRealityOb])
      .pipe(map(([realities, selectedReality]) => {
        const selected = realities.find(reality => reality.warriorReality === selectedReality);
        return selected ? selected.name : 'ddd';
      }));

    this.create$ = this.store.pipe(select(getCreate));
    this.view$ = this.store.pipe(select(getView));
  }

  realitySelectionChanged({value}: MatSelectChange) {
    this.store.dispatch(changeRealityAction({selectedReality: value}));
  }

  notify(body: string, cardTitle: string) {
    const data: any[] = [];
    data.push({
      title: cardTitle,
      alertContent: body,
    });
    this.pushNotificationsService.generateNotification(data);
  }

  optionClicked(text: string) {
    switch (text) {
      case 'View':
        this.store.dispatch(toggleViewAction());
        break;
      case 'Create':
        this.store.dispatch(toggleCreateAction());
        break;
    }
    this.snav.toggle();
  }

  addSystem(event: { system: System, reality: number }) {
    this.systemsManagerService.addSystem(event.system, event.reality);
  }

  private initServices() {
    this.pushNotificationsService.requestPermission().then();
    this.systemsManagerService.init();
    this.realitiesManagerService.init();
    this.socketsManagerService.init();
  }
}
