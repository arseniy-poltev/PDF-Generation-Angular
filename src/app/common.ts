import { Router } from "@angular/router";
import { isArray, isNullOrUndefined } from "util";
import { ConfirmWindowComponent } from "./pages/layout/footer/confirm-window/confirm-window.component";
import { Domain } from "./domain";

declare let $;
declare let jqxWindow;

export class Common {
  static IS_STATIC_PAGE = false; // Is static pages or backend combined pages
  static BASE_URL = "http://localhost:8000"; //"http://www.ezdocpro.com:5002"; //
  static FRONT_URL = Domain.FRONTEND;
  static DEFAULT_AVATAR = "../../../../assets/common/img/avatar.png";

  static login() {
    localStorage.setItem("logged_in", "yes");
  }

  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.setItem("logged_in", "no");
  }

  static pages = [
    {
      path: "/pages/dashboard",
      title: "Home",
      description: "",
      align: "left",
      active: false,
      show: "logged_out",
      children: null
    },
    {
      path: "#2",
      title: "Client",
      description: "",
      align: "left",
      active: false,
      show: "logged_in",
      children: [
        {
          path: "/pages/client/create",
          title: "New Client",
          description: "",
          align: "left",
          active: false
        },
        {
          path: "/pages/client/list",
          title: "Client List",
          description: "",
          align: "left",
          active: false
        },
        {
          path: "/pages/client/reactivation",
          title: "Client Reactivation",
          description: "",
          align: "left",
          active: false
        }
      ]
    },
    {
      path: "#1",
      title: "Law Firm",
      description: "",
      align: "left",
      active: false,
      show: "logged_in",
      children: [
        {
          path: "/pages/lawfirm/license",
          title: "Law Firm Create",
          description: "",
          align: "left",
          active: false
        },
        {
          path: "/pages/lawfirm/profile",
          title: "Law Firm Profile",
          description: "",
          align: "left",
          active: false
        },
        {
          path: "/pages/lawfirm/user_assignment",
          title: "User Assignment",
          description: "",
          align: "left",
          active: false
        }
      ]
    },
    {
      path: "/pages/about",
      title: "About",
      description: "",
      align: "left",
      active: false,
      children: null
    },
    {
      path: "/pages/contact_us",
      title: "Contact",
      description: "",
      align: "left",
      active: false,
      children: null
    },
    {
      path: "/account/login",
      title: "Log In",
      description: "",
      align: "right",
      active: false,
      show: "logged_out",
      children: null
    },
    {
      path: "/account/type",
      title: "Sign Up",
      description: "",
      align: "right",
      active: false,
      show: "logged_out",
      children: null
    }
  ];

  static getPage(url) {
    for (let i in this.pages) {
      let page = this.pages[i];
      if (url.search(page.path) >= 0) {
        return page;
      }
      let children = page.children;
      for (let j in children) {
        let child = children[j];
        if (url.search(child.path) >= 0) {
          return child;
        }
      }
    }

    return this.pages[0];
  }

  static getParentPage(page) {
    for (let i in this.pages) {
      let parent = this.pages[i];
      let children = parent.children;
      for (let j in children) {
        let child = children[j];
        if (child.path == page.path) {
          return parent;
        }
      }
    }

    return this.pages[0];
  }

  static getUser() {
    return {
      username: "Tony",
      token: localStorage.getItem("token"),
      role: localStorage.getItem("role"),
      user_id: localStorage.getItem("user_id"),
      logged_in:
        localStorage.getItem("logged_in") == null
          ? "no"
          : localStorage.getItem("logged_in"),
      is_logged: function() {
        return this.logged_in == "yes";
      }
    };
  }

  static SetUser(response: any) {
    localStorage.setItem("role", response.role);
    localStorage.setItem("token", response.token);
    localStorage.setItem("user_id", response.user_id);
  }

  static ProceedError(response) {
    let error = response.json();
    console.log(error);
    let message = "[" + response.status + " error]\n";
    let messages = error.error.message;
    if (isArray(messages)) {
      for (let i in messages) {
        message += messages[i] + "\n";
      }
    } else {
      message += error.error.message;
    }

    alert(message);
  }

  static copyItem(item) {
    let copy_item = {};
    for (let i in item) {
      copy_item[i] = item[i];
    }
    return copy_item;
  }

  static getPhpDate(date) {
    if (date == null || date == undefined) {
      return "";
    }
    let month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;
    let day = date.getDate();
    if (day < 10) day = "0" + day;

    return date.getFullYear() + "-" + month + "-" + day;
  }

  static confirm(message, callback) {
    $("#confirmMessage").html(message);
    ConfirmWindowComponent.instance.callback_func = callback;
    $("#confirmWindow").jqxWindow("open");
    $("#confirmOK").focus();
  }

  static validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  static validatePhone(phone) {
    if (phone.indexOf("-") < 0) {
      return false;
    }
    let numbers = phone.split("-");
    if (numbers[0].length == 3 && numbers[1].length == 8) {
      return true;
    }

    return false;
  }

  static validateNumber(phone) {
    if (isNaN(phone)) return false;
    return true;
  }

  static isNone(value) {
    return (
      value === "" ||
      value === undefined ||
      value === "undefined" ||
      value === null ||
      value === "null"
    );
  }

  static getToken() {
    let token = localStorage.getItem("token");

    return token;
  }

  static loggedIn() {
    return !Common.isNone(Common.getToken());
  }

  static stringToHslColor(str, s = 30, l = 50) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return "hsl(" + h + ", " + s + "%, " + l + "%)";
  }

  static americanDate(phpDate, seprator = "/") {
    let dateArray = phpDate.split("-");
    if (
      Common.isNone(phpDate) ||
      phpDate == "0000-00-00" ||
      dateArray.length != 3
    ) {
      return "";
    }

    return dateArray[2] + seprator + dateArray[1] + seprator + dateArray[0];
  }

  static showLoading() {
    $(".loader").addClass("active");
  }

  static hideLoading() {
    setTimeout(function() {
      $(".loader").removeClass("active");
    }, 150);
  }

  static dateToMDY(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    if (isNaN(y) || isNaN(m) || isNaN(d)) {
      return "";
    }
    return "" + (m <= 9 ? "0" + m : m) + "/" + (d <= 9 ? "0" + d : d) + "/" + y;
  }
  static date2ToMDY(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    if (isNaN(y) || isNaN(m) || isNaN(d)) {
      return "";
    }
    return "" + (m <= 9 ? "0" + m : m) + "/" + y;
  }
}
