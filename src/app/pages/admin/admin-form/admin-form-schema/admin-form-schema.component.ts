import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Form } from "../../../../models/form";
import { FormService } from "../../../../services/form.service";
import { Template } from "../../../../models/template";
import { Common } from "../../../../common";
import { FormHelper } from "../../../form/form-helper";
import { isNullOrUndefined } from "util";
import { forEach } from "@angular/router/src/utils/collection";
import { Notification } from "../../../../common_modules/notification";
import "../../../../../assets/plugins/jqwidgets/jqxbuttons.js";
import "../../../../../assets/plugins/jqwidgets/jqxscrollbar.js";
import "../../../../../assets/plugins/jqwidgets/jqxpanel.js";
import "../../../../../assets/plugins/jqwidgets/jqxtree.js";
import "../../../../../assets/plugins/jqwidgets/jqxdropdownbutton.js";
import "../../../../../assets/plugins/jqwidgets/jqxcolorpicker.js";
import "../../../../../assets/plugins/jqwidgets/jqxwindow.js";
import "../../../../../assets/plugins/jqwidgets/jqxeditor.js";
import "../../../../../assets/plugins/jqwidgets/jqxtooltip.js";
import "../../../../../assets/plugins/jqwidgets/jqxcheckbox.js";
import "../../../../../assets/plugins/jqwidgets/jqxlistbox.js";
import "../../../../../assets/plugins/jqwidgets/jqxcombobox.js";

declare let $: any;
declare let bootbox: any;
declare let App: any;

@Component({
  selector: "app-admin-form-schema",
  templateUrl: "./admin-form-schema.component.html",
  styleUrls: [
    "./admin-form-schema.component.css",
    "../../../../../assets/common/css/admin.css"
  ],
  providers: [FormService]
})
export class AdminFormSchemaComponent implements OnInit {
  static instance: AdminFormSchemaComponent;
  private forms: Form[];
  private form: Form;
  private template: Template;
  private schema = [];
  public selectedItem;
  private page;
  public cell_classes;
  private copied = false;
  private copiedItems = [];
  private selected_wizard;

  constructor(private _formService: FormService) {
    AdminFormSchemaComponent.instance = this;
  }

  ngOnInit() {
    this.template = new Template();
    this.getForms();
  }

  ngAfterViewInit() {
    $(document).ready(function(this) {
      InitWidgets();
      InitEvents();

      function InitWidgets() {
        // console.log('ok');
        $(".form-container").css("max-height", "6000px");

        $("#formSelector").jqxDropDownList({
          theme: "metro",
          width: "100%",
          height: 35,
          itemHeight: 35,
          autoDropDownHeight: true
        });
        $("#pageSelector").jqxDropDownList({
          theme: "metro",
          width: 50,
          height: 35,
          autoDropDownHeight: true
        });
        $("#schemaTree").jqxTree({
          theme: "metro"
        });
        $("#validationTypeSelector").jqxDropDownList({
          theme: "metro",
          width: "100%",
          autoDropDownHeight: true
        });
        $("#cellTypeSelector").jqxDropDownList({
          theme: "metro",
          width: "100%",
          autoDropDownHeight: true
        });
        $("#classSelector").jqxComboBox({
          theme: "metro",
          width: "100%",
          checkboxes: true
        });
        $("#contentEditor").jqxEditor({
          width: "100%",
          height: 300
        });
        $("#wizardSelector").jqxDropDownList({
          width: "100%",
          theme: "metro",
          height: 35,
          autoDropDownHeight: true,
          displayMember: "name",
          valueMember: "id"
        });
        $("#wizardSectionSelector").jqxDropDownList({
          width: "100%",
          theme: "metro",
          height: 35,
          autoDropDownHeight: true,
          displayMember: "name",
          valueMember: "id"
        });
      }

      function InitEvents() {
        $("#formSelector").on("select", function(event) {
          if (event.args) {
            let id = event.args.item.value;
            let oldForm = localStorage.getItem("form.id");
            if (id != oldForm) {
              localStorage.setItem("form.id", id);
              localStorage.setItem("page.index", "1");
              window.location.reload();
            } else {
              AdminFormSchemaComponent.instance.getForm(id);
            }
          }
        });
        $("#pageSelector").on("select", function(event) {
          if (event.args) {
            let index = event.args.item.value;
            // AdminFormSchemaComponent.instance.selectPage(index);
            let oldPage = localStorage.getItem("page.index");
            if (index != oldPage) {
              localStorage.setItem("page.index", index);
              window.location.reload();
            } else {
              AdminFormSchemaComponent.instance.selectPage(index);
            }
          }
        });
        $("#schemaTree").on("click", function(event) {
          let item = $(this).jqxTree("getSelectedItem");
          AdminFormSchemaComponent.instance.selectedItem = item;
          AdminFormSchemaComponent.instance.selectItemById(item.value);
          AdminFormSchemaComponent.instance.showSelectedArea(item.value);
        });
        $("#classSelector").on("checkChange", function(event) {
          let items = $("#classSelector").jqxComboBox("getCheckedItems");
          let classes = "";
          $.each(items, function(index) {
            classes += this.label;
            if (items.length - 1 != index) {
              classes += " ";
            }
          });
          AdminFormSchemaComponent.instance.cell_classes = classes;
        });
        $("#cellTypeSelector").on("select", function() {
          let type = $(this).val();
          if (FormHelper.isInput(type)) {
            $("#contentContainer").hide();
            $(
              "#keyContainer, #structureContainer, #foreignKeyContainer,#PDFFieldKeyContainer, #wizardButtonContainer, #validationContainer"
            ).show();
          } else {
            $("#contentContainer").show();
            $(
              "#keyContainer, #structureContainer, #foreignKeyContainer,#PDFFieldKeyContainer, #wizardButtonContainer, #wizardToolsContainer, #validationContainer"
            ).hide();
          }
          if (type == "input" || type == "textarea") {
            $("#structureContainer").hide();
          }
        });
        $("#wizardButton").click(function() {
          $(this).toggleClass("green");
          $("#wizardToolsContainer").toggle();
        });
        $("#wizardSelector").on("select", function(event) {
          let id = event.args.item.value;
          AdminFormSchemaComponent.instance.refreshSections(id);
        });

        // $(window).scroll(function() {
        //   let top = $(window).scrollTop() - 180;
        //   if(top > 0 && top < $('.form-container').height()) {
        //     $('#saveButton').css('margin-top', top);
        //   }
        // })
      }
    });
  }

