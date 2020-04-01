import {LayoutModule} from '@angular/cdk/layout';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {ChartsModule} from 'ng2-charts';
import {environment} from '../environments/environment';
import {AppComponent} from './components/app/app.component';
import {CreateSystemComponent} from './components/create-system/create-system.component';
import {EditSystemComponent} from './components/edit-system/edit-system.component';
import {HeaderComponent} from './components/header/header.component';
import {MyLineChartComponent} from './components/my-line-chart/my-line-chart.component';
import {SystemCardComponent} from './components/system-card/system-card.component';
import {SystemsContainerComponent} from './components/systems-container/systems-container.component';
import {MatBadgeIconDirective} from './directives/mat-icon-badge.directive';
import {DateToPrettyPipe} from './pipes/date-to-pretty/date-to-pretty.pipe';
import {SortPipe} from './pipes/sort/sort.pipe';
import {metaReducers, reducers} from './reducers';
import {PushNotificationsService} from './services/push-notifications/push-notifications.service';
import {RealitiesManagerService} from './services/realities-manager/realities-manager.service';
import {SocketsManagerService} from './services/sockets-manager/sockets-manager.service';
import {SystemsManagerService} from './services/systems-manager/systems-manager.service';
import { GraphQLModule } from './graphql.module';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';


@NgModule({
  declarations: [
    AppComponent,
    SystemCardComponent,
    SortPipe,
    MyLineChartComponent,
    DateToPrettyPipe,
    HeaderComponent,
    CreateSystemComponent,
    MatBadgeIconDirective,
    SystemsContainerComponent,
    EditSystemComponent
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
    MatInputModule,
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
    ChartsModule,
    FormsModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatDialogModule,
    GraphQLModule
  ],
  providers: [PushNotificationsService, SystemsManagerService, RealitiesManagerService, SocketsManagerService, MatSnackBar, MatDialog
],
  bootstrap: [AppComponent]
})
export class AppModule {
}
