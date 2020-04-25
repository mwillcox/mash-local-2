var gui_translations = {};
var gui_countries = {};
var gui_last_submit = 0;

function gui_validator(form) {
	$(form).submit(function () {
        return gui_validate(this, true);
	});
}

function gui_validate_section(section, visible)
{
    return gui_validate('.gui-section[data-name="'+section+'"]', visible);
}

function gui_validate(selector, visible)
{
    var element = $(selector);

    if (element)
    {
        var errors = 0;
        $(element).find('input.gui-validate, textarea.gui-validate, select.gui-validate, .gui-section.gui-validate').each(function () {
            if (!$(this).closest('.gui-validate-disabled').length) {
                if ($(this).hasClass('gui-section'))
                {
                    if ($(this).find('.gui-field input:checked').length == 0)
                    {
                        if (visible) $(this).addClass('gui-validate-error');
                        errors++;
                    }
                    else
                    {
                        $(this).removeClass('gui-validate-error');
                    }
                }
                else if (($(this).is(':checkbox') && $(this).is(':not(:checked)')) || (!$(this).val() || $(this).val().length == 0)) {
                    if (visible) $(this).addClass('gui-validate-error');
                    errors++;
                } else {
                    if (visible) $(this).removeClass('gui-validate-error');
                }
            } else {
                if (visible) $(this).removeClass('gui-validate-error');
            }
        });

        gui_validator_clear(element);

        $(element).find('.gui-validate.gui-validate-error').each(function () {
            if ($(this).hasClass('gui-section'))
            {
                $(this).addClass('gui-section-error').prepend($('<div/>').addClass('gui-message').text($(this).data('error')));
            }
            else
            {
                if (visible)
                {
                    if (!$(this).parents('.gui-field').hasClass('gui-error')) {
                        $(this).parents('.gui-field').append($('<div/>').addClass('gui-message').text(gui_translate('This is a required field')));
                    }
                    $(this).parents('.gui-field').addClass('gui-error');
                }
            }
            errors++;
        });

        if (errors == 0)
        {
            current_time = new Date().getTime();

            if (gui_last_submit > (current_time - 10000))
            {
                return false;
            }

            gui_last_submit = current_time;

            return true;
        }

        return false;
    }
}

function gui_validator_clear(form) {
    $(form).find('.gui-error').removeClass('gui-error');
	$(form).find('.gui-message').remove();
}

function gui_address(form, autocompleteUrl, regionUrl) {
	$(form).find('.gui-form-country').change(function () {
		var prevCountryType = $(form).find('.gui-address-format').val();
		var countryId = $(this).val();

		if (gui_countries[countryId]) {
			var country = gui_countries[countryId];
			var countryType = country['type'];
			var regionPicker = $(form).find('.gui-form-region');
			var regionSelect = regionPicker.find('.gui-select');
			var regionInput  = regionPicker.find('.gui-input');

			$(form).removeClass('gui-format-default');
			$(form).removeClass('gui-format-autocomplete');
			$(form).removeClass('gui-format-international');

			$(form).addClass('gui-format-' + countryType);
			$(form).find('.gui-address-format').val(countryType);

			if (prevCountryType == 'autocomplete' || countryType == 'autocomplete') {
				gui_address_zipcode_flip(form);
			}

			if (country['zipcode']) {
				$(form).find('.gui-form-zipcode').addClass('gui-validate');
				$(form).find('.gui-form-zipcode').closest('.gui-field').removeClass('gui-no-validate');
			} else {
				$(form).find('.gui-form-zipcode').removeClass('gui-validate');
				$(form).find('.gui-form-zipcode').closest('.gui-field').addClass('gui-no-validate');
			}
			if (countryType != 'international') {
				$(form).find('.gui-form-number').addClass('gui-validate');
			} else {
				$(form).find('.gui-form-number').removeClass('gui-validate');
			}

			/**
			 * check for belgium to change ext translation
			 */
			if (countryId == 21) {
				$(form).find('.gui-address-number-ext-label').html(gui_translate('Extension / bus'));
				$(form).find('.gui-form-number-ext').attr('placeholder', gui_translate('Extension / bus'));
			}

			if (countryType == 'international') {
				$(form).find('.gui-address-streetname-label').html(gui_translate('Address'));
				$(form).find('.gui-form-streetname').attr('placeholder', gui_translate('Address'));
			} else if (prevCountryType == 'international') {
				$(form).find('.gui-address-streetname-label').html(gui_translate('Street name'));
				$(form).find('.gui-form-streetname').attr('placeholder', gui_translate('Street name'));
			}

			var prevCountry = regionPicker.data('selected-country');

			if (country.has_regions) {
				regionSelect.show().find('.gui-no-validate').toggleClass('gui-no-validate gui-validate');
				regionInput.hide().find('.gui-validate').toggleClass('gui-validate gui-no-validate');

				if (country.id != prevCountry) {
					var requestUrl    = regionUrl.replace('_country_', country.code);
					var selectElement = regionPicker.find('select');

					$.getJSON(requestUrl, function (response) {
						selectElement.find('option').remove();

						if (response.regions) {
						for (var id in response.regions) {
							var region = response.regions[id];
							selectElement.append("<option value='" + region.id + "'>" + region.name + "</option>");
						}
						}
					});
				}
			}
			else
			{
				regionSelect.hide().find('option').remove();
				regionSelect.find('.gui-validate').toggleClass('gui-validate gui-no-validate');
				regionInput.show().find('.gui-no-validate').toggleClass('gui-no-validate gui-validate');
			}

			regionPicker.data('selected-country', country.id);

			gui_validator_clear();

			if (countryType == 'autocomplete') {
				gui_address_autocomplete(form, autocompleteUrl);
			}
		}
	});

    $(form).find('.gui-form-country').change();
}

