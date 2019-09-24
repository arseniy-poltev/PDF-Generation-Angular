import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user"
import {Common} from "../../../common";
import {isNullOrUndefined} from "util";
import {Notification} from "../../../common_modules/notification";

declare let $;
declare let bootbox;
declare let App;

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: [
    './admin-user.component.css',
    '../../../../assets/common/css/admin.css',
  ],
  providers: [UserService],
})
export class AdminUserComponent implements OnInit {
  static instance: AdminUserComponent;
  private users;
  private usersTable;
  private selected_ids = [];

  constructor(private _userService: UserService, private _cd: ChangeDetectorRef) {
    AdminUserComponent.instance = this;
  }

  ngOnInit() {
    this.getUsers();
  }

  ngAfterViewInit() {
    let self = this;

    $(document).ready(function () {
      InitWidget();
      InitEvents();

      function InitWidget() {
        self.usersTable = $("#usersTable").DataTable({
          'paging': true,
          'data': [],
          'bLengthChange': false,
          'columns': [
            {
              'title': 'Name',
              'data': 'name'
            }, {
              'title': 'Email',
              'data': 'email'
            }, {
              'title': 'Telephone Number',
              'data': 'telephone_number'
            }, {
              'title': 'Mobile Number',
              'data': 'mobile_number'
            }, {
              'title': 'Status',
              'data': 'status_html'
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

            if (index === -1) {
              self.selected_ids.push(id);
            } else {
              self.selected_ids.splice(index, 1);
            }

            $(this).toggleClass('selected');
          });
        });

        $('#deleteButton').click(function () {
          AdminUserComponent.instance.deleteUsers(self.selected_ids);
        });

        $('#approveButton').click(function () {
          AdminUserComponent.instance.approve(self.selected_ids);
        });

        $('#dismissButton').click(function () {
          AdminUserComponent.instance.dismiss(self.selected_ids);
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

    this._userService.getAllUsers()
      .subscribe(data => {
        Common.hideLoading();

        this.users = data.data;
        this.selected_ids = [];

        for (let i in this.users) {
          let row = this.users[i];
          row.DT_RowId = row.id;
          row.name = row.profile.first_name + ' ' + row.profile.last_name;
          row.telephone_number = row.profile.telephone_number;
          row.mobile_number = row.profile.mobile_number;
          row.status_html = row.status == 'approved'
            ? '<span class="badge badge-success">Approved</span>'
            : '<span class="badge badge-danger">Dismissed</span>';
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

  deleteUsers(ids) {
    if ($('#deleteButton').hasClass('disabled')) return;

    Common.confirm('Are you sure to delete the selected users?', function () {
      AdminUserComponent.instance._userService.deleteUsers(ids)
        .subscribe(data => {
          let message = data.success.message;
          Notification.notifyAny({message: message});
          AdminUserComponent.instance.getUsers();
        });
    });
  }

  approve(ids) {
    if ($('#approveButton').hasClass('disabled')) return;
    console.log('approve', ids);

    this._userService.approveUser(ids)
      .subscribe(data => {
        let message = data.success.message;
        Notification.notifyAny({message: message});
        AdminUserComponent.instance.getUsers();
      });
  }

  dismiss(ids) {
    if ($('#dismissButton').hasClass('disabled')) return;

    this._userService.dismissUser(ids)
      .subscribe(data => {
        let message = data.success.message;
        Notification.notifyAny({message: message});
        AdminUserComponent.instance.getUsers();
      });
  }
}