  getForms() {
    Common.showLoading();

    this._formService.getForms().subscribe(
      data => {
        this.forms = data.data;
        let source = {
          datatype: "json",
          datafields: [{ name: "id" }, { name: "type" }],
          localData: this.forms,
          async: true
        };
        let dataAdapter = new $.jqx.dataAdapter(source);

        $("#formSelector").jqxDropDownList({
          source: dataAdapter,
          displayMember: "type",
          valueMember: "id"
        });
        let id = localStorage.getItem("form.id");
        if (isNullOrUndefined(id)) {
          $("#formSelector").jqxDropDownList("selectIndex", 0);
        } else {
          $("#formSelector").val(id);
        }

        Common.hideLoading();
      },
      error => {
        Common.hideLoading();
      }
    );
  }

  getForm(id) {
    this._formService.getForm(id).subscribe(data => {
      this.form = data;
      if (this.form.template != "") {
        this.extractTemplate();
      } else {
        this.template = new Template();
      }
    });
  }

  extractTemplate() {
    try {
      this.template = JSON.parse(this.form.template);
      this.template.pages = this.template.pages || [];

      let source = [];
      for (let i = 0; i < this.template.pages.length; i++) {
        source.push(i + 1);
      }
      $("#pageSelector").jqxDropDownList({ source: source });
      let pageIndex = localStorage.getItem("page.index");
      if (pageIndex == null) pageIndex = "1";
      $("#pageSelector").jqxDropDownList(
        "selectIndex",
        parseInt(pageIndex) - 1
      );

      if (isNullOrUndefined(this.template.wizards)) {
        this.template.wizards = [];
      }
      this.refreshWizards();
    } catch (e) {
      console.log("admin-form-Json Parse failed");
      console.log(this.form.template);
    }
  }

  saveSchema() {
    let id = $("#formSelector").val();
    this.page.body = this.page.body || { schema: [] };
    this.page.body.schema = this.schema;
    this.form.template = JSON.stringify(this.template);
    this._formService.updateForm(this.form).subscribe(data => {
      let message = data.success.message;
      Notification.notifyAny({ message: message });
    });
  }

  refreshTree() {
    var copySchema = [];
    for (var i in this.schema) {
      var row = Common.copyItem(this.schema[i]);
      row["type_key"] = row["type"];
      if (!Common.isNone(row["key"])) {
        row["type_key"] += "(" + row["key"] + ")";
      }
      copySchema.push(row);
    }
    // console.log(this.schema, copySchema);
    let source = {
      datatype: "json",
      datafields: [{ name: "id" }, { name: "parent_id" }, { name: "type_key" }],
      id: "id",
      localdata: copySchema
    };

    let dataAdapter = new $.jqx.dataAdapter(source);
    dataAdapter.dataBind();
    let records = dataAdapter.getRecordsHierarchy("id", "parent_id", "items", [
      { name: "type_key", map: "label" },
      { name: "id", map: "value" }
    ]);
    $("#schemaTree").jqxTree({ source: records });
    $("#schemaTree").jqxTree("collapseAll");
    $("#schemaTree").jqxTree(
      "expandItem",
      $("#schemaTree").find("li:first")[0]
    );
    if (!isNullOrUndefined(this.selectedItem)) {
      let id = this.selectedItem.value;
      var items = $("#schemaTree").jqxTree("getItems");
      for (let i in items) {
        let item = items[i];
        if (item.value == id) {
          $("#schemaTree").jqxTree("expandItem", item);
          $("#schemaTree").jqxTree("selectItem", item);
        }
      }
    }

    FormHelper.buildHtml($("#previewContainer"), this.page, "admin");

    Common.hideLoading();
  }

