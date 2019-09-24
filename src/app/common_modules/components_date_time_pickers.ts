import 'assets/pages/scripts/components-date-time-pickers.js';

declare var RunComponentsDateTimePickers;
declare var jQuery;

export class ComponentsDateTimePickers {
  constructor() {
  }

  static init() {
    RunComponentsDateTimePickers(jQuery);
  }
}
