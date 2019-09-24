import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Common} from '../../common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: [
    './admin.component.css',
  ]
})
export class AdminComponent implements OnInit {

  private user;

  pages = [
    {
      path: '/admin/user', title: 'Users', description: '', active: '',
      children: null,
    }
  ];

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.user = Common.getUser();

    if(this.user.role === 'superadmin') {
      this.pages.push({
        path: '/admin/lawfirm', title: 'Lawfirms', description: '', active: '',
        children: null,
      });
      this.pages.push({
        path: '#1', title: 'Forms', description: '', active: '',
        children: [
          { path: 'admin/form/main', title: 'Main Design', description: '', active: '' },
          { path: 'admin/form/schema', title: 'Form Design', description: '', active: '' },
        ]
      });
    }
  }

  ngDoCheck() {
    let url = this.router.url;
    for (let i in this.pages) {
      let page = this.pages[i];
      if (url.search(page.path) >= 0) {
        page.active = "active";
      } else {
        page.active = "";
      }
      for (let j in page.children) {
        let child = page.children[j];
        if (url.search(child.path) >= 0) {
          child.active = 'active';
          page.active = 'active';
        } else {
          child.active = '';
        }
      }
    }
  }

  navigate(path) {
    if(path.search('#') >= 0) return;
    this.router.navigate([path]);
  }
}
