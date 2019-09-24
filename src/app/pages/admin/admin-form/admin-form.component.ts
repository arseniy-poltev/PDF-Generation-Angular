import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormService } from "../../../services/form.service";
import { Form } from "../../../models/form";
import { Template } from "../../../models/template";
import { Pagination } from "../../../shared/components/pagination/pagination";
import { isNullOrUndefined } from "util";
import { DropdownlistItem } from "../../../shared/components/dropdownlist/dropdownlist.item";
import { FormHelper } from "../../form/form-helper";
import { Notification } from "../../../common_modules/notification";

import "../../../../assets/plugins/jqwidgets/jqxbuttons.js";
import "../../../../assets/plugins/jqwidgets/jqxscrollbar.js";
import "../../../../assets/plugins/jqwidgets/jqxlistbox.js";
import "../../../../assets/plugins/jqwidgets/jqxdropdownlist.js";
import "../../../../assets/plugins/jqwidgets/jqxdropdownbutton.js";
import "../../../../assets/plugins/jqwidgets/jqxcolorpicker.js";
import "../../../../assets/plugins/jqwidgets/jqxwindow.js";
import "../../../../assets/plugins/jqwidgets/jqxeditor.js";
import "../../../../assets/plugins/jqwidgets/jqxtooltip.js";
import "../../../../assets/plugins/jqwidgets/jqxcheckbox.js";

declare var $: any;
declare var bootbox: any;

@Component({
  selector: "app-admin-form",
  templateUrl: "./admin-form.component.html",
  styleUrls: [
    "./admin-form.component.css",
    "../../../../assets/common/css/admin.css"
  ],
  providers: [FormService]
})
export class AdminFormComponent implements OnInit {
  private types: DropdownlistItem[];
  private type: DropdownlistItem;
  private forms: Form[];
  private form: Form;
  private template: Template;
  private pagination: Pagination;
  private page_index: number; // Template index
  static instance: AdminFormComponent;
  private selected_wizard;

  constructor(private _formService: FormService) {
    AdminFormComponent.instance = this;
  }

  ngOnInit() {
    this.template = new Template();
    this.pagination = new Pagination();
    this.getForms();
  }

  ngAfterViewInit() {
    $(document).ready(function() {
      InitWidgets();
      InitEvents();

      function InitWidgets() {
        $("#headerEditor, #footerEditor").jqxEditor({
          width: "100%",
          height: 150
        });

        $("#wizardList").jqxListBox({
          width: "100%",
          theme: "metro",
          autoHeight: true,
          displayMember: "name",
          valueMember: "id"
        });

        $("#wizardSectionsList").jqxListBox({
          width: "100%",
          theme: "metro",
          autoHeight: true,
          displayMember: "name",
          valueMember: "id"
        });
      }

      function InitEvents() {
        $("#wizardList").on("select", function(event) {
          let id = event.args.item.value;
          AdminFormComponent.instance.refreshSections(id);
          $("#wizardNameInput").val(event.args.item.label);
        });

        $("#wizardSectionsList").on("select", function(event) {
          $("#sectionNameInput").val(event.args.item.label);
        });
      }
    });
  }

  getForms() {
    this._formService.getForms().subscribe(data => {
      this.forms = data.data;
      this.types = [];
      for (var i in this.forms) {
        this.types.push(
          new DropdownlistItem(this.forms[i].id, this.forms[i].type)
        );
      }
      if (!isNullOrUndefined(this.types[0])) {
        this.type = this.types[0];
        this.typeSelected(this.type.value);
      }
    });
  }

  typeSelected(id) {
    this.getForm(id);

    localStorage.setItem("form.id", id.toString());
  }

  getForm(id) {
    this.pagination = new Pagination();

    this._formService.getForm(id).subscribe(data => {
      this.form = data;
      if (this.form.template != "") {
        this.extractTemplate();
      } else {
        this.template = new Template();
      }

      this.initForm();
    });
  }

  initForm() {
    $("#nameInput").val(this.form.name);
    $("#descriptionInput").val(this.form.description);
    $("#headerEditor").val("");
    $("#footerEditor").val("");
  }

  refreshData() {
    this.form.name = $("#nameInput").val();
    this.form.description = $("#descriptionInput").val();

    if (this.template.pages.length > 0) {
      let page = this.template.pages[this.page_index];
      page.header = $("#headerEditor").val();
      page.footer = $("#footerEditor").val();
    }

    this.form.template = JSON.stringify(this.template);
  }

  updateForm() {
    this.refreshData();

    this._formService.updateForm(this.form).subscribe(data => {
      let message = data.success.message;
      Notification.notifyAny({ message: message });
    });
  }