  addItem(type = "normal") {
    if (this.selectedItem != null) {
      let item = {
        id: FormHelper.getRandomId(),
        parent_id: this.selectedItem.value,
        type: $("#cellTypeSelector").val(),
        validation_type: $("#validationTypeSelector").val(),
        validation_label: $("#validationLabelInput").val(),
        classes: this.cell_classes,
        style: $("#styleInput").val(),
        attributes: $("#attributesInput").val()
      };
      if (FormHelper.isInput(item.type)) {
        item["key"] = $("#keyInput")
          .val()
          .trim();
        item["foreign_key"] = $("#foreignKeyInput")
          .val()
          .trim();
        item["pdf_field_key"] = $("#PDFFieldKeyInput")
          .val()
          .trim();
        item["structure"] = $("#structureInput").val();
        item["wizard_id"] = $("#wizardSelector").val();
        item["section_id"] = $("#wizardSectionSelector").val();
        item["new_row"] = $("#newRowInput")[0].checked;
        item["no_need_validation"] = $("#validationNoNeedInput")[0].checked;
        item["group_label"] = $("#groupLabelInput").val();
        item["label"] = $("#labelInput").val();
        item["response_class"] = $("#responseClassInput").val();
      } else {
        item["content"] = $("#contentEditor").val();
      }
      if (type == "normal") {
        this.schema.push(item);
      } else if (type == "before") {
        item.parent_id = this.selectedItem.parentId;
        let index = this.getIndexById(this.selectedItem.id);
        this.schema.splice(index, 0, item);
      }

      this.onItemChanged();
    }
  }

  removeItem() {
    if (this.selectedItem != null && this.selectedItem.label != "root") {
      let id = this.selectedItem.value;
      let indexes = this.getFamilyIndexesById(id);
      let new_schema = [];
      for (let i = 0; i < this.schema.length; i++) {
        if (indexes.indexOf(i) < 0) {
          new_schema.push(this.schema[i]);
        }
      }
      this.schema = new_schema;
      this.page.body.schema = this.schema;
      // TODO: Test code
      // this.onItemChanged();
      //$("#cellModal").modal("hide");
      this.onItemChanged();
    }
  }

  updateItem() {
    if (this.selectedItem != null && this.selectedItem.label != "root") {
      let item = {
        type: $("#cellTypeSelector").val(),
        validation_type: $("#validationTypeSelector").val(),
        validation_label: $("#validationLabelInput").val(),
        classes: this.cell_classes,
        style: $("#styleInput").val(),
        attributes: $("#attributesInput").val(),
        key: $("#keyInput").val(),
        foreign_key: $("#foreignKeyInput").val(),
        pdf_field_key: $("#PDFFieldKeyInput")
          .val()
          .trim(),
        content: $("#contentEditor").val(),
        structure: $("#structureInput").val(),
        wizard_id: $("#wizardSelector").val(),
        section_id: $("#wizardSectionSelector").val(),
        new_row: $("#newRowInput")[0].checked,
        no_need_validation: $("#validationNoNeedInput")[0].checked,
        group_label: $("#groupLabelInput").val(),
        label: $("#labelInput").val(),
        response_class: $("#responseClassInput").val()
      };
      this.replaceItemById(this.selectedItem.id, item);

      //console.log(item);

      // TODO : Test code here
      this.onItemChanged();
      // $("#cellModal").modal('hide');
    }
  }

  copyItem() {
    if (this.selectedItem != null && this.selectedItem.label != "root") {
      $("#cellModal").modal("hide");

      let selected_id = this.selectedItem.value;
      let selected_item = this.getItemById(selected_id, true);
      selected_item.parent_id = -1;
      let items = this.getItemsById(selected_id, true);
      items.push(selected_item);

      for (let i in items) {
        let item = items[i];
        let random_id = FormHelper.getRandomId();
        for (let j in items) {
          if (items[j].parent_id == item.id) {
            items[j].parent_id = random_id;
          }
        }
        item.id = random_id;
      }
      this.copied = true;
      this.copiedItems = items;
    }
  }

