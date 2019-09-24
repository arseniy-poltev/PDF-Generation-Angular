import { Component, OnInit, Input } from "@angular/core";
import { FormService } from "../../../services/form.service";
import { isNullOrUndefined } from "util";
import { Template } from "../../../models/template";
import { FormHelper } from "../form-helper";
import { ClientService } from "../../../services/client.service";
import { ErrorHandler } from "../../../common_modules/error_handler";
import { Router } from "@angular/router";
import { DocService } from "../../../services/doc.service";
import { Notification } from "../../../common_modules/notification";
import "../../../../assets/global/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js";
import "../../../../assets/plugins/jqwidgets/jqxnavigationbar.js";
import { Common } from "app/common";

declare let $: any;
declare let bootbox;
declare let App;
declare let jQuery;

@Component({
  selector: "app-form-doc",
  templateUrl: "./form-doc.component.html",
  styleUrls: ["./form-doc.component.css", "../form.component.css"],
  providers: [FormService, ClientService, DocService]
})
export class FormDocComponent implements OnInit {
  static instance: FormDocComponent;
  static saving = false;
  @Input() form_id: number;
  @Input() client_id: number;
  @Input() page_index: number;
  @Input() form_wizard: boolean;
  public doc_id: number;
  private form;
  private template;
  private page;
  private pageCount;
  private schema;
  private wizard_inputs = [];

  constructor(
    private _formService: FormService,
    private _clientService: ClientService,
    private _docService: DocService,
    private _router: Router
  ) {
    FormDocComponent.instance = this;
    this.client_id = 0; // if new client id is zero.
  }

  ngOnInit() {
    this.page_index = 1;
    this.form_wizard =
      localStorage.getItem("form_wizard") == "1" ? true : false;

    this.onResize();
    let self = this;
    $(document).ready(function() {
      $(window).resize(function() {
        self.onResize();
      });
    });

    // TODO: Autosave document automatically by 1 min interval
    // if (!FormDocComponent.saving) {
    //   window.setInterval(function () {
    //     if (self.client_id != 0 && self._router.url.indexOf('client/detail') > -1) {
    //       self.submitDoc();
    //     }
    //   }, 60000);
    //   FormDocComponent.saving = true;
    // }
  }

  onResize() {
    // $('.form-container').height($(window).height() - 100);
  }

  ngOnChanges() {
    this.getForm();
  }

  getForm() {
    Common.showLoading();
    this._formService.getForm(this.form_id).subscribe(
      data => {
        this.form = data;
        this.extractTemplate();
        if (this.client_id == 0) {
          this.resetDoc();
        }
        this.refreshDocSchema();
        if (this.form_wizard) {
          //for client form. should be changed later. it
          if (this.client_id > 0) {
            this._docService
              .addClientDoc(this.client_id, [0])
              .subscribe(data => {
                this.getDoc();
                Common.hideLoading();
              });
          } else Common.hideLoading();
        } else {
          this.getDoc();
          Common.hideLoading();
        }
      },
      error => {
        Common.hideLoading();
      }
    );
  }

  extractTemplate() {
    if (this.form.template == "") {
      this.template = new Template();
      return;
    }
    try {
      this.template = JSON.parse(this.form.template);

      if (isNullOrUndefined(this.template.pages)) {
        this.template.pages = [];
      }
      this.pageCount = this.template.pages.length;

      if (isNullOrUndefined(this.template.wizards)) {
        this.template.wizards = [];
      }
    } catch (e) {
      console.log("form-doc-component: Json Parse failed");
      console.log(this.form.template);
    }
  }

