function getCookie(name) {
	var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	return v ? v[2] : null;
}

function setCookie(name, value, days) {
	var d = new Date;
	d.setTime(d.getTime() + 24*60*60*1000*days);
	document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

function deleteCookie(name) { setCookie(name, '', -1); }

function getTag(html,tag){
    var b,e;
    b = html.indexOf('<'+tag+'>');
    e = html.indexOf('</'+tag+'>');
    if(b<0 || e<0 || e<=b) return '';
    return html.substring(b+2+tag.length, e);
}

function FinazileOrder( frm ) {

		$this = frm;

		var action = $this.attr('action');
		$this.find('.form-row').removeClass('error');

		if ( $this.find('#npregion option:selected').val() == 'xxx' ) {
			hideLoadingGif(); hideDarkMenuBg(); unlockBg();
			showDefaultPopup( warning_title, select_np_region_first );
			return false; 
		} else  if ( $this.find('#cities option:selected').val() == 'xxx' ) {
			hideLoadingGif(); hideDarkMenuBg(); unlockBg();
			showDefaultPopup( warning_title, select_np_city_first );
			return false; 
		} else if ( $this.find('#warehouses option:selected').val() == 'xxx' && $('input[name="deliverytype"]:checked').val() != 'byAddress' ) { 
			hideLoadingGif(); hideDarkMenuBg(); unlockBg();
			showDefaultPopup( warning_title, select_np_wh_first );
			return false; 
		}

		if ( $("#npregion").length ) {
console.log('xxxx', $('input[name="deliverytype"]:checked').val() == 'byAddress');
		   if ( $('input[name="deliverytype"]:checked').val() == 'byAddress' ) { 
			url_prof = '/profile/deliveryformb/check_' + $('html').data('lang');
			if ( $('#nr').length ) url_prof = '/profile/deliveryformbb/check_' + $('html').data('lang');
		   } else {
			url_prof = '/profile/deliveryforma/check_' + $('html').data('lang');
			if ( $('#nr').length ) url_prof = '/profile/deliveryformaa/check_' + $('html').data('lang');
		   }
		} else {
console.log('yyyy');
		   if ( $this.find('#warehouses option:selected').val() == 'kurer') { 
			url_prof = '/profile/deliveryformb/check_' + $('html').data('lang');
			if ( $('#nr').length ) url_prof = '/profile/deliveryformbb/check_' + $('html').data('lang');
		   } else {
			url_prof = '/profile/deliveryforma/check_' + $('html').data('lang');
			if ( $('#nr').length ) url_prof = '/profile/deliveryformaa/check_' + $('html').data('lang');
		   }
		}

		$.ajax({
			url: url_prof,
			type: "POST",
			data:  $this.serialize(),
			beforeSend : function() { ; },
			success: function (data, textStatus) {
				if (typeof data.popuphtml == 'undefined') data.popuphtml = '';

        			if (data.status=='ok') { // if nr then user exist
					if ( $('#nr').length ) {
						//gtag('event', 'conversion', {'send_to': 'AW-338649699/76_1CJOP39sCEOPEvaEB'});
						$('#nr').remove();
					}
					// here ajaxfor send order 
					var url  = '/'+ $('html').data('lang') + '/order/send';
					$.post(url, { ordercomment : $('#ord-coment').val() }, function( data ) {
console.log(data);

						if (data.status=='ok') {
							document.location.replace( '/'+ $('html').data('lang') + '/order-send' );
						} else if ( data.status == 'balanstolow' ) {
							hideLoadingGif();
							showDefaultPopup( warning_title, no_money_on_balans );
						} else if ( data.status == 'liqpay' ) {
							//document.location.replace();
							$('#liqpay_data').val(data.lpdata);
							$('#liqpay_sign').val(data.lpsign);
							$('#liqpaysendform').submit();
						/*} else {
							if (typeof data.popuphtml == 'undefined') data.popuphtml = '';
							if ( data.popuphtml.length ) {
								$('#cart-warning-count-place').find('.cart-not-availbale-row').remove();
								$('#cart-warning-count-place').append( data.popuphtml );
								$('.countErrorPopup').addClass('active');
							} else {
								showDefaultPopup( warning_title, order_send_error );
							}
						*/
						} else {
							hideLoadingGif();
							showDefaultPopup( warning_title, order_send_error );
						}

					}, "json");

				} else if ( data.popuphtml.length ) {
					hideLoadingGif(); unlockBg();
					$('#cart-warning-count-place').find('.cart-not-availbale-row').remove();
					$('#cart-warning-count-place').append( data.popuphtml );
					$('.countErrorPopup').addClass('active');
				} else { // errors 
					$.each(data.errors, function(i, val) {
						elm = $this.find( '#cback-inp-err-' + i + '-span' );
						elm.addClass('error').find('.cback-inp-error-text').html(val);
					});
					hideLoadingGif(); hideDarkMenuBg(); unlockBg();
				}
 

			},
			error: function(e) {
				hideDarkMenuBg(); hideLoadingGif(); unlockBg();
				showDefaultPopup( warning_title, 'ajax request error' );
			}
		});

}

function GetCatalogRecord(start, onpage, command, place, ajaxpage, ignoreslick = false) {
	if ( !$(place).length ) return;
	if ( !ajaxpage.length ) ajaxpage = 'ajax-catalog';
	var url = '/' + $('html').data('lang') + '/' + ajaxpage + '?start=' + start + '&retcount=' + onpage + '&specialshow=' + command + '&test=yes';
	//console.log( url );
	$.ajax({
		url: url,
		dataType : "html",
		data: '',
		method: 'POST',
		beforeSend: function (data, textStatus) { },
		error: function() {},
		success: function (data, textStatus) { 
			//console.log(data);
			var stat = getTag(data, 'result');
			if (stat=='ok') {
				/*
				var strt = getTag(data, 'start');
				$("#start").val(strt);
				var more = getTag(data, 'more');
				$("#more").html(more);
				var pages = getTag(data, 'pages');
				$("#catalog-pages").html(pages);
				var onpage = getTag(data, 'showed');
				$("#item-on-page").html(onpage);
				*/
				var htm = getTag(data, 'html');
				$(place).html(htm);
	                        setProductsRating();

				if ( ignoreslick ) return;

			    $(place).slick({
			        slidesToShow: 5,
			        arrows: true,
			        slidesToScroll: 5,
			        responsive: [
			            {
			                breakpoint: 1366,
			                settings: {
			                    slidesToShow: 4,
			                    slidesToScroll: 4
			                }
			            }, {
			                breakpoint: 1230,
			                settings: {
			                    slidesToShow: 4,
			                    slidesToScroll: 4
			                }
			            },
			            {
			                breakpoint: 1180,
			                settings: {
			                    slidesToShow: 3,
			                    slidesToScroll: 3
			                }
			            },
			            {
			                breakpoint: 730,
			                settings: {
			                    slidesToShow: 2,
			                    slidesToScroll: 2
			                }
			            },
			            {
			                breakpoint: 576,
			                settings: {
			                    slidesToShow: 1,
			                    slidesToScroll: 1,
			                    centerMode: true,
			                    centerPadding: 'calc(100% - 310px)',
			                }
			            }
			        ]
			    });

        		} else {
				//$("#catalog-content").html('Server request error! Try again later.');
				$(place + '-section').hide();
			}
		}
	});
}

function GetCatalog(start) {
	var prevstart=$("#start").val();
	$("#start").val(start);
	$("#more").html('');
	$("#catalog-pages").html('');
	if (start == 0) {
	        $("#items-in-catalog").html('');
	}
	var def_action = 'ajax-catalog';
	//if ( show_assortiment == 1 ) def_action = 'ajax-catalog-items';
	//console.log( '/' + $('html').data('lang') + '/' + def_action + $('#turcoffee_product_filter').serialize() );
	$.ajax({
		url: '/' + $('html').data('lang') + '/' + def_action,
		dataType : "html",
		data: $('#turcoffee_product_filter').serialize(),
		method: 'POST',
		beforeSend: function (data, textStatus) { 
			$('#loading-content').show();
		},
		error: function() { 
			$('#loading-content').hide();
			cur_ajax = null; 
			$("#catalog-content").html('Server request error! Try again later.');
		},
		success: function (data, textStatus) { 
			//console.log(data);
			$('#loading-content').hide();
			var stat = getTag(data, 'result');
			if (stat=='ok') {
				var strt = getTag(data, 'start');
				$("#start").val(strt);
				var more = getTag(data, 'more');
				$("#more").html(more);
				var pages = getTag(data, 'pages');
				$("#catalog-pages").html(pages);
				var onpage = getTag(data, 'showed');
				$("#item-on-page").html(onpage);
				//var total = getTag(data, 'total');
				//$("#item-in-catalog").html(total);
				var htm = getTag(data, 'html');
				$("#items-in-catalog").append(htm);
	                        setProductsRating();
				//$("#items-in-catalog").html('').html(htm);
				var path = getTag(data, 'path');
				var title = getTag(data, 'pagetitle');
				document.title = title;// + getTag(data, 'page');
				if (pages.length) history.pushState({ 'start' : prevstart, 'path': path, 'title' : title }, title, path);
        		} else {
				$("#catalog-content").html('Server request error! Try again later.');
			}
		}
	});
}

var timersarr = [];
var timersarraction = [];

var _firstload = true;
$(function(){
    window.onpopstate = function(event){
        var state = event.state;
        if(_firstload && !state){ 
            _firstload = false; 
        }
        else if(state){
            _firstload = false;
	    //GetCatalog( state.start );
            // you should pass state.some_data to another function here
            //alert('state was changed! back/forward button was pressed!');
        }
        else{
            _firstload = false;
            // you should inform some function that the original state returned
            //alert('you returned back to the original state (the home state)');
        }
    }
});

function clearSelectedDelivery() {
    $('.form-row-delivery1').removeClass("selected-office")
    $('.form-row-delivery1').removeClass("selected-mailbox")
    $('.form-row-delivery1').removeClass("selected-address")
}

$(document).ready(function() {

	$('.phone-mask').mask("+38-999-999-9999", {placeholder:"_", autoclear: true} );
	$('.bank-card-mask').mask("9999-9999-9999-9999", {placeholder:"_", autoclear: true} );
	var timerid = 0;
	var process_form_checked = false;

	/*
	$('.tryreg').change(function (e) {
		var v = $(this).val();
		if ( v.length ) {
			$.post( '/tryauth', { id : v },  function( data ) {
				if (data.status=='ok') {
					showDarkMenuBg(); showLoadingGif(); lockBg()
					document.location.reload();
				}
			}, "json");
	        }
		//.always( function() { hideLoadingGif(); hideDarkMenuBg(); unlockBg(); ;
	});
	*/

	$(document).on('change', '.cntval_opt', function (e) {
		$this = $(this);
		iid = $this.data('itmid');
		if (  $this.val() >= $this.data('optcount') ) {
			$('.common-price-prices-block-' + iid ).hide();
			$('.opt-price-prices-block-' + iid ).show();
			$('.switch-item-' + iid ).addClass('pr_opt');
		} else {
			$('.common-price-prices-block-' + iid ).show();
			$('.opt-price-prices-block-' + iid ).hide();
			$('.switch-item-' + iid ).removeClass('pr_opt');
		}

	});

	//add balance start
	$('#type-add-balance,#payment-method-select').change(function (e) {
		document.querySelectorAll('.bank-details-item').forEach(el=>{el.classList.remove('active')});
		if ( $(this).val() == 'nalojka' || $(this).val() == 'balans') { ; }
		else {
			document.querySelector('.'+$(this).val()).classList.add('active')
		}
	})

	$('#type-out-balance').change(function (e) {
		$this= $(this);
		var v = $this.find('option:selected').val();
		if ( v == 'monobank' ) v = 'privatbank';
		document.querySelectorAll('.bank-out-details-item').forEach(el=>{el.classList.remove('active')});
		document.querySelector('.'+v+'-out').classList.add('active')
	})

	//
	$('#refresh-status').click(function (e) {
		startLoadingUserProgres();
		$.post( '/'+ $('html').data('lang') + '/ajax/update-status', function( data ) {
			endLoadingUserProgress();
			if (data.status=='ok') {
				$('#stat-user-text').html(data.txt);
				$('#stat-user-text').html(data.txt);
				$('#CurrentProgressLeft').html(data.left);
				$('#current-progrees-name').html(data.userlevel);
				setProgresBar(data.prc);
			}
		}, "json");
	});

	//go drawup order
	$('#go-finish-order').click(function (e) {
		e.preventDefault()
        	if (!$(this).data('incart')) showDefaultPopup(warning_title, cart_is_empty_text);
        	else {
			showDarkMenuBg(); showLoadingGif(); lockBg()
			window.location.href = "/" + $('html').data('lang') + "/process-order";
		}
	});


	$('.balans_form').submit( function(e) {
		e.preventDefault();
		e.stopPropagation();
		$this = $(this);
		/*if ( $this.find('#type-add-balance option:selected').val() == 'xxx' ) {
			showDefaultPopup( warning_title, select_payment_method );
			return false; 
		} else if ( $this.find('#type-add-balance option:selected').val() == 'liqpay' ) {
			document.location.replace( liqpayurl );
		}*/

		var action = $this.attr('action');
		var frmid = $this.attr('id');
		var butelm = $this.find('.subm-but');
		var butelmpropgress = $this.find('#sumb-process');
		$this.find('.form-row').removeClass('error');

		var ok_balans_text = balans_add_ok;
		if ( frmid == 'sub-money-form' )  ok_balans_text = balans_sub_ok;
		if ( frmid == 'transfer-money-form' )  ok_balans_text = balans_trans_ok;

		$.ajax({
			url: action,
			type: "POST",
			data:  $this.serialize(),
			beforeSend : function() { butelm.hide(); butelmpropgress.show(); },
			success: function (data, textStatus) {
        			if (data.status=='ok') {
					$('#'+frmid)[0].reset();
					$('.bank-out-details-item').removeClass('active');
					showDefaultPopup( warning_title, ok_balans_text );
				} else if (data.status=='balanstolow' && $this.attr('id') != 'add-money-form') { 
					showDefaultPopup( warning_title, no_money_on_balans );
				} else if (data.status=='liqpay' && $this.attr('id') == 'add-money-form') { 
					$('#liqpay_data').val(data.lpdata);
					$('#liqpay_sign').val(data.lpsign);
					$('#liqpaysendform').submit();
					// need use LIQPAY FORM
				} else {
					$.each(data.errors, function(i, val) {
						if ( i == 'captcha' ) { 
							//capchaelm.css( 'border', '1px solid red'); 
						//} else if ( frmid == 'sub-money-form' && $this.find('#type-out-balance option:selected').val() == 'cash' && i == 'cardnumber' ) {
							//console.log('ignore-card-number');
						} else {
							$this.find( '#balans-inp-err-' + i + '-span' ).addClass('error');;
						}
					});
				}
				butelm.show(); butelmpropgress.hide();
			},
			error: function(e) {
				butelm.show(); butelmpropgress.hide();
				showDefaultPopup( warning_title, 'ajax request error' );
			}
		});

	});


	$('#repeat-order-but').click(function (obj) {
		obj.preventDefault();
		obj.stopPropagation();
		$.post( '/'+ $('html').data('lang') + '/ajax/repeat-order', { id : $(this).data('ordid') } , function( data ) {
			if (data.status=='ok') document.location.reload();
			else showDefaultPopup( warning_title, error_repeat_order );
		}, "json");
		
	});

	$('.change-sort-order').click(function (obj) {
		obj.preventDefault();
		obj.stopPropagation();
		$('#orderby').val( $(this).data('sortrule') );
		$('.close__sorting').click();
		$('.change-sort-order').toggleClass('active').show();
		$(this).hide();
		$('#selected').html( $(this).html() );
		//$(this).addClass('active');
		GetCatalog(0);
	});

	$('#pickup_stocks_btn').click(function (obj) {
		obj.preventDefault();
		obj.stopPropagation();
		var e = $('.cart_stocks_container ');
		if ( e.length ) {
			e.toggleClass('hidden');
			if ( e.attr('loaded') != 'yes') {
				e.attr('loaded', 'yes');
		                GetCatalogRecord( 0, 30, 'akcii', '#akcii-place', 'ajax-catalog' );
			}
		}
	});

	$('#reflink').click(function(e) {
		e.preventDefault();
		e.stopPropagation();

		if (document.selection) { 
			var range = document.body.createTextRange();
			range.moveToElementText(document.getElementById('reflink'));
			range.select().createTextRange();
			document.execCommand("copy"); 
		} else if (window.getSelection) {
			var range = document.createRange();
			range.selectNode(document.getElementById('reflink'));
			window.getSelection().addRange(range);
			document.execCommand("copy");
			showFlowPopup( 'Copied to clipboard' );
		}		
	});

	$("#upload-photo-form").submit( function(e) {
		e.preventDefault();
		e.stopPropagation();
		var fd = new FormData();
		var files = $('#avatarfn')[0].files;
		if( !files.length ) { showDefaultPopup( warning_title, select_file_first ); return false; }
		if ( files[0].size > 1000000 ) { showDefaultPopup( warning_title, error_file_incorrect ); return false; }

		fd.append('file',files[0]);
		$this = $(this);

		$.ajax({
			url: "/profile/upload",
			type: "POST",
			data:  fd,
			contentType: false,
			cache: false,
			processData:false,
			beforeSend : function() { $this.find('.loading-progress').show(); $this.find('#run-upload-but').hide(); },
			success: function(data) {
				$this.find('.loading-progress').hide();
				$this.find('#run-upload-but').show();

				if(data=='error') showDefaultPopup( warning_title, error_file_incorrect );
				else {
					$("#preview").html(data).fadeIn();
					$("#upload-photo-form")[0].reset(); 
					$('#avatar-place').html(data);
				}
			},
			error: function(e) {
				showDefaultPopup( warning_title, error_file_incorrect );
				$this.find('.loading-progress').hide(); $this.find('#run-upload-but').show();
			}
		});
	});

	$(document).on('click', '.request-delivery-link', function (e) {
		e.preventDefault();
		e.stopPropagation();
		if ( $('html').data('logged') != 1 ) {
			showDefaultPopup( warning_title, must_be_register );
			return false;
		}

		$this = $(this);
		var rid = $this.data('iid');
		$.post( '/'+ $('html').data('lang') + '/ajax/notify', { id : rid } , function( data ) {
			//console.log(data);
			if (data.status=='add') {
				$this.html( $this.data('add') );
			} else if (data.status=='del') {
				$this.html( $this.data('remove') );
			} else { showDefaultPopup( warning_title, 'Operation Error' ); }
		}, "json");
	});

	$(document).on('click', '.add-item-to-fav', function (e) {
		e.preventDefault();
		e.stopPropagation();
		$this = $(this);
		var rid = $this.data('iid');
		$.post( '/'+ $('html').data('lang') + '/ajax/fav', { id : rid } , function( data ) {
			if (data.status=='add') {
				$this.addClass('active');
				setCookie("favlist", JSON.stringify(data.idlist), 300 );
			} else if (data.status=='del') {
				$this.removeClass('active');
				setCookie("favlist", JSON.stringify(data.idlist), 300 );
			} else { ; }
		}, "json");
	});

	$('#search-mobile-form').submit( function( e ){
		var str = $(this).find('.search-forms-string').val();
		if ( str.length < 3 ) {
			showDefaultPopup( warning_title, search_str_len_small );
			e.preventDefault();
			e.stopPropagation();
		} else {
			//$(this).attr('action', $(this).attr('action') + str );
		}
	});

	$('.run-search').click( function( e ) { $('#search-mobile-form').submit(); });

	url_part = '';
	$( '.load-catalog-data').each( function(i,e) { 
		$this = $(this); 
		var ignslick = false;
		//if ( $this.attr('id') == 'akcii-place' ) ignslick = true;
		GetCatalogRecord( $this.data('start'), $this.data('onpage'), $this.data('command'), '#'+$this.attr('id'), $this.data('ajax'), ignslick );
	});

	var hashseries = window.location.hash.slice(1);
	if ( hashseries.length ) {
		if ( $('.hash-' + hashseries ).length )  {
			$('.all-item-section').hide();
			$('.hash-' + hashseries ).show();
			let currentProduct = $('.hash-' + hashseries );
			if ( currentProduct.data('slick') == 'yes' ) initCurentProductPageSlider('.switch-item-'+currentProduct.data('iid'));
		}
	} else {
		let currentProduct = $('.hash-colors-item' );
		if ( currentProduct.length )  {
			initCurentProductPageSlider('.switch-item-'+currentProduct.data('iid'));
		}
	}
	setProductsRating();

	$(document).on('click', '.change-items-in-catalog-line', function (e) {
		var id = $(this).data('whatshow');
		var mainid = $(this).data('mainitemid');
                $('.all-item-inlink-' + mainid).attr( 'style', 'display:none !important;' );
		$('.switch-item-'+id).attr( 'style', '' );
		if ( $(this).data('slick') == 'yes' ) initCurentProductPageSlider('.switch-item-'+id);
		e.preventDefault();
		e.stopPropagation();
	});

	$('.pay_from_bal_btn').click(function (e) {
	        e.preventDefault()
	        $('.buttons-row .drop_list').addClass('active')
	})

	if (document.querySelector('#turcoffee_product_filter')) {
		$('#turcoffee_product_filter').submit(function( e ){
			GetCatalog(0);
			e.preventDefault();
			e.stopPropagation();
		});
	}
        
	// select nova poshta
	if (document.querySelector('#cities')) {

		//checkout start
		$('input[type=radio][name=deliverytype]').on('change', function (e) {
			clearSelectedDelivery();
			var radioval = $(this).val();
			switch (radioval) {
				case 'department': 
				case 'postautomat': 
				    if ( $('#npregion option:selected').val() == 'xxx' ) {
			    		    //$('.select-office').hide();
				    } else {
			    		    $("#cities").change();
			    	    }
			    	    $('.form-row-delivery1').addClass( (radioval == 'department') ? 'selected-office' : 'selected-mailbox' );
		    		    $('.delivery-form-part').hide();
		    		    $('.delivery-form-part').find('.all-cback-inp').prop( 'disabled', true);
				    break;

				case 'byAddress': 
		    		    $('.select-office').hide();
		    		    $('.form-row-delivery1').addClass("selected-address");

		    		    $('.delivery-form-part').show();
		    		    $('.delivery-form-part').find('.all-cback-inp').prop( 'disabled', false);
				    break;
			}
		});

	    $("#cities").on("change", function(e) {
		opt =$(this).find(':selected');
		$('#np_city_ref').val( opt.data('ref') );
		$('#np_city_name').val( opt.text() );

		var add_prm = '';
		if ( $("#npregion").length ) {
			add_prm =  ( $("#npregion").length ) ? '&flag=notcur' : '';
			console.log(add_prm, $('input[name="deliverytype"]:checked').val());
			add_prm1 =  ( $('input[name="deliverytype"]:checked').val() == 'postautomat' ) ? '&show=mailbox' : '';
			console.log(add_prm1);
			add_prm = add_prm + add_prm1;
		}
		$.post( '/'+ $('html').data('lang') + '/get-np-warehouse?warehouses='+$(this).val()+add_prm, function( data ) {
			if (data.status=='ok') {
				$("#warehouses").prop('disabled', false);
				$('#warehouses').html(data.whs);
				if ( $("#npregion").length ) {
				    if ( $('input[name="deliverytype"]:checked').val() != 'byAddress' ) {
					if ($("#cities").val()!='xxx') { $('.select-office').show();  $("#warehouses").change(); }
					else $('.select-office').hide(); 
				    } else $('.select-office').hide(); 
				} else {
					$('#warehouses').change();
				}
			} else { ; }
		}, "json");
	        
	    });

	    $("#npregion").on("change", function(e) {
		opt =$(this).find(':selected');
		$('#np_city_region').val( opt.data('ref') );

		$.post( '/'+ $('html').data('lang') + '/get-np-warehouse?command=getcityes&area='+$(this).val(), function( data ) {
			if (data.status=='ok') {
				$("#cities").prop('disabled', false);
				$('.select-city').show();
				$('#cities').html(data.whs);
				$('#cities').change();
			} else { ; }
		}, "json");
	        
	    });

	    $("#warehouses").select2({});
	    $("#cities").select2({});
	    $("#npregion").select2({});
	    
	    //console.log($("#cities").val());
	    if ( $("#npregion").length ) {
		    if ($("#npregion").val()!='xxx') { $('#cities').show(); $("#npregion").change();  }
	    } else {
		    if ($("#cities").val()!='xxx') { $("#cities").change(); $("#warehouses").prop('disabled', false);  }
	    }

	    $("#warehouses").on("change", function(e) {
		if ( $("#npregion").length ) {
		} else {
			if ( $(this).val() == 'kurer' ) $('.delivery-form-part').find('.all-cback-inp').prop( 'disabled', false);
			else $('.delivery-form-part').find('.all-cback-inp').prop( 'disabled', true);
		}

		opt =$(this).find(':selected');
		$('#np_number_name').val( opt.text() );
	    });
	}

	$('.profile-forms').submit( function(e) {
		e.preventDefault();
		e.stopPropagation();

		$this = $(this);

		if ( $this.find('#npregion option:selected').val() == 'xxx' ) {
			showDefaultPopup( warning_title, select_np_region_first );
			return false; 
		} else if ( $this.find('#cities option:selected').val() == 'xxx' ) {
			showDefaultPopup( warning_title, select_np_city_first );
			return false; 
		} else if ( $this.find('#warehouses option:selected').val() == 'xxx') { 
			showDefaultPopup( warning_title, select_np_wh_first );
			return false; 
		}

		var action = $this.attr('action');
		var businesstype = '';
		if ( $this.attr('id') == 'workforma-form' ) {
			//businesstype = $this.find('input[name="obj[data][businessType]"]:checked').val();
			//if ( businesstype == 'PP' ) action = '/profile/workformb/check_' + $('html').data('lang');
			//else if (businesstype == 'FIZ' ) action = '/profile/workforma/check_' + $('html').data('lang');
			action = '/profile/workformb/check_' + $('html').data('lang');
		}

		if ( $this.attr('id') == 'deliveryforma-form' ) {
			if ( $this.find('#warehouses option:selected').val() == 'kurer') { 
				action = '/profile/deliveryformb/check_' + $('html').data('lang');
			}
		}

		showDarkMenuBg(); showLoadingGif(); lockBg()

		var butelm = $this.find('.save-chg-prof-but');
		$this.find('.form-row').removeClass('error');

		$.ajax({
			url: action,
			type: "POST",
			data:  $this.serialize(),
			beforeSend : function() {
				butelm.prop('disabled', true).css( { 'background-image' : 'url(/images/loading.gif)' } ).find('span').css( { 'opacity' : 0 } );
			},
			success: function (data, textStatus) {
				hideLoadingGif(); hideDarkMenuBg(); unlockBg();
        			if (data.status=='ok') {
					showFlowPopup( profile_data_saved );
				} else {
					$.each(data.errors, function(i, val) {
						//if ( i == 'captcha') { capchaelm.css( 'border', '1px solid red'); } else {
							elm = $this.find( '#cback-inp-err-' + i + '-span' );
							elm.addClass('error').find('.cback-inp-error-text').html(val);
						//}
					});
				}
				butelm.prop('disabled', false).css( { 'background-image' : '' } ).find('span').css( { 'opacity' : 1 } );
			},
			error: function(e) {
				butelm.prop('disabled', false).css( { 'background-image' : '' } ).find('span').css( { 'opacity' : 1 } );
				showDefaultPopup( warning_title, 'ajax request error' );
				hideDarkMenuBg(); hideLoadingGif(); unlockBg();
			}
		});

	});

	$(document).on('click', '.go-to-page-action', function (e) {
		GetActionCatalog( $(this).attr('iid') );
		e.preventDefault();
	});

	$(document).on('click', '.go-to-page, .load-more-link', function (e) {
		GetCatalog( $(this).data('iid') );
		e.preventDefault();
		e.stopPropagation();
	});

	$('.return_to_cart').click( function (e) {
		document.location.replace( '/'+ $('html').data('lang') + '/order' );
		e.preventDefault();
	});

	$('#correct-cart-and-check-again').click( function (e) {
		showLoadingGif();
		$('.countErrorPopup').removeClass('active');

		$.post( '/'+ $('html').data('lang') + '/order/operation?cmd=correct-cart-data', function( data ) {
			if (data.status=='ok') {
				if (typeof data.popuphtml == 'undefined') data.popuphtml = '';
				if ( data.popuphtml.length ) {
					$('#process-order-minicart').find('.process-order-cart-rows').remove();
					$('#process-order-minicart').append( data.popuphtml );
		                        $('#propcess-order-cart-sum').html( data.cartsum + $('#propcess-order-cart-sum').data('prefix') );
				} 
			}
			hideLoadingGif(); hideDarkMenuBg(); unlockBg();
		}, "json");
		e.preventDefault();
	});

/*
	$('#finalizeorder-but').click( function(e) {
		showDarkMenuBg(); showLoadingGif(); lockBg()
	});
*/
	// --------------------
	$('#sendorder-form').submit( function(e) {
		e.preventDefault();
		e.stopPropagation();

		$this = $(this);
		if ( $this.find('#payment-method-select option:selected').val() == 'balans' ) {
			if ( $('#total-balans-value').data('balans') <=0 ) {
				showDefaultPopup( warning_title, no_money_on_balans );
				return;
			}
		}

		showDarkMenuBg(); showLoadingGif(); lockBg()
		
		setTimeout( FinazileOrder, 500, $this );

	});

	$(document).on('click', '.add-to-cart', function (e) {
		//console.log('#massadd | work');              
		e.preventDefault(); 
		id = $(this).data('iid');
		itmname = $(this).data('itmname');
		//elm = $('#cntval_' + id);
		elm = $(this).parent().find('.cntval');
		v = parseInt( elm.val() ) || 0;

		if (document.querySelector('#order-page')) {
			e = $('.cart_items').find('.cntval_' + id);
			if ( e.length ) {
				v1 = parseInt( e.val() ) || 0;
				e.val( v + v1 );
				e.trigger('change');
				return false;
			}
		} 


		//if ( !$('.buy-img-txt-' + id).hasClass('active') && !v ) elm.val(1);
		//else if ( !elm.attr('oldval').length && !v) { /*console.log('not-ajax');*/elm.val('').attr('oldval', ''); return false; }
		//console.log( elm.attr('oldval') +'=='+ elm.val() );
		//if ( elm.attr('oldval') == elm.val() ) { /*console.log('is eq');*/ return false; }

		var url = '/' + $('html').data('lang') + '/order/add-by-artno?source=by-id&id=' + id + '&cnt='+ elm.val();
		//console.log(url);
		$.ajax({
		   url: url,
		   dataType : "html",
		   data: '',
		   success: function (data, textStatus) {
			var info = $.parseJSON(data);
			//console.log(info);
			if (info.status=='ok') {
				msg = added_to_cart_ok_text;
				msg = msg.replace( '{itemname}', itmname );
				showAddToCartPopup( msg );
				$('#cart-count-val').html( info.incart );
				if (document.querySelector('#order-page')) {
					$('.cart_items').append(info.addedhtml);
					reinitCounterCheck();
				}
			} else {
				showDefaultPopup( cart_result_text, added_to_cart_err_text  );
			}
		   }
		});
	});
	$('#subscribe-from').on('submit', function(e) {
		e.preventDefault();
		e.stopPropagation();
		em = $("#subscribe-email-inp").val();
		if (em == "") {
			showDefaultPopup(subs_result_text, subs_result_entemail_text);
		        return false;
		}
		if ($("#protect").val() != "") return false;
		$this = $(this);
		var url = '/subsribe?email='+em;
		jQuery.post(url, function(data) {
		         if (data == "add") {
				showDefaultPopup(subs_result_text, subs_result_subs_text);
		         } else if (data == "del") {
				showDefaultPopup(subs_result_text, subs_result_unsubs_text);
		         } else {
				showDefaultPopup(subs_result_text, subs_result_err_text);
		         }
			 $("#subscribe-email-inp").val('');
	        });
	});

	$('#login-form').on('submit',function(e) {
		e.preventDefault();
		e.stopPropagation();

		$this = $(this);
		var butelm = $this.find('#login-do-button');
		$this.find('.login-error-msg').hide();
		$.ajax({
			url: $this.attr('action'),
			type: "POST",
			data:  $this.serialize()  + '&lang=' + $('#pagelang').data('lang'),
			beforeSend : function() {
				showDarkMenuBg(); 
				lockBg();
				butelm.prop('disabled', true).css( { 'background-image' : 'url(/images/loading.gif)' } ).find('span').css( { 'opacity' : 0 } );
			},
			success: function (data, textStatus) {
				if (data=='noauth') {
					$('.login-error-msg').show();
				} else if (data=='reload') {
					showLoadingGif();
					document.location.replace('/' + $('#pagelang').data('lang') + '/profile');
				} else {
					showLoadingGif();
					document.location.replace('/' + $('#pagelang').data('lang') + '/inactive');
				}
				hideLoadingGif(); unlockBg();
				//hideDarkMenuBg(); 
				//unlockBg();
				butelm.prop('disabled', false).css( { 'background-image' : '' } ).find('span').css( { 'opacity' : 1 } );
			},
			error: function(e) {
				hideDarkMenuBg(); 
				unlockBg();
				butelm.prop('disabled', false).css( { 'background-image' : '' } ).find('span').css( { 'opacity' : 1 } );
				showDefaultPopup( warning_title, 'ajax request error' );
			}
		});

	});
	// --------------------
	$('#add-clt-again-but').click( function(e) {
		$('.default_register_block').show();
		$('.success_register_block').hide();
		e.preventDefault();
	});

	$('#register-form, #personaldata-reg-form').on('submit', function(e) {
		$this = $(this);
		$this.find('.regfrm-rows').removeClass('error');
		capchaelm = $this.find('.g-recaptcha > div:first');
		capchaelm.css( 'border', '');

		var butelm = $this.find('.save-chg-prof-but');
		$.ajax({
			url: $this.attr('action'),
			dataType : "html",
			method: 'POST',
			data: $this.serialize(),
			beforeSend : function() {
				butelm.prop('disabled', true).css( { 'background-image' : 'url(/images/loading.gif)' } ).find('span').css( { 'opacity' : 0 } );
			},
			success: function (data, textStatus) {
				var info = $.parseJSON(data);
				butelm.prop('disabled', false).css( { 'background-image' : '' } ).find('span').css( { 'opacity' : 1 } );
        			if (info.status=='ok') {
					//document.location.replace(info.url);
					$('.default_register_block').hide();
					$('.success_register_block').show();
				} else {
					// show errors ...
					$.each(info.errors, function(i, val) {
						if ( i == 'captcha') {
							capchaelm.css( 'border', '1px solid red');
						} else {
							elm = $this.find('.regfrm-' + i + '-row');
							elm.addClass('error').find('.cback-inp-error-text').html(val);
						}
					});
				}
			},
			error: function(e) {
				butelm.prop('disabled', false).css( { 'background-image' : '' } ).find('span').css( { 'opacity' : 1 } );
			}

		});
		e.preventDefault();
		e.stopPropagation();
	});

	if (document.querySelector('.draw_up_order')) {
		$('#payment-method-select').change( function(e) {
			if ( $(this).val() == 'balans' ) $('#pay-from-balans-button').show();
			else $('#pay-from-balans-button').hide();
		});
	}

	// --------------------
	$('#contact-form').on('submit', function(e) {
		$this = $(this);
		$this.find('.cntcfrm-rows').removeClass('error');
		$this.find('.send-result-div').show();
		$this.find('.loading-indicator').show();
		$this.find('.result-html').hide();
		$this.find('#send-callback').hide();
		//capchaelm = $this.find('#recapcha-palce > div:first');
		//capchaelm.css( 'border', '');
		$this.find('.cntcfrm-captcha-error').hide();
		$.ajax({
			url: $this.attr('action'),
			dataType : "html",
			data: $this.serialize(),
			success: function (data, textStatus) {
				$this.find('#send-callback').show();
				$this.find('.loading-indicator').hide();
				var info = $.parseJSON(data);
				//console.log(info);
        			if (info.status=='ok') {
					document.getElementById("contact-form").reset();
					grecaptcha.reset();
					$this.find('.result-html').show();
					//document.location.replace(info.url);
					//$('.default_register_block').hide();
					//$('.success_register_block').show();
				} else {
					$this.find('.send-result-div').hide();
					// show errors ...
					$.each(info.errors, function(i, val) {
						grecaptcha.reset();
						if ( i == 'captcha') {
							//capchaelm.css( 'border', '1px solid red');
							$this.find('.cntcfrm-captcha-error').html(val).show();
						} else {
							elm = $this.find('.cntcfrm-' + i + '-row');
							elm.addClass('error').find('.cback-inp-error-text').html(val);
						}
					});
				}
			},
		});
		e.preventDefault();
		e.stopPropagation();
	});
});