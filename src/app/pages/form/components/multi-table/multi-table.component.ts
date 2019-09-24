import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-multi-table',
  templateUrl: './multi-table.component.html',
  styleUrls: [
  		'./multi-table.component.css',
    	'../../form.component.css',
    ]
})
export class MultiTableComponent implements OnInit {
	@Input() data: any;

  constructor() { }

  ngOnInit() {
  }

}