  refreshDocSchema() {
    if (this.form_wizard) {
      /*$("#docContainer").hide();
      $("#wizardContainer").show();
      $("#wizardContainer").html(
        '<form class="form-horizontal" action="#" id="wizardForm" method="POST">\
          <div class="form-wizard">\
            <div class="form-body">\
              <div id="wizardTabsContainer" class="tab-content create-client-body">\
              </div>\
              <hr>\
            </div>\
          </div>\
        </form>'
      );

      this.buildWizards();*/
      //for client form
      $("#docContainer").show();
      $("#wizardContainer").hide();
      $("#docContainer").html("");

      this.page = this.template.pages[this.page_index - 1] || [];
      let body = this.page.body || null;
      if (!isNullOrUndefined(body)) {
        this.schema = body.schema || [];
        let page_container = $('<div class="doc-wrapper"></div>');
        FormHelper.buildFormWizardHtml(page_container, this.page);
        $("#docContainer").append(page_container);
      }
      $(
        "#normal_has_mailing_address_yes, #normal_has_mailing_address_no"
      ).change(function() {
        FormDocComponent.instance.handleSpecialEvents();
      });
      $("#normal_has_mailing_address_yes")[0].checked = true;
      this.handleSpecialEvents();
    } else {
      $("#docContainer").show();
      $("#wizardContainer").hide();
      $("#docContainer").html("");

      this.page = this.template.pages[this.page_index - 1] || [];
      let body = this.page.body || null;
      if (!isNullOrUndefined(body)) {
        this.schema = body.schema || [];
        let page_container = $('<div class="doc-wrapper"></div>');
        FormHelper.buildHtml(page_container, this.page);
        $("#docContainer").append(page_container);
      }
    }
    $(document).ready(function(this) {
      $(".checkbox-group input[type=checkbox]").on("change", function(this) {
        //console.log(`${$(`:checkbox[name=${this.name}]`).length}`);
        if ($(`:checkbox[name=${this.name}]`).length > 1) {
          $(`:checkbox[name=${this.name}]`)
            .not(this)
            .attr("checked", false);
          //$(this).attr("checked", true);
        }
      });
    });
  }

  extractInputs() {
    if (!this.form_wizard) {
      let inputs = {};
      for (let i in this.schema) {
        let item = this.schema[i];
        inputs = FormHelper.extractItem(item, inputs);
      }
      FormHelper.setLocalDoc(
        this.client_id,
        this.form_id,
        this.page_index,
        inputs
      );
    } else {
      for (let i in this.template.pages) {
        let index = Number(i) + 1;
        let page = this.template.pages[i];
        let inputs = {};
        for (let j in page.body.schema) {
          let item = page.body.schema[j];
          inputs = FormHelper.extractItem(item, inputs);
        }
        FormHelper.setLocalDoc(this.client_id, this.form_id, index, inputs);
      }
    }
  }

  seedInputs() {
    if (!this.form_wizard) {
      // seed doc page inputs
      FormHelper.seedPage(
        this.page,
        this.client_id,
        this.form_id,
        this.page_index
      );
    } else {
      // seed wizard inputs
      for (let i in this.template.pages) {
        let index = Number(i) + 1;
        let page = this.template.pages[i];
        FormHelper.seedPage(page, this.client_id, this.form_id, index);
      }
    }
  }

  validateByPattern(str, pattern) {
    var patt = new RegExp(pattern);
    var res = patt.test(str);

    return res;
  }

  validationDom(item, value, pattern, errorTitle, errorMessage) {
    let dom = $("[dom-id=" + item.id + "]");
    if (!isNullOrUndefined(value) && !this.validateByPattern(value, pattern)) {
      dom.focus();
      Notification.notifyAny({
        message: errorMessage,
        type: "error",
        title: errorTitle
      });
      return false;
    }

    return true;
  }

