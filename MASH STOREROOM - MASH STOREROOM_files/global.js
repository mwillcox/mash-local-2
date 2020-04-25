$(document).ready(function(){  
  //detect dragging on mobile
  var dragging = false;
  $("a").on("touchmove", function(){
    dragging = true;
  });

  // navbar
  $('.desktop .item, .desktop .subitem').hover(function(){
    $(this).addClass('hover');
    $(this).find('.subnav:first').show();
  }, function(){
    $(this).removeClass('hover');
    $(this).find('.subnav').hide();
  });
  
// gg fix for the safari + chrome + android double tap issues (10/03/17)
var isIphone = /(iPhone)/i.test(navigator.userAgent);
var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
var isChrome = navigator.userAgent.match('CriOS');

if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
  //Chrome iOS fix
      if(isChrome){ 
  $('nav .item.sub').on('click', function(e){
    if ($(window).width() < 767) {
    var element = $(this).find('.itemLink');
    var href = element.attr('href');    
    //element.attr('href', '#');
      $('nav .itemLink').hide();
      element.show();
      $(this).addClass('view-subnav');
      $('nav .glyphicon-remove').show( 'fade', function(){
        element.attr('href', href);
      });
  }
  });
         }
  //Safari fix    

  $('nav .item.sub').on('click touchend', false, function(e){
         if (dragging){
           dragging = false;
           e.preventDefault();
           return false;
          } else {
            
    if ($(window).width() < 767) {
    var element = $(this).find('.itemLink');
      var href = element.attr('href');      
      var subItems = $(this).find('.subitemLink');
      
      //element.attr('href', '#');
      $('nav .itemLink').hide();
      element.show();
      $(this).addClass('view-subnav');
      var mainItems = $(this).find('.active.itemLink');
      
      subItems.on('click touchend', function(e){
         if (dragging){
           dragging = false;
           return false;
          } else {
        window.location.replace($(this).attr("href"));
          }
      });
      
      $('nav .glyphicon-remove').show( 'fade', function(){
        element.attr('href', href);
      });
      e.preventDefault();
  }
          }
  });
// GG fix for sub-category menus 17-07-2017  
  $('nav .item.sub').on('click touchend', false, function(e){
    var mainItems = $(this).find('.itemLink');
      mainItems.on('click touchend', function(e){
         window.location.replace($(this).attr("href"));
      });

  });
            
  
} else {
  $('nav .item.sub').on('click', function(e){
    console.log('isandroid')
  if ($(window).width() < 767) {
    var element = $(this).find('.itemLink');
      var href = element.attr('href');      
      element.attr('href', '#');
      $('nav .itemLink').hide();
      element.show();
      $(this).addClass('view-subnav');
      $('nav .glyphicon-remove').show( 'fade', function(){
        element.attr('href', href);
      });
  }
}); 
}
  
  // responsive navigation
  $('.burger').click(function() {
    if ($(this).hasClass('open')) {
      $(this).add('header').add('.wrapper').removeClass('open').addClass('close');
    } else {
      $(this).add('header').add('.wrapper').removeClass('close').addClass('open');
    }
  });
  $('.wrapper').click(function() {
    if ($('.burger').hasClass('open')) {
      $('.burger').add('header').add('.wrapper').removeClass('open').addClass('close');
    }
  });     
  
  // zoombox
  $('.thumbs a').mousedown(function(){
    $('.images a').hide();
    $('.images a[data-image-id="' + $(this).attr('data-image-id') + '"]').css('display','block');
    $('.thumbs a').removeClass('active');
    $('.thumbs a[data-image-id="' + $(this).attr('data-image-id') + '"]').addClass('active');
  });
  
  // tabs
  $('.tabs a').click(function(){
    var tabs = $(this).closest('.tabs');
    var pages = $('.tabsPages');
    tabs.find('a').closest('li').removeClass('active');
    pages.find('.page').removeClass('active');
    $(this).closest('li').addClass('active');
    pages.find('.page.'+$(this).attr('rel')).addClass('active');
    return false;
  });
  
  // categories 
  $('.categories .category').hover(function(){
    $('.categories .category').addClass('hover');
    $(this).removeClass('hover');
  }, function(){
    $('.categories .category').removeClass('hover');
  });
  
  if(navigator.appVersion.indexOf("MSIE 7.")!=-1) {
    $('body').append('<div class="wsa-demobar">Your browser is out of date. We recommend <a class="link" href="www.google.com/chrome/â€Ž">Google Chrome</a> to download.</div>');
    $('body').css('marginTop', '42px');
  }
});

$(window).load(function(){
  sizing();
  logoSize();
});
$(window).resize(function(){
  sizing();
});

function sizing() {
  if ($(window).width() > 1024) {
    // Description text (product hover)
    $('.product .image-wrap').mouseenter(function() {
      var descriptionHeight = $(this).find('img').outerHeight();
      var starsHeight = $(this).find('.description .stars').outerHeight();
      var cartHeight = $(this).find('.description .cart').outerHeight();
      var textHeight = descriptionHeight - starsHeight - cartHeight;
      $(this).find('.description .text').css('height', textHeight-60 + 'px');  
    });
  }
  if ($(window).width() > 992) {
    // tabs height
    var OptionHeight = $('.product-option').outerHeight();
    var PriceHeight = $('.product-price').outerHeight();
    var tabsTitle = $('.product-tabs .tabs a').outerHeight();
    var imgHeight = $('.product-img').outerHeight();
    
    var tabsHeight =  imgHeight - PriceHeight - OptionHeight - tabsTitle;  
    $('.product-tabs .page').css('maxHeight', tabsHeight + 'px');
  }
  if ($(window).width() < 767) {
    // reponsive 
    $('nav.desktop').removeClass('desktop');
    $('nav').addClass('mobile');

      
    $('nav .glyphicon-remove').click(function() {
      $('nav .item.sub').removeClass('view-subnav');
      $(this).hide();
      $('nav .itemLink').show();
    });
  }
  else {
    $('nav.mobile').removeClass('mobile');
    $('nav').addClass('desktop');
    $('nav.mobile .item.sub').click(function() {
      var element = $(this).find('.itemLink');
      var href = element.attr("href");   
      element.attr("href", href);
    });
  }
}

// logo
function logoSize() {
  if ($(window).width() < 767) {
    var logoWith = $('.logo img').width();
    logoWith = (logoWith * 0.8);
    $('.logo img').width(logoWith);
  }
}