function gui_address_zipcode_flip(form) {
	var elmRow1 = $(form).find('.gui-address-row-1 .gui-col2-equal-col1');
	var elmRow2 = $(form).find('.gui-address-row-2 .gui-col2-equal-col1');

	var htmlRow1 = elmRow1.html();
	var htmlRow2 = elmRow2.html();
	var valRow1 = elmRow1.find('input').first().val();
	var valRow2 = elmRow2.find('input').first().val();

	elmRow1.html(htmlRow2);
	elmRow2.html(htmlRow1);

	elmRow1.find('input').first().val(valRow2);
	elmRow2.find('input').first().val(valRow1);
}

function gui_address_autocomplete(form, url) {
	$(form).find('.gui-form-zipcode').keyup(function () {
		var requestUrl = url.replace('_country_', escape($(form).find('.gui-form-country').val()));
		requestUrl = requestUrl.replace('_zipcode_', escape($(form).find('.gui-form-zipcode').val()));
		requestUrl = requestUrl.replace('_number_', escape($(form).find('.gui-form-number').val()));

		$.getJSON(requestUrl, function (response) {
			if (response.found) {
				$(form).find('.gui-form-streetname').val(response.streetname);
				$(form).find('.gui-form-city').val(response.city);
				$(form).find('.gui-form-region input').val(response.region);
				$(form).find('.gui-form-region select option').filter(function() {
					return $(this).text() == response.region;
				}).prop('selected', true);
			}
		});
	});
}

function gui_focus(form) {
	$().ready(function () {
		$(form).find('input[type!=hidden], select').first().focus();
	});
}

function gui_translation(key, value) {
	gui_translations[key] = value;
}

function gui_translate(string) {
	if (gui_translations[string]) {
		string = gui_translations[string];
	}
	return string;
}

function gui_redirect(url, delay) {
	if (delay < 1) {
		delay = 1;
	}
	delay = delay * 1000;
	setTimeout(function () {
		window.location = url;
	}, delay);
}

function gui_popover_show() {
	var top = $(document).scrollTop() - $('#gui-wrapper').offset().top + (($(window).height() - $('#gui-popover').height()) / 2);
	if (top < 25) {
		top = 25;
	}
	$('#gui-popover').css({
		display: 'block',
		top: top
	});
}
function gui_popover_hide() {
	$('#gui-popover').css({
		display: 'none'
	});
}
function gui_popover(target) {
	var target = $(target);

	if (target) {
		if (target.is(':visible')) {
			target.fadeOut();
		}
		else {
			target.fadeIn();
		}
	}

	// Disable default behaviour
	return false;
}