  validateItem(item, value) {
    if (item.no_need_validation && value == null) {
      return true;
    }
    let validationType = item.validation_type;
    let validationLabel = item.validation_label;
    if (Common.isNone(validationLabel)) validationLabel = item.label;
    if (Common.isNone(validationLabel)) validationLabel = "The focused field";
    switch (validationType) {
      case "A-Number":
        return this.validationDom(
          item,
          value,
          /^\d{8,9}$/,
          "A-Number mismatch",
          validationLabel + " is missing type. eg: 12345678, 123456789"
        );
      case "Number":
        return this.validationDom(
          item,
          value,
          /^-?[0-9][0-9,\.]+$/,
          "Needs to be Number type",
          validationLabel + " is missing type. eg: 12.34"
        );
      case "000-00-0000":
        /*return this.validationDom(
          item,
          value,
          /^\d{3}-\d{2}-\d{4}$/,
          "Format 000-00-0000",
          validationLabel + " is missing type. eg: 123-45-7890"
        );*/
        return true;
      case "date":
      case "date2":
        return this.validationDom(
          item,
          value,
          /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/,
          "Invalid date",
          validationLabel + " is invalid date. eg: 2019-01-01"
        );
    }

    return true;
  }

  submitDoc() {
    Common.showLoading();

    this.extractInputs();

    let data = [];
    //console.log("subimt page", this.page_index);
    // Save one page
    // for (let i = 0; i < this.pageCount; i++) {
    let i = this.page_index - 1;
    let inputs = FormHelper.getLocalDoc(this.client_id, this.form_id, i + 1);
    let body = this.template.pages[i].body || { schema: [] };
    let schema = body.schema;
    for (let j in schema) {
      let item = schema[j];
      if (FormHelper.isInput(item.type)) {
        let value = inputs[item.key] || null;
        //console.log(item);
        //console.log(inputs);
        // validate the inputs
        if (!Common.isNone(item.validation_type)) {
          if (!this.validateItem(item, value)) {
            Common.hideLoading();
            return;
          }
        }

        //no need validation and in case of empty field
        if (isNullOrUndefined(value) && !isNullOrUndefined(inputs[item.key])) {
          value = "";
        }

        if (value != null) {
          let input = {
            key: item.key,
            value: value,
            foreign_key: item.foreign_key || "",
            type: item.type,
            structure: item.structure
          };
          data.push(input);
        }
      }
    }

    if (this.form_id == 1) {
      var photo_data =
        localStorage.getItem("client_photo") || "/assets/common/img/avatar.png";
      let photo = {
        key: "client_photo",
        value: photo_data,
        foreign_key: "clients.photo",
        type: "input"
      };
      data.push(photo);
    }

    if (this.client_id == 0) {
      // Create client
      this._clientService.createClient(data).subscribe(
        response => {
          let message = response.message;
          this.client_id = response.client_id;
          Notification.notifyAny({ message: message });

          this._docService
            .createDoc(data, this.client_id, this.form_id)
            .subscribe(data => {
              this._router.navigate(["/pages/client/finish/" + this.client_id]);
            });

          Common.hideLoading();
        },
        error => {
          Common.hideLoading();
        }
      );
    } else {
      // Update client
      this._clientService.updateClient(data, this.client_id).subscribe(
        data => {
          let message = data.success.message || "";
          if (message != "") {
            Notification.notifyAny({ message: message, title: "Server" });
          }
          this.getDoc();

          Common.hideLoading();
        },
        error => {
          Common.hideLoading();
        }
      );

      this._docService.updateDoc(data, this.doc_id).subscribe(data => {});
    }
  }

  getDoc() {
    if (this.client_id == 0) return;

    this._docService
      .getDocByClientForm(this.client_id, this.form_id)
      .subscribe(data => {
        this.doc_id = data.doc.id;
        for (let i in this.template.pages) {
          let schema = FormHelper.getSchema(this.template, i);
          let inputs = FormHelper.buildInputs(schema, data);
          FormHelper.setLocalDoc(
            this.client_id,
            this.form_id,
            Number(i) + 1,
            inputs
          );
        }
        this.seedInputs();

        var photo_data = data["clients.photo"];
        $("#clientPhotoImage").attr("src", photo_data);
        localStorage.setItem("photo_data", photo_data);
      });
  }

