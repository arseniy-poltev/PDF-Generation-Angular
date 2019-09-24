import {Component, OnInit} from '@angular/core';
import "../../../assets/plugins/jqwidgets/jqxscrollview.js"
import "../../../assets/plugins/jqwidgets/jqxbuttons.js"
import "../../../assets/plugins/ELDATA/js/custom.js"

declare let $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [
    '../../../assets/plugins/www.mycase.com/static/vendor/foundation/foundation.min.css',
    '../../../assets/plugins/www.mycase.com/static/style/main.min.css',
    '../../../assets/plugins/www.mycase.com/static/style/app.min.css',
    '../../../assets/plugins/ELDATA/css/aqpb-view.css',
    '../../../assets/plugins/ELDATA/css/shortcodes-buttons.css',
    '../../../assets/plugins/ELDATA/style.css',
    '../../../assets/plugins/ELDATA/css/kaya_pagebuilder.css',
    '../../../assets/plugins/ELDATA/css/custom-skin.css',
    './dashboard.component.css'
  ]
})
export class DashboardComponent implements OnInit {

  static sliderRunning = false;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $('#photoGallery').jqxScrollView({
        height: 400,
        buttonsOffset: [0, 0],
        theme: 'metro',
        width: '100%',
        slideShow: false
      });

      if (!DashboardComponent.sliderRunning) {
        window.setInterval(function () {
          if ($('#photoGallery')[0] != undefined) {
            $('#photoGallery').jqxScrollView('forward');
          }
        }, 3000);
        DashboardComponent.sliderRunning = true;
      }
    });
  }
}
