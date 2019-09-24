import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-select',
  templateUrl: './form-select.component.html',
  styleUrls: ['./form-select.component.css']
})
export class FormSelectComponent implements OnInit {
  forms = [
    'Part A.I. Information About You',
    'Part A.II. Information About Your Spouse and Children',
    'Part A.III. Information About Your Background',
    'Part B. Information About Your Application',
    'Part C. Additional Information About Your Application',
    'Part D. Your Signature',
  ];

  constructor() { }

  ngOnInit() {
  }

}
