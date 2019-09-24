jQuery.validator.addMethod("noSpace", function(value, element) { 
  return value.trim() != ""; 
}, "No space please and don't leave it empty");

var FormValidation = function () {
  var handleValidation3 = function (form_id, callback) {
    var form3 = $('#' + form_id);
    var error3 = $('.alert-danger', form3);
    var success3 = $('.alert-success', form3);

    form3.validate({
      errorElement: 'span', //default input error message container
      errorClass: 'help-block help-block-error', // default input error message class
      focusInvalid: false, // do not focus the last invalid input
      ignore: "", // validate all fields including form hidden input
      rules: {
        lawfirm_name: {
          minlength: 2,
          required: true,
          noSpace: true
        },
        lawfirm_address: {
          minlength: 2,
          required: true
        },
        lawfirm_city: {
          minlength: 2,
          required: true,
          noSpace: true
        },
        lawfirm_state: {
          minlength: 2,
          required: true
        },
        lawfirm_zip: {
          minlength: 2,
          required: true,
          noSpace: true
        },
        lawfirm_postal: {
          minlength: 2,
          required: false,
          noSpace: false
        },
        lawfirm_phone_number: {
          minlength: 2,
          required: true
        },
        lawfirm_fax_number: {
          minlength: 2,
          required: true
        },
        lawfirm_street: {
          minlength: 2,
          required: true,
          noSpace: true
        },
        email: {
          required: true,
          email: true
        },
        password: {
          minlength: 6,
          required: true,
        },
        options1: {
          required: true
        },
        options2: {
          required: true
        },
        select2tags: {
          required: true
        },
        datepicker: {
          required: true
        },
        occupation: {
          minlength: 5,
        },
        membership: {
          required: true
        },
        service: {
          required: true,
          minlength: 2
        },
        markdown: {
          required: true
        },
        editor1: {
          required: true
        },
        editor2: {
          required: true
        }
      },

      messages: { // custom messages for radio buttons and checkboxes
        membership: {
          required: "Please select a Membership type"
        },
        service: {
          required: "Please select  at least 2 types of Service",
          minlength: jQuery.validator.format("Please select  at least {0} types of Service")
        }
      },

      errorPlacement: function (error, element) { // render error placement for each input type
        if (element.parent(".input-group").size() > 0) {
          error.insertAfter(element.parent(".input-group"));
        } else if (element.attr("data-error-container")) {
          error.appendTo(element.attr("data-error-container"));
        } else if (element.parents('.radio-list').size() > 0) {
          error.appendTo(element.parents('.radio-list').attr("data-error-container"));
        } else if (element.parents('.radio-inline').size() > 0) {
          error.appendTo(element.parents('.radio-inline').attr("data-error-container"));
        } else if (element.parents('.checkbox-list').size() > 0) {
          error.appendTo(element.parents('.checkbox-list').attr("data-error-container"));
        } else if (element.parents('.checkbox-inline').size() > 0) {
          error.appendTo(element.parents('.checkbox-inline').attr("data-error-container"));
        } else {
          error.insertAfter(element); // for other inputs, just perform default behavior
        }
      },

      invalidHandler: function (event, validator) { //display error alert on form submit
        success3.hide();
        error3.show();
        App.scrollTo(error3, -200);
      },

      highlight: function (element) { // hightlight error inputs
        $(element)
          .closest('.form-group').addClass('has-error'); // set error class to the control group
      },

      unhighlight: function (element) { // revert the change done by hightlight
        $(element)
          .closest('.form-group').removeClass('has-error'); // set error class to the control group
      },

      success: function (label) {
        label
          .closest('.form-group').removeClass('has-error'); // set success class to the control group
      },

      submitHandler: function (form) {
        if (callback) {
          callback();
        }
        //success3.show();
        //error3.hide();
        //form[0].submit(); // submit the form
      }

    });

    //apply validation on select2 dropdown value change, this only needed for chosen dropdown integration.
    $('.select2me', form3).change(function () {
      form3.validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
    });

    //initialize datepicker
    // $('.date-picker').datepicker({
    //   rtl: App.isRTL(),
    //   autoclose: true
    // });
    // $('.date-picker .form-control').change(function () {
    //   form3.validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
    // })
  }

  var handleWysihtml5 = function () {
    if (!jQuery().wysihtml5) {

      return;
    }

    if ($('.wysihtml5').size() > 0) {
      $('.wysihtml5').wysihtml5({
        "stylesheets": ["../assets/global/plugins/bootstrap-wysihtml5/wysiwyg-color.css"]
      });
    }
  }


  return {
    //main function to initiate the module
    init: function (form_id, callback) {
      //handleValidation(form_id);
      //handleWysihtml5();
      //handleValidation1(form_id);
      //handleValidation2(form_id);
      handleValidation3(form_id, callback);
    }
  };
}();

(window.RunFormValidation = function ($, form_id, callback) {
  FormValidation.init(form_id, callback); // init metronic core componets
})(jQuery);

/*
jQuery(document).ready(function() {
    FormValidation.init();
});
*/
