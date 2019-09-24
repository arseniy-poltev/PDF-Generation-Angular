import { isNullOrUndefined } from "util";
import { AdminFormSchemaComponent } from "../admin/admin-form/admin-form-schema/admin-form-schema.component";
import { Common } from "../../common";
import { Notification } from "app/common_modules/notification";

declare let $: any;

export class FormHelper {
  static s_schema: any;
  static s_type: any;

  constructor() {}

  static buildHtml(container, page, type = "normal") {
    FormHelper.s_schema = page.body.schema;
    FormHelper.s_type = type;

    let header =
      isNullOrUndefined(page.header) || page.header == ""
        ? ""
        : page.header + '<div class="page-header-border"></div>';
    let body = FormHelper.getDomById(0, type);
    let footer = isNullOrUndefined(page.footer)
      ? ""
      : '<div class="page-footer-border"></div>' + page.footer;
    footer = '<div class="doc-page-footer">' + footer + "</div>";

    let content = $('<div class="doc-page-content"></div>');
    if (type != "admin") content.append($(header));
    content.append(body);

    container.html("");
    container.append(content);
    if (type != "admin") container.append($(footer));
  }

  static buildFormWizardHtml(container, page, type = "normal") {
    //for client form
    FormHelper.s_schema = page.body.schema;
    FormHelper.s_type = type;
    let body = FormHelper.getDomById(0, type);
    let content = $('<div class="doc-page-content"></div>');
    content.append(body);
    container.html("");
    container.append(content);
  }

