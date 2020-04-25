$(document).ready(function(){
  $.get( "https://www.mashsf.com/global-navigation", function( data ) {
    $('#wp-nav').html(data);
  }); 
  mash_addVariants();
  mash_variantClick();
  var jcarousel = $('.jcarousel');
  jcarousel
    .on('jcarousel:reload jcarousel:create', function () {
        var carousel = $(this),
            width = $('.jcarousel-wrapper').width();
    		$('.jcarousel-wrapper').css('width', width);
        $('.jcarousel ul').css('width', '100000px');

        if (width >= 351) {
            width = width / 3;
        } 

    		carousel.jcarousel('items').attr('style', 'width: '+ Math.ceil(width) +  'px !important');
    })
    .jcarousel({
        wrap: 'circular'
    });

  $('.jcarousel-control-prev')
    .jcarouselControl({
        target: '-=1'
    });

  $('.jcarousel-control-next')
    .jcarouselControl({
        target: '+=1'
    });
	
  //infinite scrolling
  var infScroll = $('.products.row').infiniteScroll({
    // options
    path: '.pager .number.active + .number a',
    append: '.product-tile',
    history: false,
    hideNav: '.pager',
    status: '.page-load-status',
    debug: true
  });
	$('.products.row').on( 'load.infiniteScroll', function( event, response, path ) {    
    mash_addVariants();
  });
  
  if($(".fancybox-effects-d").length){
    $(".fancybox-effects-d").fancybox({
      padding: 0,
      openEffect : 'elastic',
      openSpeed  : 150,
      closeEffect : 'elastic',
      closeSpeed  : 150,
              nextEffect: 'none',
              prevEffect: 'none',
      closeClick : false,
      helpers : {
        overlay : null
      }
    });
	}
  
  //Hide no shipping to this country message
  if( $('#gui-form-shipping .gui-form .gui-radio').length <= 0 ){
    $('#gui-form-shipping .gui-form').hide();
	}
  
  //Search Toggle
  $( "#search-btn" ).click(function() {
    $( "#search-cont" ).slideToggle( "fast" );
  });  

});

function mash_addVariants(){
  $('.variant-selector').each(function(){
    if($(this).html().length > 5)
      $(this).addClass('out-of-stock-wide');
  });
  $('.product-tile.check-variants').each(function(){
    var product_tile = $(this);
    var product_url = $(this).find('> a').attr('href').replace('http:', '');

     $.ajax({ 
        url: product_url, 
        dataType: 'html', 
        success: function(response) { 
          var variant_html = $(response).find('.variants').html();
          if(variant_html != undefined){
            product_tile.find('.variants').html(variant_html); 
            product_tile.find('.variants select').attr('onchange', '');
            //product_tile.find('#product_configure_form').attr('action', '//mash-transit.shoplightspeed.com/cart/add/18726632/');
            product_tile.find('.variant-selector').each(function(){
              if($(this).html().length > 5)
                $(this).addClass('out-of-stock-wide');
            });
          }                    
        }
      });    

    $(this).removeClass('check-variants');    
  })
}
function mash_variantClick(){
  $('body').on("click", '.variant-selector', function(evt) {
      var variant_id = $(this).attr('variant-id');
      var product_form = $(this).parents().find('#product_configure_form');
      $(this).parent().find('.variant-selector').removeClass('active');
      $(this).addClass('active');
      product_form.attr('action',  '//mash-transit.shoplightspeed.com/cart/add/' + variant_id);
      return false;
  });
}