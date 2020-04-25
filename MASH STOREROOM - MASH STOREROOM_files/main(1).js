;(function ($, window, undefined) {
  'use strict';

  var $doc = $(document),
      Modernizr = window.Modernizr;

  $(document).ready(function() {

    $('.search-btn a').addClass( "ss-icon ss-standard ss-search" );

    $("article iframe").wrap("<div class='video-container'></div>");

    //Search Toggle
    $( ".search-btn" ).click(function() {
      $( "#search-cont, #search-cont-mobile" ).slideToggle( "fast" );
      $("input#s").focus();
    });

    $( "article p" )
  .contents()
    .filter(function() {
      return this.nodeType === 3;
    })
      .wrap( "<p></p>" )
      .end()
    .filter( "br" )
    .remove();

    // Countdown clock
    if($('.countdown-clock').length){
      var now = new Date(); 
      
      var UTCoffset = now.getTimezoneOffset() / 60;
      var PSToffset = 8 - UTCoffset +14;
      if(PSToffset < 0)
        PSToffset = 24 + PSToffset +14;
      
      var endDate = new Date('11/30/2015 '+PSToffset+':00:00')
      if (endDate < now) {
        $('p').hide();
        document.location = '/choose-your-download';
      }
      else{
            
        var size = 'lg';
        if($(window).width() < 768)
          size='sm';

        $('.countdown-clock').flipcountdown({
          size: size,
          beforeDateTime:'11/30/2015 '+PSToffset+':00:00',
        }).append('<div class="labels"><div class="days">Days</div><div class="hours">Hours</div><div class="minutes">Minutes</div><div class="seconds">Seconds</div></div>');
      }
    }

  if($('#carousel').lenth > 0){
    $('#carousel').flexslider({
      animation: "slide",
      controlNav: false,
      animationLoop: false,
      slideshow: false,
      itemWidth: 100,
      itemHeight: 100,
      itemMargin: 20,
      asNavFor: '#slider'
    });
  }
 
  if($('#slider').lenth > 0){
    $('#slider').flexslider({
      animation: "slide",
      controlNav: false,
      animationLoop: false,
      slideshow: false,
      sync: "#carousel"
    });
  }
      

     // Twitter Feed
        $.getJSON( 'https://www.mashsf.com/wp-content/themes/mashsf/twitter-proxy.php?user=mashsf&url=https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=mashsf&count=1', function(d){
          $("#twitter").html("<p class='tweet'>" + d[0].text + "</p>");
        });

        // Instagrams
        /*var clientId = '55144aeea9184d0cb5b95ec4e4b6df35';
        var token = '14980168.55144ae.571f850245ad4f0194f4c5d87ab0a4d7';

        $(".instagram").instagram({
         userId: 10328100, show: 6, clientId: clientId , accessToken: token 
        });*/


        //For Mobile Footer
        $('#insta-feed .instagram .instagram-placeholder:last-child').prev('div').andSelf().addClass("special");

        //adding ss-icon class
        $("#social-nav li a").addClass("ss-icon");

        if($('.fancybox').length){
          $(".fancybox").fancybox({
            openEffect  : 'none',
            closeEffect : 'none'
          });
        }

        // New Toggle Menu
        $('.toggle-menu').on("click",function(){
            $("#main-nav").toggleClass("on");
            $("#header-wrap").toggleClass("open");
            $('.toggle-menu').toggleClass("on");
            $('#nav-wrap').toggleClass("show-close");
            $(".sub-menu").removeClass("store-menu-on");
            $(".social-nav-container").toggle();
            $("html,body").toggleClass("no-scroll");
        });

        //Close Menu Button
        $('.close-btn').on("click",function(){
          $("#main-nav").removeClass("on");
          $("#header-wrap").toggleClass("open");
          $('.toggle-menu').removeClass("on");
          $('#nav-wrap').removeClass('show-close');
          $(".sub-menu").removeClass("store-menu-on");
          $(".social-nav-container").toggle();
          $("html,body").toggleClass("no-scroll");
        });

        //Back Button
        $('.back-btn').on("click",function(){
          $('#nav-wrap').toggleClass('show-close show-back');
          $('#menu-item-4 ul.sub-menu').toggleClass("store-menu-on");
        });

        $('#menu-item-4.menu-item-has-children').append( "<i class='ss-icon ss-standard ss-next'>next</i>" );
        $(':not(#menu-item-4).menu-item-has-children').append( "<i class='ss-icon ss-standard ss-navigatedown'>navigatedown</i>" );


        // Get to Shop Menu
        $('#main-nav #menu-item-4 i.ss-next').on("click",function(){
          $('#menu-item-4 > ul.sub-menu').toggleClass("store-menu-on");
          $('#nav-wrap').toggleClass('show-close show-back');
        }); 
      

        $("li.menu-item-has-children ul li.menu-item-has-children").on("click",function(){
          $(this).find('.sub-menu').toggleClass('accordion-on');
        });

  });


          // Scroll Magic
          // init
          if(typeof ScrollMagic != 'undefined'){
            var controller = new ScrollMagic.Controller({
              globalSceneOptions: {
                triggerHook: 'onCenter',
                offset: -250
              }
            });

            new ScrollMagic.Scene({triggerElement: "#section-2"})
              .setClassToggle("#section-2", "in-focus")
              // .addIndicators()
              .addTo(controller);

            new ScrollMagic.Scene({triggerElement: "#section-3"})
              .setClassToggle("#section-3", "in-focus")
              // .addIndicators()
              .addTo(controller);

            new ScrollMagic.Scene({triggerElement: "#section-4"})
              .setClassToggle("#section-4", "in-focus")
              // .addIndicators()
              .addTo(controller);
          }

  // UNCOMMENT THE LINE YOU WANT BELOW IF YOU WANT IE8 SUPPORT AND ARE USING .block-grids
  // $('.block-grid.two-up>li:nth-child(2n+1)').css({clear: 'both'});
  // $('.block-grid.three-up>li:nth-child(3n+1)').css({clear: 'both'});
  // $('.block-grid.four-up>li:nth-child(4n+1)').css({clear: 'both'});
  // $('.block-grid.five-up>li:nth-child(5n+1)').css({clear: 'both'});

  // Hide address bar on mobile devices (except if #hash present, so we don't mess up deep linking).
  if (Modernizr.touch && !window.location.hash) {
    $(window).load(function () {
      setTimeout(function () {
        window.scrollTo(0, 1);
      }, 0);
    });
  }

})(jQuery, this);