  static getDomById(id, type = "normal") {
    let item = FormHelper.getItemById(id);
    let classes = item.classes ? item.classes : "";
    let style = item.style ? ' style="' + item.style + '"' : "";
    let item_attributes = item.attributes ? item.attributes : "";
    let attributes =
      style +
      ' id="' +
      type +
      "cell_" +
      item.id +
      '" class="form-cell" ' +
      item_attributes;
    let dom;
    switch (item.type) {
      case "root":
        dom = $("<div></div>");
        break;
      case "div":
        dom = $("<div" + attributes + "></div>");
        break;
      case "table":
        dom = $("<table" + attributes + "></table>");
        break;
      case "tr":
        dom = $("<tr" + attributes + "></tr>");
        break;
      case "td":
        dom = $("<td" + attributes + "></td>");
        break;
      case "input":
        if (type == "print") {
          dom = $("<div" + attributes + "></div>");
          dom.addClass("print-input");
        } else {
          dom = $("<input" + attributes + ">");
          dom.addClass("cell-input");
          if (
            item.validation_type == "date" ||
            item.validation_type == "date2"
          ) {
            dom.attr("type", "date");
          } else if (item.validation_type == "email") {
            dom.attr("type", "email");
            dom.change(function() {
              console.log("email changed");
              if (!Common.validateEmail($(this).val())) {
                let message = item.validation_label + " is invalid email.";
                console.error(message);
                Notification.notifyError(message);
              }
            });
          } else if (item.validation_type == "phone") {
            dom.change(function() {
              console.log("phone changed");
              if (!Common.validatePhone($(this).val())) {
                let message =
                  item.validation_label +
                  " is invalid phone number.<br/>Please type xxx-xxxxxxxx for phone number.";
                console.error(message);
                Notification.notifyError(message);
              }
            });
          }
        }
        break;
      case "textarea":
        if (type == "print") {
          dom = $("<div" + attributes + "></div>");
          let areaHeight = parseInt(dom.attr("rows"), 10) * 30;
          dom.css("min-height", areaHeight);
        } else {
          dom = $("<textarea" + attributes + "></textarea>");
          dom.addClass("cell-input");
        }
        break;
      case "radio":
        dom = $("<div" + attributes + "></div>");
        if (type == "print") dom.addClass("print-check");
        break;
      case "checkbox":
        dom = $("<div" + attributes + "></div>");
        if (type == "print") dom.addClass("print-check");
        break;
      case "select":
        dom = $("<select" + attributes + "></select>");
        dom.css("width", "100%");
        if (type == "print") {
          dom = $("<div" + attributes + "></div>");
        } else {
          let options = JSON.parse(item.structure);
          for (let i = 0; i < options.length; i++) {
            /*let option = $(
              '<option value="' + options[i] + '">' + options[i] + "</option>"
            );*/
            var option;
            if (typeof options[i] === "string")
              option = $(
                '<option value="' + options[i] + '">' + options[i] + "</option>"
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
        }
        break;
    }
    dom.addClass(classes);
    if (FormHelper.isInput(item.type) && !isNullOrUndefined(item.key)) {
      dom.attr("id", type + "_" + item.key);
      dom.attr("dom-id", id);
    }

    // add children
    let flag = false;
    for (let i in FormHelper.s_schema) {
      let row = FormHelper.s_schema[i];
      if (row.parent_id == id) {
        dom.append(FormHelper.getDomById(row.id, type));
        flag = true;
      }
    }
    if (!flag) {
      let item = FormHelper.getItemById(id);
      if (item.type == "radio") {
        FormHelper.createBoxes(dom, item, "radio", type);
      } else if (item.type == "checkbox") {
        FormHelper.createBoxes(dom, item, "checkbox", type);
      } else {
        dom.append(item.content);
      }

      if (FormHelper.s_type == "admin") {
        // add events
        dom.click(function() {
          let items = $("#schemaTree").jqxTree("getItems");
          for (let i in items) {
            let item = items[i];
            if (item.value == id) {
              $("#schemaTree").jqxTree("expandItem", item);
              $("#schemaTree").jqxTree("selectItem", item);
              AdminFormSchemaComponent.instance.showSelectedArea(item.value);
              AdminFormSchemaComponent.instance.selectedItem = item;
              AdminFormSchemaComponent.instance.selectItemById(id);
            }
          }
        });
      }
    }

    return dom;
  }

  static createBoxes(dom, item, type = "radio", main_type = "normal") {
    let structure = isNullOrUndefined(item.structure) ? "" : item.structure;
    let array = JSON.parse(structure);
    for (let i in array) {
      let row = array[i];
      let class_name = type == "radio" ? "mt-radio" : "mt-checkbox";
      let type_name = type == "radio" ? "radio" : "checkbox";
      let radio = $(
        '<label class="' + class_name + '">' + row.label + "</label>"
      );
      let input = $('<input type="' + type_name + '">');
      input.attr("id", main_type + "_" + item.key + "_" + row.value);
      input.val(row.value);
      input.attr("name", item.key);
      radio.append(input);
      radio.append('<span class="form-print-checkbox"></span>');
      if (!isNullOrUndefined(row.prefix)) {
        dom.append(row.prefix);
      }
      dom.append(radio);
    }
  }

  static getItemById(id, copy = false) {
    let index = FormHelper.getIndexById(id);
    if (index >= 0) {
      if (copy) {
        return Common.copyItem(FormHelper.s_schema[index]);
      } else {
        return FormHelper.s_schema[index];
      }
    }
    return null;
  }

  static getIndexById(id) {
    for (let i = 0; i < FormHelper.s_schema.length; i++) {
      let row = FormHelper.s_schema[i];
      if (row.id == id) {
        return i;
      }
    }
    return -1;
  }

  static isInput(type) {
    switch (type) {
      case "div":
        return false;
      case "table":
        return false;
      case "tr":
        return false;
      case "td":
        return false;
    }
    return true;
  }

  static getRandomId() {
    return Math.ceil(Math.random() * 1000000);
  }

  static extractItem(item, inputs, type = "normal") {
    let key = item.key;
    let id_selector = "#" + type + "_" + key;
    if (!isNullOrUndefined(key) && key != "") {
      switch (item.type) {
        case "input":
          inputs[key] = $(id_selector).val();
          break;
        case "textarea":
          inputs[key] = $(id_selector).val();
          break;
        case "radio":
          let doms = $(id_selector + " input");
          $.each(doms, function(index) {
            let dom = $(doms[index]);
            if (dom[0].checked == true) {
              inputs[key] = dom.val();
            }
          });
          break;
        case "checkbox":
          doms = $(id_selector + " input");
          let checks = [];
          $.each(doms, function(index) {
            let dom = $(doms[index]);
            if (dom[0].checked == true) {
              checks.push(dom.val());
            }
          });
          if (checks.length == 0) checks = [""];
          inputs[key] = checks;
          break;
        case "select":
          inputs[key] = $(id_selector).val();
          break;
      }
    }
    return inputs;
  }

  static getSchema(template, index) {
    let page = template.pages[index];
    let body = page.body || { schema: [] };
    let schema = body.schema;

    return schema;
  }

  static setLocalDoc(client_id, form_id, index, inputs) {
    let key = "doc_" + client_id + "_" + form_id + "_" + index;
    localStorage.setItem(key, JSON.stringify(inputs));
  }

  static getLocalDoc(client_id, form_id, index) {
    let doc_name = "doc_" + client_id + "_" + form_id + "_" + index;
    let inputs = JSON.parse(localStorage.getItem(doc_name)) || [];
    return inputs;
  }

  static buildInputs(schema, data) {
    let inputs = {};
    //console.log("Build Input", data);
    for (let j in schema) {
      let item = schema[j];
      let key = item.key || "";
      let foreign_key = item.foreign_key || "";
      if (item.type == "checkbox") {
        let structure = JSON.parse(item.structure);
        if (!isNullOrUndefined(data[key])) {
          inputs[key] = data[key];
        } else if (!isNullOrUndefined(data[foreign_key])) {
          inputs[key] = [];
          inputs[key].push(data[foreign_key]); // group check box
        } else {
          inputs[key] = [];
          for (let k in structure) {
            let added_key = foreign_key + structure[k].value;
            if (data[added_key]) {
              inputs[key].push(structure[k].value);
            }
          }
        }
      } else {
        if (foreign_key != "") {
          inputs[key] = data[foreign_key];
        } else if (key != "") {
          inputs[key] = data[key];
        }
      }
    }
    console.log(inputs);
    return inputs;
  }

  static buildPDFKeyValue(schema, data) {
    let inputs = {};
    for (let j in schema) {
      let item = schema[j];

      let pdf_key = item.pdf_field_key || "";
      let key = item.key || "";
      let foreign_key = item.foreign_key || "";
      if (pdf_key == "") continue;
      try {
        if (item.type == "checkbox") {
          let structure = JSON.parse(item.structure);
          if (
            !isNullOrUndefined(data[key]) ||
            !isNullOrUndefined(data[foreign_key])
          ) {
            if (isNullOrUndefined(data[key])) {
              key = foreign_key;
            }
            if (
              structure.length >= 1 &&
              !isNullOrUndefined(pdf_key) &&
              pdf_key != ""
            ) {
              let pdfKeyArrays = JSON.parse(pdf_key);
              let index = 0;
              for (let k in structure) {
                if (data[key] == structure[k].value) {
                  inputs[pdfKeyArrays[index].field] = pdfKeyArrays[index].value;
                } else if (
                  data[key].length > 0 &&
                  data[key].indexOf(structure[k].value) != -1
                ) {
                  inputs[pdfKeyArrays[index].field] = pdfKeyArrays[index].value;
                }

                index++;
              }
            } else inputs[pdf_key] = "1"; //data[key];
          } else {
            //maybe several check boxes
            if (
              structure.length > 1 &&
              !isNullOrUndefined(pdf_key) &&
              pdf_key != ""
            ) {
              let pdfKeyArrays = JSON.parse(pdf_key);
              let index = 0;
              for (let k in structure) {
                let added_key = foreign_key + structure[k].value;
                if (data[added_key]) {
                  inputs[pdfKeyArrays[index].field] = pdfKeyArrays[index].value;
                }
                index++;
              }
            }
          }
        } else if (item.type == "radio") {
          if (
            !isNullOrUndefined(data[key]) ||
            !isNullOrUndefined(data[foreign_key])
          ) {
            //inputs[pdf_key] = "1"; //data[key];

            if (!isNullOrUndefined(pdf_key) && pdf_key != "") {
              if (!isNullOrUndefined(data[foreign_key])) {
                key = foreign_key;
              }

              let structure = JSON.parse(item.structure);
              let pdfKeyArrays = JSON.parse(pdf_key);

              let index = 0;
              for (let k in structure) {
                if (structure[k].value == data[key]) {
                  inputs[pdfKeyArrays[index].field] = pdfKeyArrays[index].value;
                  break;
                }
                index++;
              }
            }
          }
        } else {
          if (foreign_key != "") {
            if (!isNullOrUndefined(inputs[pdf_key])) {
              // for first name & last name thing
              inputs[pdf_key] = `${inputs[pdf_key]} ${data[foreign_key]}`;
            } else inputs[pdf_key] = data[foreign_key];
          } else if (key != "") {
            if (!isNullOrUndefined(inputs[pdf_key])) {
              // for first name & last name thing
              inputs[pdf_key] = `${inputs[pdf_key]} ${data[key]}`;
            } else inputs[pdf_key] = data[key];
          }
          switch (item.validation_type) {
            case "date":
            case "date2":
              try {
                var parts = inputs[pdf_key].split("-");
                var year = parseInt(parts[0]),
                  month = parseInt(parts[1]) - 1,
                  day = parseInt(parts[2]);
                if (year == 0 && month == -1 && day == 0) {
                  inputs[pdf_key] = "";
                } else {
                  var mydate = new Date(year, month, day);
                  let dateString;
                  if (item.validation_type == "date2")
                    dateString = Common.date2ToMDY(mydate);
                  else dateString = Common.dateToMDY(mydate);
                  inputs[pdf_key] = dateString;
                }
              } catch (e) {
                console.log("Date Parse Error", inputs[pdf_key]);
              }
              break;
            case "number":
              var _numberValue = parseFloat(inputs[pdf_key]);
              inputs[pdf_key] = _numberValue.toFixed(2);
              break;
          }
        }
      } catch (e) {
        console.log("form-helper: buildPDFKeyValue - Json Parse failed");
        console.log(item);
        console.log(pdf_key);
      }
    }
    console.log(inputs);
    return inputs;
  }

  static seedItem(item, inputs, type = "normal") {
    if (inputs == null) {
      return;
    }
    let key = item.key;
    let id_selector = "#" + type + "_" + key;

    if (!isNullOrUndefined(key) && key != "") {
      switch (item.type) {
        case "input":
          if (type == "print") {
            if (item.validation_type == "date") {
              let dateString = Common.dateToMDY(new Date(inputs[key]));
              $(id_selector).html(dateString);
            } else {
              $(id_selector).html(inputs[key]);
            }
          } else {
            $(id_selector).val(inputs[key]);
          }
          break;
        case "textarea":
          if (type == "print") {
            $(id_selector).html(inputs[key]);
          } else {
            $(id_selector).val(inputs[key]);
          }
          break;
        case "radio":
          let doms = $(id_selector + " input");

          $.each(doms, function(index) {
            let dom = $(doms[index]);
            let span = dom.parent().children("span")[0];
            if (dom.val() == inputs[key] && !isNullOrUndefined(dom[0])) {
              if (type == "print") {
                $(span).append(
                  $(
                    '<img class="print-radio-circle" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAJlQTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIx1qlQAAADN0Uk5TABJEk9v9/+KgUhcBPLX3+sNREYL7G/mmXQLPH/5txtJG+G8ndASJqcErHl6hyczLqmsmpWa/oQAAAJtJREFUeJxt0OkSgjAMBOAFakAQBClCsd54Kx7v/3BaBkZs3Z/fJJnJAiqW7bABud7QD9BlFEbUZBwnLU1STt94WYPptGfE82a3P6dSCFihZlTOYEc6yjkc3YgWYCZySBMJf4zgmibhmbjEam3gBn6sG9siSHSsdp/n9z8H+EGoRrK8j8dT22hRdi+wSnTNi/Pleqvr++P5UvfwBlV9DbwVUYDeAAAAAElFTkSuQmCC" />'
                  )
                );
              } else {
                dom[0].checked = true;
              }
            }
          });
          break;
        case "checkbox":
          let checks = inputs[key];
          for (let j in checks) {
            let dom = $(id_selector + "_" + checks[j]);
            let span = dom.parent().children("span")[0];
            if (!isNullOrUndefined(dom[0])) {
              if (type == "print") {
                $(span).append(
                  $(
                    '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF0AAABdCAYAAADHcWrDAAAEu0lEQVR4Ae3cyUr7QBgA8MlfQSj0Jq2H1gVExGfwoHj2DfTmI3jwDby4b6joxbN48QH0VC9eBQXt4nIQvCuizp+vOJK2k2WSzNovIJNOJjOZX75kpobGo5RSgotSgX9KW8PGmgKIriEQEB3RNQhoaBIjHdE1CGhoEiMd0TUIaGgSIx3RNQhoaBIjHdE1CGhoEiMd0TUIaGgSIx3RNQhoaBIjPQIdnvG8v7+Tn5+fiJLxNyN6gNXr6ytZWloiAwMDJJfLkXw+TxYWFsjd3V3AHgLZ8LgOl1aB+/t7OjQ0BI8xO/7y+Ty9vLxs3UHwExEs73xxAC+VSh3Y/hOQy+VSwSO6L4zigDP8NPCI/osuAp4WHtEppQBeLpdDbykMuj1NEvFdj54GnJ0AUfiuRn94eEgc4QycpSLwXYueJbgfvlKp+IZm/qoH2QLTeieKVqtVMjU1RZ6enjLvT6lUIrVajfT29gbW3XXfSGWCg/Lz8zM5Pz8PBIcNXYUO4NPT01Ii3K9cqVT8HzvWuwadgT8+PnYgZJ3heV5olV2BDvdYiHAV4KA9MzMTiu787KVardLBwcFEX3zYrEQkHR8fp9/f3/xpy2+u0+iqwQuFAr29vQ0Fb84WI0tYWkAH+M3NTSwtJyO9VqsF/j9c5FYRtyxEeFxwOCvBM/jwoaC5FR5hXV1dkZeXF1IsFsnk5CTp6emJsae8IvV6vfnFp9FoyGvEV3OhUCAXFxdkYmLClxuxGut64BQ6Ozujo6OjLQMUPG05OTnhlFaTZXqEM4VEt5ejoyPqeV4LuP9SXFlZYfUrS20BBxBh9MPDw0BsP/zq6iqCBwgIoR8cHMQCZ/hra2sBzWaXbVOEs17HRt/f3xcCVwEP4MPDw4mOix2fSCo6S2HI7Wks9L29vVQdkxHxtoLDCYhE39nZSQXOIml9fb39hCf+bDN4JPr29nYm4Ax+Y2MjMTTbsV6vW3lLYccfig7zbYaVZZoG3gXwQPSPjw/a398vBR1O4Obmpv/Ex1p3BTwQ/fT0VBo4u2q2trZiYUMhl8AD0WG2wXBkpjBmRC0APjIyouR4oK9ZTQvD+sWdvRwfHyvrZBi8i+CBkf729kb7+vqUwcO0tH1pNBrORTjrIzfSYePi4qIydLisd3d32TFRl8Ghk4HoX19fdG5uTjm86+Ch6LBRBzwMZDIHb3/dKgbNv8vXtxIY6ayMDng/jKx1XeDgGokOhVyD1wkeG90leN3gQuguwJsALoxuM7wp4InQbYQ3CTwxuk3wpoGnQrcB3kTw1Ogmw5sKngm6ifAmg2eGbhK86eCZopsAbwN45ug64W0Bl4KuA94mcGnoKuFtA5eKrgLeRnDp6Ax+fn4+8wcTtoIrQWfwWT76sxlcGXqW8LaDK0XPAt4FcOXoaeBdAdeCngTeJXBt6CLwroFrRWfwYdNJF8G1o8MBwBsjlpeXabFY/JvLw29UZ2dnm6/ugzKuLca8w+vz85NcX1833+A8NjZGyuVyxG+97d1sDLq9hOJH3hVvNhJnkbsHosv15daO6FwWuZmILteXWzuic1nkZiK6XF9u7YjOZZGbiehyfbm1IzqXRW4mosv15daO6FwWuZmILteXW/t/y0nFWtzknRoAAAAASUVORK5CYII=" data-filename="image.png" style="width: 12.4px; height: 12.4px; margin: 2px 0 0 3px;">'
                  )
                );
              } else {
                dom[0].checked = true;
              }
            }
          }
          break;
        case "select":
          if (type == "print") {
            $(id_selector).html(inputs[key]);
          } else {
            $(id_selector).val(inputs[key]);
          }
          break;
      }
    }
  }

  static seedPage(page, client_id, form_id, index, type = "normal") {
    let key = "doc_" + client_id + "_" + form_id + "_" + index;
    let inputs = JSON.parse(localStorage.getItem(key));
    for (let j in page.body.schema) {
      let item = page.body.schema[j];
      FormHelper.seedItem(item, inputs, type);
    }
  }
}
