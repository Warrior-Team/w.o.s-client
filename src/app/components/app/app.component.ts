import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSelectChange} from '@angular/material/select/select';
import {MatSnackBar} from '@angular/material/snack-bar';
import {select, Store} from '@ngrx/store';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {showMainContainerAction, toggleSidenavAction} from '../../actions/layout.actions';
import {changeRealityAction} from '../../actions/realities.actions';
import {removeSystemsAction} from '../../actions/system.actions';
import {SideNavButtons} from '../../models/enums';
import {System, SystemStat, SystemWithStat} from '../../models/system';
import {State} from '../../reducers';
import {getMainContainer, getSidenav} from '../../reducers/layout/layout.reducer';
import {getRealities, getSelectedReality, Reality} from '../../reducers/realities/realities.reducer';
import {getSystemsStats} from '../../reducers/stats/stats.reducer';
import {getSystems} from '../../reducers/systems/systems.reducer';
import {PushNotificationsService} from '../../services/push-notifications/push-notifications.service';
import {RealitiesManagerService} from '../../services/realities-manager/realities-manager.service';
import {SocketsManagerService} from '../../services/sockets-manager/sockets-manager.service';
import {SystemsManagerService} from '../../services/systems-manager/systems-manager.service';
import {EditSystemComponent} from '../edit-system/edit-system.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  systems: Observable<System[]>;
  realities: Observable<Reality[]>;
  systemWithStats: Observable<SystemWithStat[]>;

  selectedReality;

  mainContainer$: Observable<SideNavButtons>;
  sidenav$: Observable<boolean>;

  sideNavButtons = SideNavButtons;

  fillerNav = [
    {name: SideNavButtons.View, icon: 'fas fa-binoculars'},
    {name: SideNavButtons.Create, icon: 'fas fa-plus'},
    {name: SideNavButtons.Remove, icon: 'fas fa-eraser'},
    {name: SideNavButtons.Update, icon: 'fas fa-pen-fancy'}
  ];

  constructor(private pushNotificationsService: PushNotificationsService,
              private systemsManagerService: SystemsManagerService,
              private realitiesManagerService: RealitiesManagerService,
              private socketsManagerService: SocketsManagerService,
              private matSnackBar: MatSnackBar,
              private dialog: MatDialog,
              private store: Store<State>) {
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

    this.mainContainer$ = this.store.pipe(select(getMainContainer));
    this.sidenav$ = this.store.pipe(select(getSidenav));
    this.selectedReality = this.store.pipe(select(getSelectedReality));
  }

  realitySelectionChanged({value}: MatSelectChange) {
    this.store.dispatch(changeRealityAction({selectedReality: value}));
  }

  toggleSidenav() {
    this.store.dispatch(toggleSidenavAction());
  }

  optionClicked(text: SideNavButtons) {
    this.store.dispatch(showMainContainerAction({containerType: text}));
  }

  handleSystemAction(system: System, action: SideNavButtons) {
    switch (action) {
      case SideNavButtons.Remove:
        this.systemsManagerService.removeSystem(system).subscribe((id: { id: string }) => {
          this.store.dispatch(removeSystemsAction({systemId: id.id}));
          this.matSnackBar.open('System removed successfully', 'Hurray!', {duration: 3000});
        });
        break;
      case SideNavButtons.Update:
        this.dialog.open(EditSystemComponent, {
          data: {
            system,
            reality: this.realitiesManagerService.getSelectedReality()
          }
        });
        break;
    }
  }

  addSystem(event: { system: System, reality: number }) {
    this.systemsManagerService.addSystem(event.system, event.reality)
      .subscribe(() => {
        this.matSnackBar.open('System added successfully', 'Hurray!', {duration: 2000});
      });
  }

  private initServices() {
    this.pushNotificationsService.requestPermission().then();
    this.systemsManagerService.init();
    this.realitiesManagerService.init();
    this.socketsManagerService.init();
  }
}
