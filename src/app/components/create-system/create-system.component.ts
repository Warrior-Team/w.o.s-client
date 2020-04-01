import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatSelectChange} from '@angular/material/select/select';
import {System} from '../../models/system';
import {Reality} from '../../reducers/realities/realities.reducer';

@Component({
  selector: 'app-create-system',
  templateUrl: './create-system.component.html',
  styleUrls: ['./create-system.component.css']
})
export class CreateSystemComponent implements OnInit {
  @Input() realities: Reality[];
  @Input() form?: FormGroup;
  @Output() sendEmitter: EventEmitter<{ system: System, reality: number }>;

  selectedReality;

  constructor(private formBuilder: FormBuilder) {
    this.sendEmitter = new EventEmitter<{ system: System, reality: number }>();
  }

  ngOnInit(): void {
    this.selectedReality = '';
    this.form = this.form || this.formBuilder.group({
      name: '',
      url: '',
      details: '',
      icon: '',
      team: '',
      reality: ''
    });
  }

  realitySelectionChanged({value}: MatSelectChange) {
    this.selectedReality = value;
  }

  onSubmit() {
    if (this.form.valid) {
      const {reality, ...restOfSystem} = this.form.value;
      // const formValue = this.form.value;
      this.sendEmitter.emit({system: restOfSystem, reality});
      this.form = new FormGroup({});
    }
  }
}