  resetDoc() {
    for (let i = 0; i < this.pageCount; i++) {
      FormHelper.setLocalDoc(this.client_id, this.form_id, i + 1, "{}");
    }
  }

  buildWizards() {
    this.initInputsBySection();

    $("#wizardNavigator").html("");
    $("#wizardTabsContainer").html("");
    for (let i in this.template.wizards) {
      let wizard = this.template.wizards[i];
      let wizardDiv = $("<div></div>");

      for (let j in wizard.sections) {
        let section = wizard.sections[j];
        let formBody = $("<div></div>");

        if (!isNullOrUndefined(this.wizard_inputs[wizard.id])) {
          let inputs = this.wizard_inputs[wizard.id][section.id];
          for (let k in inputs) {
            let input = inputs[k];
            if (input.key == "") continue;

            let form_group = $(
              '<div class="' + input.response_class + '"></div>'
            );
            let label_style = "";
            if (input.response_class.includes("d-flex")) {
              label_style = "width: 50%; margin-right: 15px";
            }
            form_group.append(
              $(
                '<label class="label-grey" style="' +
                  label_style +
                  '">' +
                  input.label +
                  "</label>"
              )
            );
            let input_item = this.getInputByItem(input);

            if (input.validation_type === "A-Number") {
              let div_input_table = $('<table style="width: 100%"></table>');
              let div_input_group = $("<tr></tr>");
              div_input_group.append($('<td style="width: 20px;">A -</td>'));
              let input_td = $("<td></td>");
              input_td.append(input_item);
              div_input_group.append(input_td);
              div_input_table.append(div_input_group);
              form_group.append(div_input_table);
            } else {
              form_group.append(input_item);
            }
            if (input.new_row) {
              let row = $('<div class="row wizard-row"></div>');

              // Create upload input
              if (input.label.includes("Print your complete name.")) {
                console.log("photo input building...");
                row.append(
                  $(
                    "<div style='margin-bottom: 30px; width: 200px; margin-left: auto; margin-right: auto'><img id='clientPhotoImage' width='180px' height='180px' src='/assets/common/img/avatar.png' /><input style='margin-top: 20px' id='photoInput' type='file'></div>"
                  )
                );
              }

              if (input.group_label != "") {
                row.append(
                  $(
                    '<div class="col-md-12"><label class="label-grey">' +
                      input.group_label +
                      "</label></div>"
                  )
                );
              }
              row.append(form_group);

              formBody.append(row);
            } else {
              formBody.children(".row:last").append(form_group);
            }
          }
        }

        wizardDiv.append(formBody);
      }

      $("#wizardTabsContainer").append(wizardDiv);
    }

    // add special events
    $("#normal_has_mailing_address_yes, #normal_has_mailing_address_no").change(
      function() {
        FormDocComponent.instance.handleSpecialEvents();
      }
    );

    // Init upload photo events
    $("#photoInput").change(function(event) {
      var FR = new FileReader();

      FR.addEventListener("load", function(e) {
        let type = e.target["result"].split("/")[0];
        if (type != "data:image") {
          Notification.notifyAny({ message: "Please upload an image." });
        } else {
          $("#clientPhotoImage").attr("src", e.target["result"]);
          localStorage.setItem("client_photo", e.target["result"]);
        }
      });

      FR.readAsDataURL(event.target.files[0]);
    });
  }