function gui_popup(url, width, height) {

	if (!width) {
		width = 200;
	}
	if (!height) {
		height = 200;
	}

	var left = (screen.width - width) / 2;
	var top = (screen.height - height) / 2;
	var popup = window.open(url, 'popup', 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=no,resizable=no,left=' + left + ',top=' + top + ',width=' + width + ',height=' + height);

	popup.focus();
}

function gui_facebook(url) {
	if ("standalone" in navigator && navigator.standalone) {
		window.location = url;
	} else {
		gui_popup(url, 500, 300);
	}
}

function gui_select_value(index, element)
{
    var value = $(element).find(':selected').text();
    $(element).parent().find('.gui-value').text(value);
}

function gui_select_values()
{
    $('.gui-select select').each(gui_select_value);
}

function gui_dump(object) {
	alert(object.toSource());
}

function add_product_bundle(bundle_id) {
  var bundles           = $('#bundle_configure_form_' + bundle_id + ' input[name^=bundle_products]');
  var bundleConfigId    = $('#product_configure_bundle_id');
  var productConfigForm = $('#product_configure_form');

  bundles.each(function(idx, elem){
    $(elem).appendTo('#product_configure_form');
  });

  bundleConfigId.val(bundle_id);
  productConfigForm.submit();
}

function update_variant_option(selected, bundleId)
{
  var action    = $(selected).attr('data-action') + '?format=json';
  var form_data = $(selected).closest('form').serialize();

  var bundleItemForm = $(selected).closest('form');
  var oldPrice = bundleItemForm.find('.old-price');
  var price = bundleItemForm.find('.price');
  var discount = bundleItemForm.find('.product-details .discount');
  var discountTitle = discount.find('h1, h2, h3, h4, h5, h6');
  var discountClone = discount.clone();
  discountClone.find('h3').remove();
  var discountText = discountClone.text();

  var bundleItem = $('.bundle-item-' + bundleId);
  var bundleItemBtn = bundleItem.find('.add-bundle-btn');
  var bundleItemStock = bundleItem.find('.out-of-stock');

  var request = $.ajax({
    url: action,
    method: 'POST',
    data: form_data,
    dataType: 'JSON'
  });

  request.done(function(result){
    // Display prices
    oldPrice.text(result.view.price_old);
    price.text(result.view.price);

    if (discount) {
      if (discountTitle.length) discountTitle = discountTitle[0].outerHTML;
      else discountTitle = '';
      discount.html(discountTitle + discountText.replace(/\d{1,3}\%/, result.view.percentage));
    }

    bundleItemBtn.toggle(result.stock.available);
    bundleItemStock.toggle(!result.stock.available);

    Object.keys(result.selected_variants).forEach(function(key) {
      var selected_variant_id = result.selected_variants[key];
      var input_name = 'bundle_products[' + bundleId + '][' + key + ']';

      $('input[name=\"' + input_name + '\"]').remove(); // Removes previously set variants

      // Adds the new ones
      $('<input>').attr({
        type: 'hidden',
        name: input_name,
        value: selected_variant_id
      }).appendTo('#bundle_configure_form_' + bundleId);
    });
  });
}

$().ready(function () {

	// Add focus classes
	$('.gui-input input,.gui-text textarea,.gui-select select').focus(function () {
		$(this).parent().addClass('gui-focus');
	});
	$('.gui-input input,.gui-text textarea,.gui-select select').blur(function () {
		$(this).parent().removeClass('gui-focus');
	});
	$('.gui-number input').focus(function () {
		$(this).parent().parent().addClass('gui-focus');
	});
	$('.gui-number input').blur(function () {
		$(this).parent().parent().removeClass('gui-focus');
	});

	$('.gui-number .gui-up').click(function () {
		var value = parseInt($(this).parent().parent().find('input').val()) + 1;
		$(this).parent().parent().find('input').val(value);
	});
	$('.gui-number .gui-down').click(function () {
		var value = parseInt($(this).parent().parent().find('input').val()) - 1;
		$(this).parent().parent().find('input').val(value);
	});

	// Fix for selected values
	$('.gui-select select').live('change', function () {
        gui_select_value(0, $(this));
	});

    gui_select_values();
});

/*
 * jQuery deprecated live method
 */
if (typeof $.prototype.live == "undefined")
{
    jQuery.fn.extend({
        live: function( types, data, fn ) {
            jQuery( this.context ).on( types, this.selector, data, fn );
            return this;
        }
    });
}