  extractTemplate() {
    try {
      this.template = JSON.parse(this.form.template);

      if (isNullOrUndefined(this.template.pages)) {
        this.template.pages = [];
      }
      this.pagination.total_pages = this.template.pages.length;
      this.pagination.current_page = 1;

      if (isNullOrUndefined(this.template.wizards)) {
        this.template.wizards = [];
      }
      this.refreshWizards();
    } catch (e) {
      console.log("admin-form-component: Json Parse failed");
      console.log(this.form.template);
    }
  }

  refreshWizards() {
    let source = {
      datatype: "json",
      datafields: [{ name: "name" }, { name: "id" }],
      id: "id",
      localdata: this.template.wizards
    };
    let dataAdapter = new $.jqx.dataAdapter(source);
    $("#wizardList").jqxListBox({ source: dataAdapter });
  }

  refreshSections(wizard_id) {
    let index = this.getWizardIndexById(wizard_id);
    this.selected_wizard = this.template.wizards[index];
    let sections = this.selected_wizard.sections || [];

    let source = {
      datatype: "json",
      datafields: [{ name: "name" }, { name: "id" }],
      id: "id",
      localdata: sections
    };
    let dataAdapter = new $.jqx.dataAdapter(source);
    $("#wizardSectionsList").jqxListBox({ source: dataAdapter });
  }

  addPage() {
    this.pagination.total_pages++;
    this.pagination.current_page = this.pagination.total_pages;
    this.template.pages.push({});
  }

  removePage() {
    if (this.pagination.total_pages <= 0) {
      return;
    }
    this.pagination.total_pages--;
    this.pagination.current_page = this.pagination.total_pages;
    this.template.pages.pop();
  }

  pageSelected(event) {
    this.page_index = event.current_page - 1;
    if (isNullOrUndefined(this.template.pages)) {
      return;
    }
    if (isNullOrUndefined(this.template.pages[this.page_index])) {
      return;
    }
    let page = this.template.pages[this.page_index];
    let header = isNullOrUndefined(page.header) ? "" : page.header;
    $("#headerEditor").val(header);
    let footer = isNullOrUndefined(page.footer) ? "" : page.footer;
    $("#footerEditor").val(footer);

    localStorage.setItem("form.page", event.current_page.toString());
  }

  addWizard() {
    let wizard = {
      id: FormHelper.getRandomId(),
      name: $("#wizardNameInput").val(),
      sections: []
    };
    this.template.wizards.push(wizard);
    this.refreshWizards();
  }

  updateWizard() {
    let item = $("#wizardList").jqxListBox("getSelectedItem");
    if (item) {
      let index = this.getWizardIndexById(item.value);
      let wizard = this.template.wizards[index];
      wizard.name = $("#wizardNameInput").val();
      this.refreshWizards();
    }
  }

  removeWizard() {
    let item = $("#wizardList").jqxListBox("getSelectedItem");
    if (item) {
      let index = this.getWizardIndexById(item.value);
      this.template.wizards.splice(index, 1);
      this.refreshWizards();
    }
  }

  getWizardIndexById(id) {
    for (let i in this.template.wizards) {
      let wizard = this.template.wizards[i];
      if (wizard.id == id) {
        return Number(i);
      }
    }
  }

  addSection() {
    if (isNullOrUndefined(this.selected_wizard)) {
      return;
    }
    let section = {
      id: FormHelper.getRandomId(),
      name: $("#sectionNameInput").val()
    };
    let sections = this.selected_wizard.sections || [];
    sections.push(section);
    this.refreshSections(this.selected_wizard.id);
  }

  updateSection() {
    let item = $("#wizardSectionsList").jqxListBox("getSelectedItem");
    if (item) {
      let index = this.getSectionIndexById(item.value);
      let section = this.selected_wizard.sections[index];
      section.name = $("#sectionNameInput").val();
      this.refreshSections(this.selected_wizard.id);
    }
  }

  removeSection() {
    if (isNullOrUndefined(this.selected_wizard)) {
      return;
    }
    let item = $("#wizardSectionsList").jqxListBox("getSelectedItem");
    let sections = this.selected_wizard.sections || [];
    if (item) {
      let index = this.getSectionIndexById(item.value);
      sections.splice(index, 1);
      this.refreshSections(this.selected_wizard.id);
    }
  }

  getSectionIndexById(id) {
    let sections = this.selected_wizard.sections || [];
    for (let i in sections) {
      let section = sections[i];
      if (section.id == id) {
        return Number(i);
      }
    }
  }
}