  handleSpecialEvents() {
    try {
      var hasMailingAddress = $("#normal_has_mailing_address_yes")[0].checked;
      var mailingKeys = [
        "us_mailing_address_care",
        "us_mailing_street_number_name",
        "mailing_address_apt_type_apartment",
        "mailing_address_apt_type_suite",
        "mailing_address_apt_type_floor",
        "us_mailing_apt_number",
        "us_mailing_city",
        "us_mailing_state",
        "us_mailing_zip_code",
        "us_mailing_address_county",
        "us_mailing_address_province",
        "us_mailing_address_postal_code",
        "us_mailing_address_country"
      ];
      var mailingIds = [
        "normal_us_mailing_address_care",
        "normal_us_mailing_street_number_name",
        "normal_mailing_address_apt_type_apartment",
        "normal_mailing_address_apt_type_suite",
        "normal_mailing_address_apt_type_floor",
        "normal_us_mailing_apt_number",
        "normal_us_mailing_city",
        "normal_us_mailing_state",
        "normal_us_mailing_zip_code",
        "normal_us_mailing_address_county",
        "normal_us_mailing_address_province",
        "normal_us_mailing_address_postal_code",
        "normal_us_mailing_address_country"
      ];
      if (!hasMailingAddress) {
        for (let i = 0; i < mailingIds.length; i++) {
          switch (i) {
            case 2: //apt
              $("#" + mailingIds[i])[0].checked = false;
              break;
            case 3: //ste
              $("#" + mailingIds[i])[0].checked = false;
              break;
            case 4: //flr
              $("#" + mailingIds[i])[0].checked = false;
              break;
            default:
              $("#" + mailingIds[i])[0].value = "";
          }
        }
      }

      for (var i in mailingIds) {
        $("#" + mailingIds[i])[0].disabled = !hasMailingAddress;
      }
      $(
        "#normal_mailing_address_apt_type, #normal_residence_apartment_type"
      ).css("text-align", "right");
    } catch (e) {}
  }

  initInputsBySection() {
    this.wizard_inputs = [];
    for (let i in this.template.pages) {
      let page = this.template.pages[i];
      let schema = page.body.schema;
      for (let j in schema) {
        let item = schema[j];
        if (!isNullOrUndefined(item.wizard_id)) {
          if (isNullOrUndefined(this.wizard_inputs[item.wizard_id])) {
            this.wizard_inputs[item.wizard_id] = [];
          }
          if (!isNullOrUndefined(item.section_id)) {
            if (
              isNullOrUndefined(
                this.wizard_inputs[item.wizard_id][item.section_id]
              )
            ) {
              this.wizard_inputs[item.wizard_id][item.section_id] = [];
            }
            this.wizard_inputs[item.wizard_id][item.section_id].push(item);
          }
        }
      }
    }
  }

  getInputByItem(item, type = "normal") {
    let dom;
    let classes = item.classes ? item.classes : "";

    switch (item.type) {
      case "input":
        dom = $("<input>");
        dom.addClass("form-control");
        if (item.validation_type == "date" || item.validation_type == "date2")
          dom.attr("type", "date");
        break;
      case "textarea":
        dom = $("<textarea></textarea>");
        dom.addClass("form-control");
        break;
      case "radio":
        dom = $("<div></div>");
        FormHelper.createBoxes(dom, item, "radio");
        break;
      case "checkbox":
        dom = $("<div></div>");
        FormHelper.createBoxes(dom, item, "checkbox");
        break;
      case "select":
        dom = $("<select></select>");
        dom.css("width", "100%");
        if (type == "print") {
          dom = $("<div></div>");
        } else {
          try {
            let options = JSON.parse(item.structure);
            for (let i = 0; i < options.length; i++) {
              var option;
              if (typeof options[i] == "string")
                option = $(
                  '<option value="' +
                    options[i] +
                    '">' +
                    options[i] +
                    "</option>"
                );
              else
                option = $(
                  '<option value="' +
                    options[i].value +
                    '">' +
                    options[i].label +
                    "</option>"
                );
              dom.append(option);
            }
          } catch (e) {
            console.log(
              "form-doc-component: getInputByItem - Json Parse failed"
            );
            //console.log(item.structure);
          }
        }
        break;
    }
    if (isNullOrUndefined(dom)) {
      return;
    }

    dom.addClass(classes);
    if (FormHelper.isInput(item.type) && !isNullOrUndefined(item.key)) {
      dom.attr("id", type + "_" + item.key);
      dom.attr("dom-id", item.id);
    }

    return dom;
  }
}
