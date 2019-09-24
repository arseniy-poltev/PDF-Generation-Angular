jQuery(function ($) {
  "use strict";
  $(function () {
    $('.form-submit input#submit, a.more-link').addClass('readmore readmore-1 readmore-1a');
    $(".aq-block-aq_content_block:eq(0)").css("background-color", "#fb4400").addClass('contentblock0');
    $(".aq-block-aq_content_block:eq(1)").css("background-color", "#212121").addClass('contentblock1');
    $(".aq-block-aq_content_block:eq(2)").css("background-color", "#212121").addClass('contentblock2');
    $(".aq-block-aq_content_block:eq(3)").css("background", "#fb4400").addClass('contentblock3');
    $(".aq-template-wrapper .aq-block-aq_content_block").removeClass('aq_span12');
//$(".wrappingDiv div:nth-child(3n+3)").css("background", "#333");
    $(".aq-block-aq_iconbox_block:eq(2)").css("border-right", "1px solid rgba(255,255,255,.3)");
    $(".aq-block-aq_iconbox_block:eq(0)").css("border-right", "1px solid rgba(255,255,255,.3)");
    $('footer .widget_container ul li:first').css({"border-top": "0", "padding-top": "0"});
    $('#mid_container, #slider_wrapper, #homeslider, .blog_single_img  ul.isotope_gallery').animate({opacity: 1}, 1200);
    //$("#content_section").preloader(); //Preloader
// Responsive Menu Nav
    $(document).ready(function () {
      $("<select />").appendTo(".menu");
      // Create default option "Go to..."
      $("<option />", {
        "selected": "selected",
        "value": "",
        "text": "Go to..."
      }).appendTo(".menu select");

      // Populate dropdowns with the first menu items
      $(".menu ul li a").each(function () {
        var el = $(this);
        if ($(this).parents("ul.sub-menu").length > 0) {
          $("<option />", {
            "value": el.attr("href"),
            //"text"    : '\xa0'+ '\xa0'+ '\xa0'+ el.text()
            "text": " -- " + el.text()
          }).appendTo(".menu select");
        } else {
          $("<option />", {
            "value": el.attr("href"),
            "text": el.text()
          }).appendTo(".menu select");
        }
      });
      //make responsive dropdown menu actually work
      $(".menu select").change(function () {
        window.location = $(this).find("option:selected").val();
      });
    });
// Top Section
    $(".btn-slide").click(function () {
      $("#panel").slideToggle("slow");
      $(this).toggleClass("active");
    });

    // Tabs
    function shortcode_tabs() {
      $(".tabContents").hide(); // Hide all tab conten divs by default
      $(".tabContents:first").show(); // Show the first div of tab content by default

      $("#tabContaier ul li:first a").addClass("active");

      $("#tabContaier ul li a").click(function () { //Fire the click event

        var activeTab = $(this).attr("tabid"); // Catch the click link
        $("#tabContaier ul li a").removeClass("active"); // Remove pre-highlighted link
        $(this).addClass("active"); // set clicked link to highlight state
        $(".tabContents").hide(); // hide currently visible tab content div
        $(activeTab).fadeIn(); // show the target tab content div by matching clicked link.
      });
      $(".vtabContents").hide(); // Hide all tab conten divs by default
      $(".vtabContents:first").show(); // Show the first div of tab content by default
      $("#vtabContaier ul li:first a").addClass("active");

      $("#vtabContaier ul li a").click(function () { //Fire the click event

        var activeTab = $(this).attr("tabid"); // Catch the click link
        $("#vtabContaier ul li a").removeClass("active"); // Remove pre-highlighted link
        $(this).addClass("active"); // set clicked link to highlight state
        $(".vtabContents").hide(); // hide currently visible tab content div
        $(activeTab).fadeIn(); // show the target tab content div by matching clicked link.
      });
    }

    // portfolio Hover Image
    function portfoliohover() {
      $('.roll').css({opacity: 0});
      $(' .porfolio_items li, .client_items li').hover(
        function () {
          $(this).find('.linkto.image, .linkto.video').css({
            "left": "-50px",
            "display": "block"
          }).stop().animate({"left": "35%", opacity: 1}, 600);
          $(this).find('.linkto.post_link, .link_post').css({
            "right": "-50px",
            "display": "block"
          }).stop().animate({"right": "35%", opacity: 1}, 600);
          $(this).find('.linkto.link_image, .linkto.link_video').css({
            "left": "-50px",
            "display": "block"
          }).stop().animate({"left": "50%", opacity: 1}, 600);
          $(this).find('.roll').stop().animate({opacity: 0.8}, 1200);
        }, function () {
          $(this).find('.linkto,.roll').stop().animate({opacity: 0}, 600);
        });
    }

    //toggle();
    portfoliohover();
    shortcode_tabs();
//     $('.item_thumb_gallery, .meta_info, .gallery-item, .isotope_gallery li').hover(
//       //Gallery
//       function () {
//         $(this).find('img').stop().animate({opacity: 0.7}, 1200);
//         $(this).find('.image, .meta_info .post_link').css({"left": "0px"}).stop().animate({
//           "left": "50%",
//           opacity: 1
//         }, 600);
//
//       }, function () {
//         $(this).find('.image, .post_link').stop().animate({opacity: 0}, 400);
//         $(this).find('img').stop().animate({opacity: 1}, 1200);
//       });
//     // $ slide menu
//     $('.menu ul:first > li').addClass("main-links");
//     $(".menu ul li.main-links:last-child").css("border-right", "none");
//
//     // shortcode toggle
//     $(".toggle_content").hide();
//     $("div.trigger").click(function () {
//       $(this).toggleClass("active").next().slideToggle("slow");
//
//     });
//     var $j = jQuery.noConflict();
//     $j("#mini_submit").click(function () {
//       $j(".error").hide();
//       var hasError = false;
//       var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
//       var mini_emailToVal = $j("#mini_emailTo").val();
//       if (mini_emailToVal === '') {
//         $j("#mini_emailTo").after('<span class="error">You forgot to enter the email address In  Widget Field.</span>');
//         hasError = true;
//       } else if (!emailReg.test(mini_emailToVal)) {
//         $j("#mini_emailTo").after('<span class="error">Enter a valid email address In widget field.</span>');
//         hasError = true;
//       }
//       var mini_emailFromVal = $j("#mini_emailFrom").val();
//       if (mini_emailFromVal === '') {
//         $j("#mini_emailFrom").after('<span class="error">You forgot to enter the email address .</span>');
//         hasError = true;
//       } else if (!emailReg.test(mini_emailFromVal)) {
//         $j("#mini_emailFrom").after('<span class="error">Enter a valid email address.</span>');
//         hasError = true;
//       }
//       var mini_messageVal = $j("#mini_message").val();
//       if (mini_messageVal === '') {
//         $j("#mini_message").after('<span class="error">You forgot to enter the message.</span>');
//         hasError = true;
//       }
//       var mini_nameVal = $j("#mini_name").val();
//       if (mini_nameVal === '') {
//         $j("#mini_name").after('<span class="error">Plese Enter Your Name.</span>');
//         hasError = true;
//       }
//       if (hasError === false) {
//         $j(this).hide();
//         $j("#sendEmail .submit").append('<img src=jquerymcolor.template_path + "images/mid-icons-1.png" alt="Loading" id="loading" />');
//         //var wppath;
//         $j.post(wppath.template_path + "/lib/functions/widgets/mini_contact_sent.php",
//           {
//             mini_emailTo: mini_emailToVal,
//             mini_emailFrom: mini_emailFromVal,
//             mini_message: mini_messageVal,
//             mini_name: mini_nameVal
//           },
//           function (data) {
//             $j("#mini_sendEmail").slideUp("normal", function () {
//               $j("#mini_sendEmail").after('<h1>Success</h1><p>Your email was sent.</p>');
//             });
//           }
//         );
//       }
//       return false;
//     });
    // Skill Set
    $(".meter > span").each(function () {
      $(this).data("origWidth", $(this).width()).width(0).animate({
        width: $(this).data("origWidth")
      }, 1200);
    });

    $('#searchbutton').click(function (e) {
      e.preventDefault();
      $("#top_sec .container").fadeOut(300, function () {
        $("#top_sec #sform").fadeIn(600);
      });
    });

    $('#closeSearch').click(function (e) {
      e.preventDefault();
      $("#top_sec #sform").fadeOut(300, function () {
        $("#top_sec .container").fadeIn(600);
      });
    });
  });
  /****************** masonry code **************/
  jQuery(document).ready(function () {
    if (jQuery().isotope) {
      jQuery(window).load(function () {
        jQuery(function () {
          var isotopeContainer = jQuery('.isotope-container');
          isotopeContainer.isotope({
            masonry: {
              columnWidth: 1,
              isAnimated: true,
              isFitWidth: true
            }
          });
        });
      });
    }
  });

// Scroll Top

  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.scroll_top').fadeIn();
    } else {
      $('.scroll_top').fadeOut();
    }
  });

  $('.scroll_top').click(function () {
    $("html, body").animate({scrollTop: 0}, 600);
    return false;
  });

