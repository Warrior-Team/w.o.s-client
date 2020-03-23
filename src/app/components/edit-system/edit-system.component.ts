import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {updateSystemsAction} from '../../actions/system.actions';
import {System} from '../../models/system';
import {State} from '../../reducers';
import {getRealities, Reality} from '../../reducers/realities/realities.reducer';
import {SystemsManagerService} from '../../services/systems-manager/systems-manager.service';

@Component({
  selector: 'app-edit-system',
  templateUrl: './edit-system.component.html',
  styleUrls: ['./edit-system.component.css']
})
export class EditSystemComponent implements OnInit {

  realities: Observable<Reality[]>;
  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { reality: Reality, system: System },
              private dialogRef: MatDialogRef<EditSystemComponent>,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private systemsManagerService: SystemsManagerService,
              private store: Store<State>) {
  }

  ngOnInit(): void {
    this.realities = this.store.pipe(select(getRealities));
    this.form = this.formBuilder.group({
      name: this.data.system.name,
      url: this.data.system.url,
      details: this.data.system.details,
      icon: this.data.system.icon,
      team: this.data.system.team,
      reality: new FormControl({value: this.data.reality.warriorReality, disabled: true}, Validators.required),
      id: this.data.system.id
    });
  }

  handleSend(event: { system: System, reality: number }) {
    this.systemsManagerService.updateSystem(event.system, this.data.reality.warriorReality).subscribe((systems: System[]) => {
      this.dialogRef.close();
      this.snackBar.open('System updated successfully', 'Lets Drink to that');
      this.store.dispatch(updateSystemsAction({systems}));
    });
  }
}