  pasteItem() {
    if (!this.copied) return;
    if (this.selectedItem != null) {
      for (let i in this.copiedItems) {
        let item = this.copiedItems[i];
        if (item.parent_id == -1) {
          item.parent_id = this.selectedItem.value;
        }
        this.schema.push(item);
      }
      this.refreshTree();
      this.copied = false;

      this.onItemChanged();
    }
  }

  getFamilyIndexesById(id) {
    let array = [];
    for (let i = 0; i < this.schema.length; i++) {
      let row = this.schema[i];
      if (row.id == id) {
        array.push(i);
      }
      if (row.parent_id == id) {
        let children = this.getFamilyIndexesById(row.id);
        for (let j in children) {
          array.push(children[j]);
        }
      }
    }
    return array;
  }

  getItemsById(id, copy = false) {
    let item = this.getItemById(id, copy);
    let array = [];
    let children = this.getChildrenById(id, copy);
    for (let i in children) {
      let child = children[i];
      array.push(child);
      let items = this.getItemsById(child.id, copy);
      for (let j in items) {
        array.push(items[j]);
      }
    }

    return array;
  }

  getChildrenById(id, copy = false) {
    let children = [];
    for (let i = 0; i < this.schema.length; i++) {
      let row = this.schema[i];
      if (row.parent_id == id) {
        if (copy) {
          children.push(Common.copyItem(row));
        } else {
          children.push(row);
        }
      }
    }
    return children;
  }

  getIndexById(id) {
    for (let i = 0; i < this.schema.length; i++) {
      let row = this.schema[i];
      if (row.id == id) {
        return i;
      }
    }
    return -1;
  }

  getItemById(id, copy = false) {
    let index = this.getIndexById(id);
    if (index >= 0) {
      if (copy) {
        return Common.copyItem(this.schema[index]);
      } else {
        return this.schema[index];
      }
    }
    return null;
  }

  replaceItemById(id, item) {
    let old_item = this.getItemById(id);
    let index: number;
    for (let j in item) {
      old_item[j] = item[j];
    }
  }

  selectPage(index) {
    Common.showLoading();

    this.page = this.template.pages[index - 1];
    this.page.body = this.page.body || {
      schema: [
        {
          id: 0,
          parent_id: -1,
          type: "root"
        }
      ]
    };
    this.schema = this.page.body.schema;
    this.refreshTree();
  }

  selectItemById(id) {
    $("#cellModal").modal();

    let item = this.getItemById(id);
    $("#cellTypeSelector").jqxDropDownList("val", item.type);
    checkClasses(item.classes || "");
    $("#validationTypeSelector").jqxDropDownList(
      "val",
      item.validation_type || "none"
    );
    $("#validationLabelInput").val(item.validation_label || "");
    $("#styleInput").val(item.style || "");
    $("#attributesInput").val(item.attributes || "");
    $("#contentEditor").val(item.content || "");
    $("#keyInput").val(item.key || "");
    $("#foreignKeyInput").val(item.foreign_key || "");
    $("#PDFFieldKeyInput").val(item.pdf_field_key || "");
    $("#structureInput").val(item.structure || "");
    $("#wizardSelector").val(item.wizard_id || -1);
    $("#wizardSectionSelector").val(item.section_id || -1);
    $("#newRowInput")[0].checked = item.new_row;
    $("#validationNoNeedInput")[0].checked = item.no_need_validation;
    $("#groupLabelInput").val(item.group_label || "");
    $("#labelInput").val(item.label || "");
    $("#responseClassInput").val(item.response_class || "");

    function checkClasses(classes) {
      let array = classes.split(" ");
      let items = $("#classSelector").jqxComboBox("getItems");
      $("#classSelector").jqxComboBox("uncheckAll");

      $.each(items, function(index) {
        for (let i in array) {
          if (array[i] == this.label) {
            $("#classSelector").jqxComboBox("checkIndex", index);
          }
        }
      });
    }
  }

  showSelectedArea(id) {
    $(".selected-cell").removeClass("selected-cell");
    $("#cell_" + id).addClass("selected-cell");
  }

  onItemChanged() {
    $("#cellModal").modal("hide");
    Common.showLoading();
    window.setTimeout(function() {
      AdminFormSchemaComponent.instance.refreshTree();
    }, 500);
  }

  refreshWizards() {
    let source = {
      datatype: "json",
      datafields: [{ name: "name" }, { name: "id" }],
      id: "id",
      localdata: this.template.wizards
    };
    let dataAdapter = new $.jqx.dataAdapter(source);
    $("#wizardSelector").jqxDropDownList({ source: dataAdapter });
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
    $("#wizardSectionSelector").jqxDropDownList({ source: dataAdapter });
  }

  getWizardIndexById(id) {
    for (let i in this.template.wizards) {
      let wizard = this.template.wizards[i];
      if (wizard.id == id) {
        return Number(i);
      }
    }
  }
}
