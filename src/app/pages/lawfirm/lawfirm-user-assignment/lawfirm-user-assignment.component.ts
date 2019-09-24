import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user";
import {Notification} from "../../../common_modules/notification";
import { Common } from 'app/common';

declare let $;
declare let App;

@Component({
  selector: 'app-lawfirm-user-assignment',
  templateUrl: './lawfirm-user-assignment.component.html',
  styleUrls: ['./lawfirm-user-assignment.component.css'],
  providers: [UserService]
})

export class LawfirmUserAssignmentComponent implements OnInit {
  private users: User[];
  private lawfirm;
  private usersTable;
  private selected_ids = [];

  constructor(private _userService: UserService,
    private _router: Router,
    private _cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.getUsers();
    this.getLawfirm();
  }

  ngAfterViewInit() {
    let self = this;

    $(document).ready(function () {
      InitWidgets();
      InitEvents();

      function InitWidgets() {
        self.usersTable = $("#usersTable").DataTable({
          'paging': true,
          'data': [],
          'bLengthChange': false,
          'columns': [
            {
              'title': 'Name',
              'data': 'name'
            }, {
              'title': 'Gender',
              'data': 'gender'
            }, {
              'title': 'Date of Birth',
              'data': 'american_birth_date'
            }, {
              'title': 'Email Address',
              'data': 'email'
            }, {
              'title': 'Phone Number',
              'data': 'phone_number'
            }, {
              'title': 'Status',
              'data': 'status_html'
            }, {
              'title': 'Date of Birth',
              'data': 'american_dash_birth_date',
            }
          ], "columnDefs": [
            {
              "targets": [6],
              "visible": false
            }
          ]
        });

        $('.dataTables_filter').hide();
      }

      function InitEvents() {
        self.usersTable.on('draw', function () {
          $('#usersTable tbody tr').unbind('click');
          $('#usersTable tbody tr').click(function () {
            var id = this.id;
            var index = $.inArray(id, self.selected_ids);

            if (index === -1 && id != "") {
              self.selected_ids.push(id);
            } else {
              self.selected_ids.splice(index, 1);
            }

            if (id != "") $(this).toggleClass('selected');

            // Update button enable status
            if (self.selected_ids.length == 0) {
              $('#detailButton, #approveButton, #dismissButton').addClass('disabled');
            } else if (self.selected_ids.length == 1) {
              $('#detailButton, #approveButton, #dismissButton').removeClass('disabled');
            } else {
              $('#detailButton').addClass('disabled');
              $('#approveButton, #dismissButton').removeClass('disabled');
            }
          });
        });

        $('#detailButton').click(function () {
          self.detail(self.selected_ids[0]);
        });

        $('#approveButton').click(function () {
          self.approve(self.selected_ids);
        });

        $('#dismissButton').click(function () {
          self.dismiss(self.selected_ids);
        });

        $('#searchInput').change('keyup', function () {
          self.usersTable.search(this.value).draw();
        });
      }
    });
  }

  getUsers() {
    Common.showLoading();
    let self = this;

    this._userService.getNewUsers()
      .subscribe(data => {
        Common.hideLoading();

        this.users = data;
        this.selected_ids = [];

        for (let i in data) {
          let row = data[i];
          row.DT_RowId = row.id;
          row.name = row.profile.first_name + ' ' + row.profile.last_name;
          row.gender = row.profile.gender;
          row.birth_date = row.profile.birthday;
          row.phone_number = row.profile.phone;
          row.status_html = row.status == 'approved'
            ? '<span class="badge badge-success">Approved</span>'
            : '<span class="badge badge-danger">Dismissed</span>';
          row.american_birth_date = Common.americanDate(row.birth_date);
          row.american_dash_birth_date = Common.americanDate(row.birth_date, "-");
        }

        console.log('users', this.users);

        let page = this.usersTable.page();
        this.usersTable.clear();
        $.each(this.users, function (index, value) {
          self.usersTable.row.add(value);
        });
        this.usersTable.draw();
        this.usersTable.page(page).draw('page');

        this._cd.detectChanges();

      }, error => {
        Common.hideLoading();
      });
  }

  detail(id) {
    localStorage.setItem('user_profile', JSON.stringify(this.users.find(i => i.id == id)));
    this._router.navigate(['/pages/lawfirm/user_assignment/detail/' + id]);
  }

  approve(ids) {
    let self = this;

    this._userService.approveUser(ids)
      .subscribe(data => {
        let message = data.success.message;
        Notification.notifyAny({message: message});
        self.getUsers();
      });
  }

  dismiss(ids) {
    let self = this;

    this._userService.dismissUser(ids)
      .subscribe(data => {
        let message = data.success.message;
        Notification.notifyAny({message: message});
        self.getUsers();
      });
  }

  getLawfirm() {
    this._userService.getMe()
      .subscribe(data => {
        this.lawfirm = data.lawfirm;
      });
  }
}
