import {LayoutModule} from '@angular/cdk/layout';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {ChartsModule} from 'ng2-charts';
import {environment} from '../environments/environment';
import {AppComponent} from './components/app/app.component';
import {MyLineChartComponent} from './components/my-line-chart/my-line-chart.component';
import {SystemCardComponent} from './components/system-card/system-card.component';
import {SortPipe} from './pipes/sort/sort.pipe';
import {metaReducers, reducers} from './reducers';
import {PushNotificationsService} from './services/push-notifications/push-notifications.service';
import {RealitiesManagerService} from './services/realities-manager/realities-manager.service';
import {SocketsManagerService} from './services/sockets-manager/sockets-manager.service';
import {SystemsManagerService} from './services/systems-manager/systems-manager.service';
import { DateToPrettyPipe } from './pipes/date-to-pretty/date-to-pretty.pipe';


@NgModule({
  declarations: [
    AppComponent,
    SystemCardComponent,
    SortPipe,
    MyLineChartComponent,
    DateToPrettyPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LayoutModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
    ReactiveFormsModule,
    ChartsModule
  ],
  providers: [PushNotificationsService, SystemsManagerService, RealitiesManagerService, SocketsManagerService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
