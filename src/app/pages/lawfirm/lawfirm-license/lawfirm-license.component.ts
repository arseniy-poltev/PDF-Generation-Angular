import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-lawfirm-license',
  templateUrl: './lawfirm-license.component.html',
  styleUrls: ['./lawfirm-license.component.css',
  ]
})
export class LawfirmLicenseComponent implements OnInit {
  agreed : boolean;

  constructor(private router: Router) { }

  ngOnInit() {
    this.agreed = false;
  }

  navigate(url) {
    if (this.agreed)
    {
      this.router.navigate([url]);
    }
  }
}
