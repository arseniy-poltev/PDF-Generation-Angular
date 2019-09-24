import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ClientService } from "../../../services/client.service";
import { Router } from "@angular/router";
import { Notification } from "../../../common_modules/notification";
import { Common } from "../../../common";
import { isNullOrUndefined } from "util";

declare let $;
declare let App;

@Component({
  selector: "app-client-reactivation",
  templateUrl: "./client-reactivation.component.html",
  styleUrls: ["./client-reactivation.component.css"],
  providers: [ClientService]
})
export class ClientReactivationComponent implements OnInit {
  private selected_ids = [];
  private clientsTable;
  private clients;

  constructor(
    private _clientService: ClientService,
    private _router: Router,
    private _cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getDeletedClients();
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
            var index = $.inArray(id, self.selected_ids);

            if (index === -1 && id != "") {
              self.selected_ids.push(id);
            } else {
              self.selected_ids.splice(index, 1);
            }

            if (id != "") $(this).toggleClass("selected");

            // Update button enable status
            if (self.selected_ids.length == 0) {
              $("#detailButton, #reactivationButton").addClass("disabled");
            } else if (self.selected_ids.length == 1) {
              $("#detailButton, #reactivationButton").removeClass("disabled");
            } else {
              $("#detailButton").addClass("disabled");
              $("#reactivationButton").removeClass("disabled");
            }
          });
        });

        $("#detailButton").click(function() {
          self._router.navigate([
            "/pages/client/detail/" + self.selected_ids[0] + "/0"
          ]);
        });

        $("#reactivationButton").click(function() {
          self.reactivateClients(self.selected_ids);
        });

        $("#searchInput").change("keyup", function() {
          self.clientsTable.search(this.value).draw();
        });
      }
    });
  }

  getDeletedClients() {
    Common.showLoading();
    let self = this;

    this._clientService.getDeletedClients().subscribe(
      data => {
        Common.hideLoading();

        this.clients = data;
        this.selected_ids = [];

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

  reactivateClients(ids) {
    let self = this;

    Common.confirm(
      "Do you really reactivate the selected clients?",
      function() {
        self._clientService.reactivateClients(ids).subscribe(data => {
          let message = data.success.message || null;
          if (!isNullOrUndefined(message)) {
            Notification.notifyAny({ message: message, title: "Server" });
          }
          self.getDeletedClients();
        });
      }
    );
  }
}
