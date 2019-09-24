import {Component, OnInit} from '@angular/core';

import "../../../../../assets/plugins/jqwidgets/jqxbuttons.js"
import "../../../../../assets/plugins/jqwidgets/jqxwindow.js"
import "../../../../../assets/plugins/jqwidgets/jqxscrollbar.js"
import "../../../../../assets/plugins/jqwidgets/jqxpanel.js"

declare let $;

@Component({
  selector: 'app-confirm-window',
  templateUrl: './confirm-window.component.html',
  styleUrls: ['./confirm-window.component.css']
})
export class ConfirmWindowComponent implements OnInit {
  static instance: ConfirmWindowComponent;
  public callback_func = new function () {
  };

  constructor() {
    ConfirmWindowComponent.instance = this;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $('#confirmWindow').jqxWindow({
        theme: 'bootstrap',
        width: 350,
        height: 120,
        resizable: false,
        isModal: true,
        modalOpacity: 0.6,
        okButton: $('#confirmOK'), cancelButton: $('#confirmCancel'),
        autoOpen: false,
        draggable: false,
        animationType: 'none',
        initContent: function () {
          $('#confirmOK').click(function () {
            ConfirmWindowComponent.instance.callback_func();
          });
        }
      });

      $(window).on('scroll', function () {
        resetPosition();
      });

      $(window).on('resize', function () {
        resetPosition();
      });

      function resetPosition() {
        let posx = (window.innerWidth - 350) / 2;
        let posy = 200 + window.scrollY;
        $('#confirmWindow').jqxWindow({
          position: [posx, posy]
        });
      }
    });
  }
}