// Slider Arrows Hide / Show
  $('span#controls').hide();
  $('#sudo_slider_wrapper').hover(function () {
    $('span#controls', this).fadeIn();
  }, function () {
    $('span#controls', this).fadeOut();
  });

  /****************** Portfolio Isotope code **************/
  jQuery(document).ready(function () {
    if (jQuery().isotope) {
      var tempvar = "all";
      jQuery(window).load(function () {
        jQuery(function () {
          var isotopeContainer = jQuery('.isotope-container'),
            isotopeFilter = jQuery('#filter'),
            isotopeLink = isotopeFilter.find('a');
          isotopeContainer.isotope({
            itemSelector: '.isotope-item',
            //layoutMode : 'fitRows',
            filter: '.' + tempvar,
            masonry: {
              columnWidth: 1,
              isAnimated: true,
              isFitWidth: true
            }
          });
          isotopeLink.click(function () {
            var selector = jQuery(this).attr('data-category');
            isotopeContainer.isotope({
              filter: '.' + selector,
              itemSelector: '.isotope-item',
              //layoutMode : 'fitRows',
              animationEngine: 'best-available'
            });
            isotopeLink.removeClass('active');
            jQuery(this).addClass('active');
            return false;
          });
        });
        jQuery("#filter ul li a").removeClass('active');
        jQuery("#filter ul li." + tempvar + " a").addClass('active');
      });
    }
  });

}(jQuery));
