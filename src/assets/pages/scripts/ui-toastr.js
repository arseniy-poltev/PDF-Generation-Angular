var UIToastr = function () {

    return {
        //main function to initiate the module
        init: function () {

            var i = -1,
                toastCount = 0,
                $toastlast,
                getMessage = function () {
                    var msgs = ['Hello, some notification sample goes here',
                        '<div><input class="form-control input-small" value="textbox"/>&nbsp;<a href="http://themeforest.net/item/metronic-responsive-admin-dashboard-template/4021469?ref=keenthemes" target="_blank">Check this out</a></div><div><button type="button" id="okBtn" class="btn blue">Close me</button><button type="button" id="surpriseBtn" class="btn default" style="margin: 0 8px 0 8px">Surprise me</button></div>',
                        'Did you like this one ? :)',
                        'Totally Awesome!!!',
                        'Yeah, this is the Metronic!',
                        'Explore the power of App. Purchase it now!'
                    ];
                    i++;
                    if (i === msgs.length) {
                        i = 0;
                    }

                    return msgs[i];
                };
			//$('#showtoast').click(function ()
			(window.EmitNotification = function ($, option)
			{
				var shortCutFunction = option.type || 'success'; //$("#toastTypeGroup input:checked");
				var msg = option.message || 'Notification'; //$('#message');
				var title = option.title || 'Toast'; // $('#title').val() || '';
				var $showDuration = option.show_duration || 1000; // $('#showDuration');
				var $hideDuration = option.hide_duration || 1000; // $('#hideDuration');
				var $timeOut = option.timeout || 5000; // $('#timeOut');
				var $extendedTimeOut = option.exteded_timeout || 1000; // $('#extendedTimeOut');
				var $showEasing = option.show_easing || 'swing'; // $('#showEasing');
				var $hideEasing = option.hide_easing || 'linear'; // $('#hideEasing');
				var $showMethod = option.show_method || 'slideDown'; // $('#showMethod');
				var $hideMethod = option.hide_method || 'fadeOut'; // $('#hideMethod');
				var toastIndex = toastCount++;

				toastr.options = {
					//closeButton: option.close_button || false; // $('#closeButton').prop('checked'),
					//debug: $('#debugInfo').prop('checked'),
					positionClass: option.position_class || 'toast-top-right',
					onclick: null
				};

				/*
				if ($('#addBehaviorOnToastClick').prop('checked')) {
					toastr.options.onclick = function () {
						alert('You can perform some custom action after a toast goes away');
					};
				}
				*/

				if ($showDuration) {
					toastr.options.showDuration = $showDuration;
				}

				if ($hideDuration) {
					toastr.options.hideDuration = $hideDuration;
				}

				if ($timeOut) {
					toastr.options.timeOut = $timeOut;
				}

				if ($extendedTimeOut) {
					toastr.options.extendedTimeOut = $extendedTimeOut;
				}

				if ($showEasing) {
					toastr.options.showEasing = $showEasing;
				}

				if ($hideEasing) {
					toastr.options.hideEasing = $hideEasing;
				}

				if ($showMethod) {
					toastr.options.showMethod = $showMethod;
				}

				if ($hideMethod) {
					toastr.options.hideMethod = $hideMethod;
				}

				if (!msg) {
					msg = getMessage();
				}

				//$("#toastrOptions").text("Command: toastr[" + shortCutFunction + "](\"" + msg + (title ? "\", \"" + title : '') + "\")\n\ntoastr.options = " + JSON.stringify(toastr.options, null, 2));

				var $toast = toastr[shortCutFunction](msg, title); // Wire up an event handler to a button in the toast, if it exists
				$toastlast = $toast;
				if ($toast.find('#okBtn').length) {
					$toast.delegate('#okBtn', 'click', function () {
						alert('you clicked me. i was toast #' + toastIndex + '. goodbye!');
						$toast.remove();
					});
				}
				if ($toast.find('#surpriseBtn').length) {
					$toast.delegate('#surpriseBtn', 'click', function () {
						alert('Surprise! you clicked me. i was toast #' + toastIndex + '. You could perform an action here.');
					});
				}

				/*
				$('#clearlasttoast').click(function () {
					toastr.clear($toastlast);
				});
				*/
				//toastr[shortCutFunction]("Gnome & Growl type non-blocking notifications", "Toastr Notifications")
			});
			/*
            $('#cleartoasts').click(function () {
                toastr.clear();
            });
			*/
        }

    };

}();

(window.RunUIToastr = function ($) {
  UIToastr.init(); // init metronic core componets
})(jQuery);

/*
jQuery(document).ready(function() {
   UIToastr.init();
});
*/
