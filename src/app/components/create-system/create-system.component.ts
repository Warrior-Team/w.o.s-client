import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {System} from '../../models/system';
import {Reality} from '../../reducers/realities/realities.reducer';

@Component({
  selector: 'app-create-system',
  templateUrl: './create-system.component.html',
  styleUrls: ['./create-system.component.css']
})
export class CreateSystemComponent implements OnInit {
  @Input() realities: Reality[];
  @Output() sendEmitter: EventEmitter<{ system: System, reality: number }>;

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.sendEmitter = new EventEmitter<{ system: System, reality: number }>();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: '',
      url: '',
      details: '',
      icon: '',
      team: '',
      reality: ''
    });
  }

  onSubmit(formValue) {
    this.sendEmitter.emit({system: formValue, reality: formValue.reality});
  }
}
