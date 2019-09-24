import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Client } from "../../../models/client";
import { ClientService } from "../../../services/client.service";
import { NavbarComponent } from "../../layout/navbar/navbar.component";
import { Router } from "@angular/router";
import { Notification } from "../../../common_modules/notification";
import { Common } from "../../../common";

declare let $: any;
declare let App: any;

@Component({
  selector: "app-client-list",
  templateUrl: "./client-list.component.html",
  styleUrls: ["./client-list.component.css"],
  providers: [ClientService]
})
export class ClientListComponent implements OnInit {
  private clients: Client[];
  private selected_ids = [];
  private clientsTable;

  constructor(
    private _clientService: ClientService,
    private _router: Router,
    private _cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getClients();
  }

  ngAfterViewInit() {
    let self = this;

    $(document).ready(function() {
      InitWidgets();
      InitEvents();

      function InitWidgets() {
        self.clientsTable = $("#clientsTable").DataTable({
          paging: true,
          data: [],
          bLengthChange: false,
          columns: [
            {
              title: "Name",
              data: "name"
            },
            {
              title: "Phone Number",
              data: "residence_telephone_num"
            },
            {
              title: "Gender",
              data: "gender"
            },
            {
              title: "Date of Birth",
              data: "american_birth_date"
            },
            {
              title: "Date of Birth",
              data: "american_dash_birth_date"
            }
          ],
          columnDefs: [
            {
              targets: [4],
              visible: false
            }
          ]
        });

        $(".dataTables_filter").hide();
      }

      function InitEvents() {
        self.clientsTable.on("draw", function() {
          $("#clientsTable tbody tr").unbind("click");
          $("#clientsTable tbody tr").click(function() {
            var id = this.id;

            self.selected_ids = [];
            if (id != "") {
              self.selected_ids.push(id);

              $("#clientsTable tbody tr.selected").removeClass("selected");
              $(this).addClass("selected");
            }

            // Update button enable status
            if (self.selected_ids.length == 0) {
              $("#detailButton, #formsButton, #deleteButton").addClass(
                "disabled"
              );
            } else if (self.selected_ids.length == 1) {
              $("#detailButton, #formsButton, #deleteButton").removeClass(
                "disabled"
              );
            } else {
              $("#detailButton, #formsButton").addClass("disabled");
              $("#deleteButton").removeClass("disabled");
            }
          });
          $("#clientsTable tbody tr").dblclick(function(event) {
            event.preventDefault();

            var id = this.id;
            localStorage.setItem("form_wizard", "1");
            self._router.navigate(["/pages/client/detail/" + id + "/0"]);
          });
        });

        $("#detailButton").click(function() {
          localStorage.setItem("form_wizard", "1");
          self._router.navigate([
            "/pages/client/detail/" + self.selected_ids[0] + "/0"
          ]);
        });

        $("#formsButton").click(function() {
          self._router.navigate([
            "/pages/client/finish/" + self.selected_ids[0]
          ]);
        });

        $("#deleteButton").click(function(event) {
          self.deleteClients(self.selected_ids);
        });

        $("#searchInput").change("keyup", function() {
          self.clientsTable.search(this.value).draw();
        });
      }
    });
  }

  getClients() {
    Common.showLoading();
    let self = this;

    this._clientService.getLawfirmClients().subscribe(
      data => {
        Common.hideLoading();

        this.clients = data;

        for (let i in data) {
          let row = data[i];
          row.DT_RowId = row.id;
          row.name = row.first_name + " " + row.last_name;
          row.american_birth_date = Common.americanDate(row.birth_date);
          row.american_dash_birth_date = Common.americanDate(
            row.birth_date,
            "-"
          );
        }
        console.log("clients", this.clients);

        this.selected_ids = [];
        $("#detailButton, #formsButton, #deleteButton").addClass("disabled");

        let page = this.clientsTable.page();
        this.clientsTable.clear();
        $.each(this.clients, function(index, value) {
          self.clientsTable.row.add(value);
        });
        this.clientsTable.draw();
        this.clientsTable.page(page).draw("page");

        this._cd.detectChanges();
      },
      error => {
        Common.hideLoading();
      }
    );
  }

  deleteClients(client_ids) {
    let self = this;

    Common.confirm("Are you sure to delete selected clients?", function() {
      Common.showLoading();

      self._clientService.deleteClients(client_ids).subscribe(
        data => {
          Common.hideLoading();

          let message = data.success.message || "";
          Notification.notifyAny({ message: message, title: "Server" });
          self.getClients();
          NavbarComponent.instance.refreshNotifications();
        },
        error => {
          Common.hideLoading();
        }
      );
    });
  }
}
