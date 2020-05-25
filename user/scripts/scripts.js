(function() {
var scriptSrc = document.currentScript.src;
var pathname = (window.location.pathname + window.location.search).toLowerCase();
var packagePaths = scriptSrc.replace('/scripts/scripts.js', '').trim();
var userId = $('#userGuid').val();
var re = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
var packageId = re.exec(scriptSrc.toLowerCase())[1];
document.addEventListener('DOMContentLoaded', function () {
const HOST = window.location.host;
var hostname =  window.location.hostname;
var customFieldPrefix = packageId.replace(/-/g, "");
var token = commonModule.getCookie('webapitoken');
var coupon;
var couponcode,merchants,discounttype;
var errorType;
var promocode,isEnabled,isLimited,discountVal,maxRedeem,isInvalid, couponId;
var currentSubtotal;
var mpCurrencycode = $('#currencyCode').val();
var deliveryCharge,currentTotal;
var currentSubtotal1;
var discountfromapi;
var couponname, coupondiscount, couponqty,couponleft;
var orderguidcheckout;
var orderId;
var subtotal_del2;
var invoiceStatus;
var bulkdel;
var isExists=0;
var isValid = 0;
var totaldiscountcheckout=0;

var existingcount = 0;


//order history -BUYER
function getDiscountValue(){
    var invoiceNumber = pathname.split('=')[1]; 
	var data = { 'invoice_number': invoiceNumber }; 
    var apiUrl = packagePaths + '/get_discount.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var discountDetails = JSON.parse(result)
            console.log(discountDetails);
            if (discountDetails.result.length == 0) {
            }else{
                //couponname = discountDetails.result[0].CouponCode;
                coupondiscount = discountDetails.result;
                console.log(coupondiscount);
                var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                $('.purchase-pg-hstry-dtls').append(couponspan);
            }
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}
//CHECKOUT
function getDiscountValueCheckout(){
    var invoiceNumber = $('#OrderGuids').val().split(",");
    invoiceNumber.forEach(function (item, index) {
        var invoice = item;
        var data = { 'invoice_number': invoice }; 
        var apiUrl = packagePaths + '/get_discount_checkout.php';
        $.ajax({
            url: apiUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(result) {
                var discountDetails = $.parseJSON(result);
                if (discountDetails.result.length == 0) {
                }else{
                    couponname = discountDetails.result[0].CouponCode;
                    coupondiscount = discountDetails.result[0].DiscountValue;  
                    totaldiscountcheckout = totaldiscountcheckout + parseFloat(coupondiscount);
                    var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                    $('.page-payment').append(couponspan);
                }
            },
            error: function(jqXHR, status, err) {
                toastr.error('Error!');
            }
        });
    });
}

//ORDER HISTORY MERCHANT
function getDiscountValueMerchant(){
    // var invoiceNumberMerchant = $('.ordr-dtls-invoiceid:contains("INVOICE ID")').clone().children().remove().end().text();
    // invoiceNumberMerchant = invoiceNumberMerchant.replace(/[\. ,:-]+/g, "");
    // invoiceNumberMerchant = invoiceNumberMerchant.trim();
    var orderguid =  $('#orderGuid').val();
	var data = { 'order_guid': orderguid }; 
    var apiUrl = packagePaths + '/get_discount_merchant.php';

    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var discountDetails = JSON.parse(result)
            console.log(discountDetails);
            if (discountDetails.result.length == 0) {
            }else{
                // couponname = discountDetails1.result[0].CouponCode;
                // coupondiscount = discountDetails1.result[0].DiscountPercentage;  
                coupondiscount = discountDetails.result;
                console.log(coupondiscount);
                var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                $('.seller-order-detail-page').append(couponspan);
            }
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });

    // $.ajax({
    //     url: apiUrl,
    //     method: 'POST',
    //     contentType: 'application/json',
    //     data: JSON.stringify(data),
    //     success: function(result) {
    //         var discountDetails1 = $.parseJSON(result);
    //         if (discountDetails1.result.length == 0) {
    //         }else{
    //             couponname = discountDetails1.result[0].CouponCode;
    //             coupondiscount = discountDetails1.result[0].DiscountPercentage;  
    //             var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
    //             $('.seller-order-detail-page').append(couponspan);
    //         }
    //     },
    //     error: function(jqXHR, status, err) {
    //         toastr.error('Error!');
    //     }
    // });
}

//ORDER HISTORY ---  MERCHANT SPACETIME
function getDiscountValueMerchant_spacetime(){
    var invoiceNumberMerchant = $('.ordr-dtls-orderid:contains("Invoice id")').clone().children().remove().end().text();
    invoiceNumberMerchant = invoiceNumberMerchant.replace(/[\. ,:-]+/g, "");
    invoiceNumberMerchant = invoiceNumberMerchant.trim();
	var data = { 'invoice_number': invoiceNumberMerchant }; 
    var apiUrl = packagePaths + '/get_discount_merchant.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var discountDetails1 = $.parseJSON(result);
            if (discountDetails1.result.length == 0) {
            }else{
                couponname = discountDetails1.result[0].CouponCode;
                coupondiscount = discountDetails1.result[0].DiscountPercentage;  
                var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                $('.page-seller').append(couponspan);
            }
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}

function getCouponDetails(){
    promocode =  $('#promocode').val().toUpperCase();
	var data = { 'promocode': promocode }; 
    var apiUrl = packagePaths + '/get_coupon_discount.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var coupondetails = $.parseJSON(result);
            if (coupondetails.result.length == 0) {
               $('#msg').remove();
                returnError('Invalid');
            }
           else {
                $('#msg').remove();
                couponcode  =  coupondetails.result[0].CouponCode;
                discountVal =  coupondetails.result[0].DiscountValue;
                isLimited   =  coupondetails.result[0].IsLimited;
                isEnabled =    coupondetails.result[0].IsEnabled;
                maxRedeem =    coupondetails.result[0].MaxRedeem;
                couponqty =    coupondetails.result[0].Quantity;
                couponId =     coupondetails.result[0].Id; 
                var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                $('.page-review').append(couponspan);
           }
        },
        error: function(jqXHR, status, err) {
        }
    });

}

function getCouponDetailsDel2(){
    promocode =  $('#promocode').val().toUpperCase();
	var data = { 'promocode': promocode }; 
    var apiUrl = packagePaths + '/get_coupon_discount.php';
    console.log('api url ' + apiUrl);
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var coupondetails = $.parseJSON(result);
            if (coupondetails.result.length == 0) {
               $('#msg').remove();
                returnError('Invalid');
            }
           else {
                $('#msg').remove();
                couponcode  =  coupondetails.result[0].CouponCode;
                discountVal =  coupondetails.result[0].DiscountValue;
                isLimited   =  coupondetails.result[0].IsLimited;
                isEnabled =    coupondetails.result[0].IsEnabled;
                maxRedeem =    coupondetails.result[0].MaxRedeem;
                couponqty =    coupondetails.result[0].Quantity;
                couponId =     coupondetails.result[0].Id; 
                var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                $('.page-package').append(couponspan);
           }
        },
        error: function(jqXHR, status, err) {
        }
    });
}

function checkRedeemStatus(){
    var orderId  = window.location.pathname.split("/").slice(-1)[0]; // get the invoice number here or from (invoice-id class);
    var data = { 'order_guid' : orderId}; 
    var apiUrl = packagePaths + '/check_redeem_status.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var coupondetails = $.parseJSON(result);
             if (coupondetails.result == null) {
                if( $('#maketplace-type').val() == 'bespoke'){
                    var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                    $('.page-thankyou').append(couponspan); 
                }
                var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                $('.page').append(couponspan); 
             }
            else {
        
          }
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}

//BESPOKE
function checkRedeemStatus_bespoke(){
    console.log('check redeem func');
    var data = { 'order_guid' : orderId}; 
    console.log(data);
    var apiUrl = packagePaths + '/check_redeem_status.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var coupondetails = $.parseJSON(result);
            console.log(result);
             if (coupondetails.result == null) {
                if( $('#maketplace-type').val() == 'bespoke'){
                    var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                    $('.page-thankyou').append(couponspan); 
                }
                var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                $('.page').append(couponspan); 
             }
            else {
           
          }
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}

function decrementCoupon() {
    var orderId  = window.location.pathname.split("/").slice(-1)[0]; // get the invoice number here or from (invoice-id class);
    var data = { 'order_guid' : orderId}; 
    var apiUrl = packagePaths + '/update_coupon_qty.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}

function decrementCouponBespoke() {
    console.log('dec');
    orderId =  $('.invoice-id').text();
    var data = { 'order_guid' : orderId}; 
    var apiUrl = packagePaths + '/update_coupon_qty.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            console.log(result);
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}

//setting the discount value, total values - discount value
function updateOrders() {
    var orderguid = $('#orderGuids').val().split(",");
    orderguid.forEach(function (item, index) {
    var data = { 'order_guid' : item, 'discount_val': discountVal, 'coupon_code': couponcode, 'isLimited' : isLimited,'coupon_qty':couponqty,'coupon_id' : couponId, 'discountTotal': couponvalue}; 
    var apiUrl = packagePaths + '/update_orders.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
});
}
// orderGuids
//setting the discount value, total values - discount value
function updateOrders_del2() {
    var orderguid = $('#orderGuids').val().split(",");
    // console.log(couponvalue);
    orderguid.forEach(function (item, index) {
    var data = { 'order_guid' : item, 'discount_val': discountVal, 'coupon_code': couponcode, 'isLimited' : isLimited,'coupon_qty':couponqty,'coupon_id' : couponId, 'discountTotal': couponvalue}; 
    var apiUrl = packagePaths + '/update_orders.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
})
}

function validate_coupon_checkout(){
    var data = {'order_guid': orderguidcheckout};
    var apiUrl = packagePaths + '/validate_coupon.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var coupondetails = $.parseJSON(result);
             if (coupondetails.result.length == 0) {
                 //do nothing
             }
            else {
            maxRedeem =  coupondetails.result[0].MaxRedeem;
            couponqty =  coupondetails.result[0].Quantity;
            discountVal =  coupondetails.result[0].DiscountValue;
            isLimited   =  coupondetails.result[0].IsLimited;
            isEnabled =    coupondetails.result[0].IsEnabled;
            var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
            $('.page').append(couponspan); 
          }
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}

function removeDiscount(orderid) {
    var data = { 'order_guid' : $('#orderGuids').val() }; 
    var apiUrl = packagePaths + '/remove_discount.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}

$(document).ready(function() {
    const url = window.location.href.toLowerCase();

    //checkout page - bespoke only
    if (url.indexOf('/user/checkout/select-gateway') >= 0) {
        getDiscountValueCheckout();
        discount_checkout();    
     }

    //ORDER HISTORY - BUYER
    if (url.indexOf('/user/order/orderhistorydetail') >= 0) {
       getDiscountValue();
       if ($('#maketplace-type').val()=='spacetime') {
        discount_orderDetails_spacetime(); 
       }else {
        // discount_orderDetails();
        discount_orderDetailsbuyer()
       }    
    }

    //ORDER HISTORY - MERCHANT
    if (url.indexOf('/user/manage/order/details') >= 0) {
        if ($('#maketplace-type').val()=='spacetime') {
          getDiscountValueMerchant_spacetime();
          discount_orderDetails_sp_merchant();
         
        }else {
            getDiscountValueMerchant();
            discount_orderDetails();
        }    
        //tracking plugin
        var invoiceNumber = $('.ordr-dtls-invoiceid:contains("INVOICE ID")').clone().children().remove().end().text();
        var senddeliveryinfo = "<div><a href='#' id='send-delivery-track-info'>Send Delivery Tracking Info</a></div>";
        var imgLink =   "https://" + hostname + "/user/plugins/" + packageId + "/images/cross-icon.svg"; 
        var senddelinfomodal = "<div class='popup  popup-area mx-350 popup-delivery-tracking' id='DeliveryTrackingInfo'><div class='wrapper'> <a href='' class='close-popup'><img src="+ imgLink + "></a><div class='content-area'> <div class='form-element'><label>Tracking Number</label><input type='text' class='w-100' id='trackingnumber' required /></div><div class='form-element'><label>Tracking URL</label><input type='text' id= 'trackingurl' class='w-100 tracking-url' required /> </div> </div> <div class='btn-area text-center smaller'><input type='button' value='Send Email' class='btn-black' id='sendEmail'> <div class='clearfix'> <span id ='status'> </span></div></div></div></div><div class='modal-overlay'></div><div id='cover'></div>";
        $('.footer').after(senddelinfomodal);

        $('.ordr-dtls-buyer-infoind').find('.order-status-dropdown-sec').after(senddeliveryinfo);
        // send delivery tracking popup
        jQuery('#send-delivery-track-info').click(function() {
            jQuery('#DeliveryTrackingInfo').show();
            jQuery('#cover').show();
            });
        $(".close-popup").on("click" , function(){
            closepop();
        });
        function closepop(){
            jQuery('#DeliveryTrackingInfo').hide();
            jQuery('#cover').hide();
        }

        $('#sendEmail').on("click", function(e){
            e.preventDefault();
            var url = $.trim($(".tracking-url").val());
            $(".tracking-url").addClass('error-con');
            if(isUrlValid(url) ) {
            $(".tracking-url").removeClass('error-con');
            sendEDM(invoiceNumber);
            
            }
            });
        function isUrlValid(url) {
        return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
        }

        $(".close-popup").on("click" , function(){
            closepop();
        });
        
        //update the values in items api
        //SAVE STATUS
        function sendEDM(invoiceID){
            invoiceID = invoiceID.replace(/[\. ,:-]+/g, "");
            invoiceID = invoiceID.trim();
            var data = { 'invoice_number': invoiceID, 'trackingNo': $('#trackingnumber').val(), 'trackingURL': $('#trackingurl').val() }; 
            console.log(JSON.stringify(data));
            var apiUrl = packagePaths + '/send_edm.php';
            $.ajax({
                url: apiUrl,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function(result) {
                    var orderDetails = result;
                    console.log(JSON.stringify(orderDetails));
                    $('#status').text('Successfully Sent!');
                    setTimeout(function() { closepop(); }, 3000);
                },
                error: function(jqXHR, status, err) {
                    toastr.error('Error!');
                }
            });
        }
    }

//SPACETIME
//NOTE: Page URL may vary. depending on the payment method you use. This one is for payment gateways other than cod.
if (url.indexOf('/user/checkout/success') >= 0) {
    console.log('for stripe');
    waitForElement('.invoice-id',function(){
        orderId =  $('.invoice-id').text();
        console.log(orderId);
        checkRedeemStatus_bespoke();
    })
    waitForElement('#couponhidden',function() {
         waitForElement('.invoice-id',function(){
            orderId =  $('.invoice-id').text();
            console.log('decrement')
            decrementCouponBespoke();
        })
    })
    // checkRedeemStatus();
    // waitForElement('#couponhidden',function(){
    // decrementCoupon();  
    // })
 }

 //BESPOKE
 //this url is for COD type of payment
 if (url.indexOf('/user/checkout/gateway-selected') >= 0) {
     console.log('check redeem stat');
    waitForElement('.invoice-id',function(){
        orderId =  $('.invoice-id').text();
        console.log(orderId);
        checkRedeemStatus_bespoke();
    })
    waitForElement('#couponhidden',function() {
         waitForElement('.invoice-id',function(){
            orderId =  $('.invoice-id').text();
            console.log('decrement')
            decrementCouponBespoke();
        })
    })
}
    
if (url.indexOf('/user/order/ordersummary') >= 0) {
if($('.register-link').length){
        //do not show coupon feature
    }else {
  
            //copy each orderguid per merchant box
        var orderguid = $('#orderGuids').val().split(",");
        //remove duplicate orderguid in case there are multiple items
        var orderguids = [];
        $.each(orderguid, function(i, el){
            if($.inArray(el, orderguids) === -1) orderguids.push(el);
        });

        $('.charge_box').attr('orderid',"");
            $(".mearchant_box:not(.hasguid)").each(function(i){  
                    // console.log(item);
                $(this).find('.charge_box').attr('orderid',orderguids[i]);
                $(this).addClass('hasguid');
        });

        getOrderTotals();


        var discountlabel = "<label class='lbl-coupon'>Discount Coupon</label>";
        var delbox = $('.mearchant_box .deliver-method');
        delbox.append(discountlabel);

        //SUNTEC ENHANCEMENTS
        //1. APPEND THE COUPON CODE INPUT AFTER DELIVERY COSTS
        var couponinput = "<p class='discount-total'>Discount Total <span class='pull-right'><span> - </span><span id='currencyCode'>" + mpCurrencycode + "</span>  <span id='currencySym'></span><span class='sub-total'><span id='price_amt'><span id='price_amt'></span> </span></p><div class='item-coupon-box'><div class='appand-coupon-rem'></div><div class='promocode-update'><form action=''><input type='text' name='coupon-code' id ='promocode' placeholder='PROMOCODE' class='pr-text' maxlength='10'><input type='text' name='coupon-code2' id ='promocode2' placeholder='PROMOCODE' class='pr-text' maxlength='10'><button type='button' class='apply-promo-btn disable' id='applycoupon'>Apply</button></form></div></div>";   
        // var ordersummarybox = $('.l_box:contains("ORDER SUMMARY")');
        var ordersummarybox =  $('.last_stage_box').children("[class=l_box]");
        ordersummarybox.append(couponinput);
        $('#promocode2').hide();

        //APPLY COUPON 
        $('body').on('click','#applycoupon', function(){
            $('#couponhidden').remove();
                promocode =  $('#promocode').val().toUpperCase();
            getCouponDetailssuntec();

          
            
        });
        //delivery select box
        $('.sel_del_method').on('change', function() {
            calculateTotal();
        });

        //REMOVE COUPON 

        $('body').on('click','.remove-coupon', function(){
            var $this = $(this);
            var itemcouponbox =   $this.parents('.item-coupon-box');
            var discountcode =  $('.coupon-code', itemcouponbox).text();
            console.info('discount code '+  discountcode);
            if($this.parents('.item-coupon-box').hasClass('withitempromo')){
            //    var thisdiv =  $this.parents('.mearchant_box').find('.pr_detail');
            var merchantcouponbox =  $this.parents('.mearchant_box');
            $('.pr_detail',merchantcouponbox).each(function(){
                console.info('inside pr details');
                if ($(this).is('.hasitempromo')) {
                    var code = $(this).attr('couponcode');
                    console.info('code ' + code);
                    if (code == discountcode) {
                    $(this).removeClass("hasitempromo");
                    $('#discounttag',$(this)).remove();
                }
                }
            })
            
            //re compute the discount total for 'merchant promo'
            //TODO: FOR OPTIMIZATION
            var merchantbox = $this.parents('.mearchant_box');
                if (merchantbox.find('.withmerchantpromo')) {
                    $('.item-coupon-box', merchantbox).each(function(){ 
                        console.log('recomputing');
                        if ($(this).is('.withmerchantpromo')) {
                            var itembox = $(this);
                            var totalcostmerchant = 0;
                            var qty = 0;
                            $(".pr_detail:not(.hasitempromo)", merchantbox).each(function(){
                                var total =  $(this).find('.price_tag').text().replace(/[^\d.-]/g, '');
                                var qty1 =  $(this).find('.qty').text().replace(/[^\d.-]/g, '');
                                // total = total * qty1;
                                qty = qty + parseFloat(qty1);
                                totalcostmerchant =  totalcostmerchant + parseFloat(total);
                                var discount_type =  itembox.attr("discounttype");
                                var discount_value = itembox.attr("discountval");
                                var coupon_value = "";
                                (discount_type == "Percentage") ? coupon_value =  parseFloat(calculatePercentage(discount_value,totalcostmerchant)) :  coupon_value = discount_value;
                                $('.sub-total #price_amt', itembox).text(formatter.format(coupon_value));
                            });
                        }
                    })

                }
        }  
        //remove coupon and re compute total
            $this.parents('.item-coupon-box').remove();
            calculateTotal();
            updateOrders_suntec();
        });

        //enter key
        $('#promocode').keypress(function(event){
            console.log('press enter');
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                $('#couponhidden').remove();
                promocode =  $('#promocode').val().toUpperCase();
                  getCouponDetailssuntec();
            }
        });

        //PROCEED BUTTON
        try {
            // if ( $('.coupon-con').length) {
     
                // if ($('.coupon-code').length) {
                     $(".full-btn-procced").clone().prependTo('.btn-area').addClass('clone');
                     $(".full-btn-procced:not(.clone)").addClass('original');
                      $('.clone').removeClass('.full-btn-procced');
                     $(".full-btn-procced:not(.original)").hide();
                    
                  
                  }
     
            // }
       //  }
         catch(err) {
             
         }

        //APPEND CLONED BUTTON
      
        var confirmModal  = "<div class='popup-area cart-checkout-confirm' id ='plugin-popup'><div class='wrapper'> <div class='title-area'><h1>Please remove already expired coupons.</h1></div><div class='content-area'><span id ='main'><span id='addtext'> </span></div><div class='btn-area'>  <a  class='add-cart-btn' id='btn-ok'>OK</a></div></div></div>";
        $('.footer').after(confirmModal);

            //event.stopImmediatePropagation();
            $('.original').prop("onclick", null).off("click").on('click', function(event){ 
                // $('.full-btn-procced').click(function() {
                // $('.clone').prop("onclick", null).off("click").on('click', function(event){ 
         if ($('.coupon-con').length){
            
      //     return false;
           // expired_coupons.length = [];
            validateifCouponExpired();
           



          
           }else {
               console.info('in else');
               $('.clone').trigger("click");
           }    
           });   
          
       
        $('#plugin-popup #btn-ok').click(function(){
            $("#plugin-popup").fadeOut();
            $("#cover").fadeOut();
          }); 
        }

    }
})
//1
function getCouponDetailssuntec(){ 
    promocode =  $('#promocode').val().toUpperCase();
	var data = { 'promocode': promocode }; 
    var apiUrl = packagePaths + '/get_coupon_discount.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        
        success: function(result) {
            var coupondetails = $.parseJSON(result);
            if (coupondetails.result.length == 0) {
               $('#msg').remove();
                returnError('Invalid');
                isValid = 0;
            }
           else {
                isValid = 1;
                console.log('isvalid ' +  isValid);
                $itemcoupon = '';
                $('#msg').remove();
                couponcode  =  coupondetails.result[0].CouponCode;
                discountVal =  coupondetails.result[0].DiscountValue;
                isLimited   =  coupondetails.result[0].IsLimited;
                isEnabled =    coupondetails.result[0].IsEnabled;
                maxRedeem =    coupondetails.result[0].MaxRedeem;
                couponqty =    coupondetails.result[0].Quantity;
                couponId =     coupondetails.result[0].Id; 
                discounttype = coupondetails.result[0].DiscountType
                merchants = JSON.parse(coupondetails.result[0].Merchants);
                $itemcoupon = coupondetails.result[0].Items;
                couponleft = maxRedeem - couponqty;
                console.log('itemcoupon ' + $itemcoupon);

                
                var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                $('.page-package').append(couponspan);
                validateifcouponexists(promocode);
                console.log('exists ' + isExists);
                if (isValid == 1) {
                    console.log('waiting');
                    if(isExists == 1) {
                        returnError('Already exists');
                    }
                    else if(isEnabled == 0) {
                        returnError('Expired');
                        }
                    else if (couponqty == maxRedeem) {
                        //TODO: Check if the coupon attained it's maximum allowed redeemable quantity
                        returnError('Expired');
                    }     
                    else { //show coupons
                        if (merchants != null){
                            showPromoCodeSuntec();
                        }
                        if ($itemcoupon != null) {
                            showItemCode();
                        }
        
                    }
                }
               
            }
        },
      // complete: function(result){
           

     //   },
        error: function(jqXHR, status, err) {
        }
    });
}
//2
function validateifcouponexists(couponcode){
    var count = 0;
    $('.mearchant_box .item-coupon-box').each(function(){ 
      var coupon_code =  $(this).find('.coupon-code').text();

      coupon_code.toUpperCase() == couponcode ?  count++ : '';  
           
    });
    count > 0 ?   isExists = 1  :  isExists = 0, existingcount++ ;
  
}

function validateifCouponExpired(){
   
  
    $('#coupons').length > 0 ? $('#coupons, #break').remove()  : '';
  
    if($('.mearchant_box .item-coupon-box .coupon-con').length > 0 ){ 
        var expired_coupons = [];
        var counterror = 0;
        $('.mearchant_box .item-coupon-box').each(function(){ 
            var coupon_code =  $(this).find('.coupon-code').text();
            var data = { 'promocode': coupon_code }; 
            var apiUrl = packagePaths + '/get_coupon_discount.php';
            console.log('api url ' + apiUrl);
            $.ajax({
                url: apiUrl,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function(result) {
                  var coupondetails = $.parseJSON(result);
                  couponcode  =  coupondetails.result[0].CouponCode;
                  maxRedeem =    coupondetails.result[0].MaxRedeem;
                  couponqty =    coupondetails.result[0].Quantity;
                  couponId =     coupondetails.result[0].Id; 
                  couponleft =    maxRedeem - couponqty;
                  console.log('itemcoupon ' + couponcode);
               

               //   maxRedeem == couponqty ? expired_coupons.push(couponcode) : '';
                },
                error: function(jqXHR, status, err) {
                },
                complete: function(result) {
                    console.log('pushing');
                    console.info('maxredeem ' + maxRedeem + ' ' +  'qty ' + couponqty);
                    maxRedeem == couponqty ? (expired_coupons.push(couponcode), counterror++) : '';

                }
            });
                 
      
          });
          var callAjax= true;
          $(document).ajaxStop(function(){
            if (callAjax){

            console.log('count ' + counterror);
            console.log(expired_coupons);


            if (counterror > 0) {
  
                console.info('in expired ' + expired_coupons );
                $('#coupons').length > 0 ? $('#coupons, #break').remove() : '';
               // event.stopImmediatePropagation(); 
                
                jQuery("#plugin-popup").fadeIn();
                jQuery("#cover").fadeIn();
                jQuery("#plugin-popup").niceScroll({ 
                    cursorcolor: "#999999",
                    cursorwidth:"4px",
                    cursorborderradius:"0px",
                    horizrailenabled:false,
                    cursorborder: "1px solid #999999"
                });
                    expired_coupons.forEach(function (item, index) {
                        var coupon = "<span id='coupons'>" + item + "</span> <br id='break'>";
                        $('.content-area').append(coupon);
                    });
    
                
                //expired_coupons = [];
               
              }

        
              else{
                
               console.info('else in ajax stop');
               $('.clone').trigger("click");
               callAjax= false;   
              
              }

            }    
            });
           


          //.promise().done( function(){ 
              
     
          
        
        
       // } );



         


    }
   
}

function showPromoCodeSuntec(){
    mpCurrencycode = $('#currencyCode').val();
    //2. APPEND THE COUPON DIV FOR EACH MERCHANT BOX
    var coupondiv= "<div class='item-coupon-box' discounttype='" + discounttype + "', discountval='" + discountVal + "', discountqty='" + couponqty + "', islimited='" + isLimited + "', couponid='" + couponId + "', couponleft'" + couponqty + "'><div class='appand-coupon'><div class='coupon-con'><span class='coupon-code' >PROMOCODE</span><span class='pull-right'> <span id='currencySym'></span><span class='sub-total'><span id='price_amt'></span> </span> <i title='Remove' class='fa fa-times remove-coupon'></i> </span></div></div></div>";
    if(merchants != null) {
        var notvalid = 0;
        var counters =  0;
        merchants.forEach(function(element) {
            var merchanttotalcost = 0;
            $(".mearchant_box").each(function(){
                //check if the merchant id exists in merchant list response
                var merchantid = $(this).find('input[data-order-sellerGuid]').val();
                var totalpermerchant = 0; 

                var counter = 0;
                var qty = 0;
                $(".pr_detail:not(.hasitempromo)",$(this)).each(function(){
                    qty1 =  $(this).find('.qty').text().replace(/[^\d.-]/g, '');
                    qty = qty + parseFloat(qty1);
                });
                console.log('qty '+ qty);

                $(".pr_detail:not(.hasitempromo)",$(this)).each(function(){
                    var total =  $(this).find('.price_tag').text().replace(/[^\d.-]/g, '');
                    var qty2 =  $(this).find('.qty').text().replace(/[^\d.-]/g, '');
                    //remove quantity - do not multiply itemx to qty for merchant discounts
                    // total = total * qty2;

                    totalpermerchant =  totalpermerchant + parseFloat(total);
                    counter++;
                });
                console.log('totalpermechant ' + totalpermerchant);

                if (element == merchantid) {
                    //if exists, append each coupon to each merchant box
                    var $this = $(this);
                    $(".pr_detail", $(this)).addClass('hasmerchantpromo');  
                    if (counter != 0){
                        var delbox = $this.find('.deliver-method');
                        delbox.append(coupondiv);
                
                        //CALCULATE THE TOTALS 
                        subtotal_del2=  $('.l_box .sub-total').first().text();
                        console.log('subtotal ' + subtotal_del2);
                        deliveryCharge =  $('.l_box p .delivery-costs').text();
                        subtotal_del= subtotal_del2.replace(/[^\d.-]/g, '');
                        deliveryCharge =  deliveryCharge.replace(/[^\d.-]/g, '');
                        deliveryCharge = deliveryCharge.replace(/-/g, "");
                        deliveryCharge = parseFloat(deliveryCharge);
                        //validate the discout type if Fixed or percentage

                        (discounttype == "Percentage") ? couponvalue =  parseFloat(calculatePercentage(discountVal,totalpermerchant)) :  couponvalue = discountVal * qty;
                           
                        merchanttotalcost =  merchanttotalcost + couponvalue;
                        $('.coupon-con #currencySym:last', $(this)).text('-' + mpCurrencycode);
                        $('.coupon-code:last', $(this)).text(couponcode);
                       // $('.sub-total #price_amt:last', $(this)).text(couponvalue.toFixed(2));
                        $('.sub-total #price_amt:last', $(this)).text(formatter.format(couponvalue));
                        $('.item-coupon-box:last', $(this)).addClass('withmerchantpromo');
                        
                        calculateTotal(); 
                    }
                 }else {
                    notvalid++;
                }
                counters++
             });
             if(notvalid == counters)  {
                returnError('Invalid');
            }  
            
        });

          updateOrders_suntec(); 
     }
}
function showItemCode(){
    console.log('in item code');
    mpCurrencycode = $('#currencyCode').val();
    //2. APPEND THE COUPON DIV FOR EACH MERCHANT BOX
    var coupondiv= "<div class='item-coupon-box' discounttype='" + discounttype + "', discountval='" + discountVal + "', discountqty='" + couponqty + "', islimited='" + isLimited + "', couponid='" + couponId + "', couponleft'" + couponleft + "'><div class='appand-coupon'><div class='coupon-con'><span class='coupon-code' >PROMOCODE</span><span class='pull-right'> <span id='currencySym'></span><span class='sub-total'><span id='price_amt'></span> </span> <i title='Remove' class='fa fa-times remove-coupon'></i> </span></div></div></div>";
    console.log($itemcoupon);
   // if ($itemcoupon != null) {
        
        var merchanttotalcost = 0;
        var notvalid = 0;
        var counter =  0;
        $(".mearchant_box").each(function(){
            console.log('merchant box');
            //check if the item id exists in merchant list response
                var i;
                var totalpermerchant = 0; 
                var itemguid;
                var itemqty;
            //get only the amount of items without existing item coupon
            $(".pr_detail:not(.hasitempromo)", $(this)).each(function(){
                var total =  $(this).find('.price_tag').text().replace(/[^\d.-]/g, '');
                var qty =  $(this).find('.qty').text().replace(/[^\d.-]/g, '');
                //validate total order qty vs coupon available for redeem
                qty  >= couponleft ? qty = couponleft : '';
                total = total * qty;
              
                itemguid = $(this).find('input[name="item-guid"]').val();
                if (itemguid.indexOf($itemcoupon) > -1){
                    i =  itemguid;
                }

                if ($itemcoupon == itemguid) {
                    $(this).addClass('hasitempromo');  
                    //add for validation when user removed the coupon
                    $(this).attr('couponcode', couponcode);
                    var discounttag = "<span class='coupon-code' id ='discounttag'>Discount Applied</span>";
                    $('.price_tag', $(this)).after(discounttag);
                    $('.price_tag', $(this)).css('margin-bottom','7px');
                    //get the item qty
                    itemqty = $(this).find('.qty').text().replace(/[^\d.-]/g, '');
                    //validate if order qty > available coupon left
                    if(itemqty  >= couponleft) {
                        itemqty = couponleft;
                        returnError('Excess Coupon');
                        $(this).attr('couponqty',itemqty);
                        console.info('itemqtty ' + itemqty);
                    }   
                   
                    totalpermerchant =  totalpermerchant + parseFloat(total);
                }else {
                    totalpermerchant = totalpermerchant + 0;
                }
            });
            if ($itemcoupon == i) {
                //if exists, append each coupon to each merchant box
                var $this = $(this); //merchant box
                var delbox = $this.find('.deliver-method');
                delbox.append(coupondiv);
                //CALCULATE THE TOTALS 
                // subtotal_del2=  $('.l_box  p:contains("Sub Total") .sub-total').text();
                subtotal_del2=  $('.l_box .sub-total').first().text();
                deliveryCharge =  $('.l_box p .delivery-costs').text();
                subtotal_del= subtotal_del2.replace(/[^\d.-]/g, '');
                deliveryCharge =  deliveryCharge.replace(/[^\d.-]/g, '');
                deliveryCharge = deliveryCharge.replace(/-/g, "");
                deliveryCharge = parseFloat(deliveryCharge);
                //validate the discout type if Fixed or percentage
                (discounttype == "Percentage") ? couponvalue =  parseFloat(calculatePercentage(discountVal,totalpermerchant)) :  couponvalue = discountVal * itemqty;
                merchanttotalcost =  merchanttotalcost + couponvalue;
                $('.coupon-con #currencySym:last', $(this)).text('-' + mpCurrencycode);
                $('.coupon-code:last', $(this)).text(couponcode);
                $('.sub-total #price_amt:last', $(this)).text(formatter.format(couponvalue));
                $('.item-coupon-box:last', $(this)).addClass('withitempromo');
                //enchancement: decrementing coupon count with total of items ordered.
                $('.item-coupon-box:last', $(this)).attr('itemqty',itemqty);
                //re compute the value of items with 'merchant's promo'
               // if ($(this).find('.withmerchantpromo')) {
                    console.info('Found merchant discount');
                    var numberOfItems = $('.pr_detail', $this).length;
                    $('.item-coupon-box', $(this)).each(function(){ 
                        console.info('inside item coupon box');
                        if ($(this).is('.withmerchantpromo')) {
                            var itembox = $(this);
                            var totalcostmerchant = 0;
                            console.info('number of items ' + numberOfItems);
                            var itemElement;
                           
                            //TOFIX: bug: if only 1 item per merchant
                            if (numberOfItems == 1) {
                                $('.sub-total #price_amt', itembox).text(formatter.format(0))
                            } else {
                                var qty = 0;
                                var merchantitems = $('.pr_detail:not(.hasitempromo)', $this).length;
                                    if(merchantitems > 0){
                                        $(".pr_detail:not(.hasitempromo)", $this).each(function(){
                                            // $(".pr_detail:has(.hasmerchantpromo)", $this).each(function(){
                                            console.info('in pr details?');
                                            var total =  $(this).find('.price_tag').text().replace(/[^\d.-]/g, '');
                                            //subtotal of each item
                                            var qty1 =  $(this).find('.qty').text().replace(/[^\d.-]/g, '');
                                        
                                            //total = total * qty1;
                                            qty = qty + parseFloat(qty1);
                                            totalcostmerchant =  totalcostmerchant + parseFloat(total);
                                            var discount_type =  itembox.attr("discounttype");
                                            var discount_value = itembox.attr("discountval");
                                            var coupon_value = "";
                                            //removed the qty from  computation
                                            (discount_type == "Percentage") ? coupon_value =  parseFloat(calculatePercentage(discount_value,totalcostmerchant)) :  coupon_value = discount_value;
                                            $('.sub-total #price_amt', itembox).text(formatter.format(coupon_value));
                                            console.info('should re compute the price from this part');
                
                                        }); 
                                    }else{
                                        $('.sub-total #price_amt', itembox).text(formatter.format(0));
                                        console.info('should re compute the price from this part');
                                    }
                               // if ($(this).is('.hasitempromo')) {
                                    
                               // }
                            }

                        }
                    })

             //   }
                
                calculateTotal();
                updateOrders_suntec();   
            }else {
                notvalid++;
            }
            counter++
              
        });   
        if(notvalid == counter)  {
            returnError('Invalid');
        }  
   // }
} 

function calculateTotal(){
    //calculates all the discounts in whole transaction 
    var total_coupon_discount = 0;
   
    $(".mearchant_box").each(function(){
        var totaldiscount = 0;
        var merchantdiscount;
        var $merchantbox =  $(this);
        $('.item-coupon-box', $(this)).each(function() {
            
            var itembox = $(this);
            merchantdiscount = $(this).find('.coupon-con .sub-total #price_amt').text().replace(/[^\d.-]/g, '');
            
            if (merchantdiscount == null ||  merchantdiscount == ''){
                merchantdiscount = 0;
            }
                
            totaldiscount = totaldiscount + parseFloat(merchantdiscount);

        });   
         //calculate default total against discount total per merchant
          var default_total = $(this).attr('total');
          default_total <= totaldiscount ? totaldiscount = default_total : totaldiscount = totaldiscount;
          $merchantbox.attr('currenttotal', totaldiscount);
          var current_total= $(this).attr('currenttotal');  
          total_coupon_discount += parseFloat(current_total);
    });  

   // total discount
    $('.discount-total').find('.sub-total #price_amt').text(formatter.format(total_coupon_discount));
    //Total
    // subtotal_del2=  $('.l_box  p:contains("Sub Total") .sub-total').text();
    subtotal_del2=  $('.l_box .sub-total').first().text();

    deliveryCharge =  $('.l_box p .delivery-costs').text();
    if (deliveryCharge == '') {
        deliveryCharge = 0;
    }
    subtotal_del= subtotal_del2.replace(/[^\d.-]/g, '');
    deliveryCharge =  deliveryCharge.replace(/[^\d.-]/g, '');
    deliveryCharge = deliveryCharge.replace(/-/g, "");
    deliveryCharge = parseFloat(deliveryCharge);
    totalwithcoupon = subtotal_del - total_coupon_discount;
    totalwithDelivery = totalwithcoupon + deliveryCharge;
    $('.total_area .total-cost').text(formatter.format(totalwithDelivery))
}

function updateOrders_suntec() {
    var orderguid = $('#orderGuids').val().split(",");
    $(".mearchant_box").each(function(){
        var couponlist = [];
        var orderid = $(this).find('.charge_box').attr('orderid');
        console.log(orderid);
        var d_type,d_val,d_qty,d_limited,d_id,d_code;

        $(".item-coupon-box", $(this)).each(function(){

             d_type = $(this).attr('discounttype');
             d_val = $(this).attr('discountval');
             d_qty = $(this).attr('discountqty');
             d_limited = $(this).attr('islimited');
             d_id = $(this).attr('couponid');
             d_itemqty = $(this).attr('itemqty');
             d_code = $(this).find('.coupon-code').text();

             $(this).attr("itemqty") != undefined ? d_code = d_code + '-' + d_itemqty : '';

             console.info('dcode ' + d_code);

            var merchantdiscount = $(this).find('.coupon-con .sub-total #price_amt').text().replace(/[^\d.-]/g, '');
            if (merchantdiscount == null ||  merchantdiscount == ''){
                merchantdiscount = 0;
            }
            // couponlist.push({
            //     key:   d_code,
            //     value: merchantdiscount
            // });
            couponlist.push(d_code);
            
        });

        var totalpercentage = 0;
        var originalprice = 0
        //totaldiscount of transaction (for purchase history display)
        //total original price of items per merchant
        var default_total = $(this).attr('total');
        
        originalprice =  parseFloat(default_total);
        var totaldiscount = parseFloat($(this).attr('currenttotal'));
         //compute for the percentage of the total discount
         totalpercentage = calculatepercentvalue(totaldiscount,originalprice);
         console.log('total% ' + totalpercentage);
         console.log('totaldisc ' + totaldiscount);

        var data = { 'order_guid' : orderid, 'discounttype': d_type, 'discount_val': totalpercentage, 'coupon_code': JSON.stringify(couponlist), 'isLimited' : d_limited,'coupon_qty': d_qty,'coupon_id' : d_id, 'discountTotal': totaldiscount}; 
        var apiUrl = packagePaths + '/update_orders.php';
        $.ajax({
            url: apiUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(result) {
            },
            error: function(jqXHR, status, err) {
                toastr.error('Error!');
            }
        });
    })

 
    





}

function getOrderTotals(){
    $(".mearchant_box").each(function(){
        var orderid = $(this).find('.charge_box').attr('orderid');
        var data = { 'order_guid' : orderid };
        var apiUrl = packagePaths + '/get_order_total.php';
        var $this = $(this);
        $.ajax({
            url: apiUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(result) {
                var orderTotal = JSON.parse(result)
                orderTotal.result.length == 0 ? '' :  total = orderTotal.result; $this.attr('total', total);
            },
            error: function(jqXHR, status, err) {
                toastr.error('Error!');
            }
        });

    });

}

function waitForElement(elementPath, callBack){
	window.setTimeout(function(){
	if($(elementPath).length){
			callBack(elementPath, $(elementPath));
	}else{
			waitForElement(elementPath, callBack);
	}
	},500)
}
const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2
  })

//append the coupon input

function appendCouponSpacetime(){
    var delcostdiv = $(".order-summary-price .review-order-container:nth-child(2)");
    var promodiv = '<div class="promocode-update" id="promodiv"><input name="coupon-code" placeholder="PROMOCODE" class="pr-text" maxlength="10" type="text" id="promocode"><button type="button" class="apply-promo-btn disable" id="applybutton1">Apply</button></div>';
    delcostdiv.after(promodiv);
}
function appendCoupon() {
    var last = $('.checkout-itm-total-sec div.checkout-total-line1:last');
    var promodiv = '<div class="promocode-update" id="promodiv" style="margin-top:10px"><input name="coupon-code" placeholder="PROMOCODE" class="pr-text" maxlength="10" type="text" id="promocode"><button type="button" class="apply-promo-btn disable" id="applybutton">Apply</button></div>';
    var totaldiv = $('.check-total-btm-sec');
    last.append(promodiv);
}

function appendCouponDelivery2(){
    var ordersummaryContainer =  $('.l_box p:contains("Delivery Costs")');
    var promodiv = '<div class="promocode-update" id="promodiv" style="margin-top:10px"><input name="coupon-code" placeholder="PROMOCODE" class="pr-text" maxlength="10" type="text" id="promocode"><button type="button" class="apply-promo-btn disable" id="applybutton2">Apply</button></div>';
    ordersummaryContainer.append(promodiv);
    $('#promocode').css('width','auto');
    $('#promocode').css('margin-right','0');
    $('#applybutton2').css('width','auto');
}
//toggle the promo code and the discount % if the coupon is 

//TODO: Optimize this function
function showPromoCodeSpacetime(){
    mpCurrencycode = $('#currencyCode').val();
    var promo = '<div class="coupon-con review-order-container" id="coupon"><span class="coupon-code" id="couponinput"><i title="Remove" class="fa fa-times remove-coupon" id="remove"></i></span> </div>';
    $('#promodiv').prepend(promo); 
    var discount = '<div class="coupon-con" id="discount"><span class="pull-right"><span id="currencySym"></span><span class="sub-total"> <span id="price_amt" <span id="price_amt"></span></span> </span></span></div>';
    $('#couponinput').append(promocode);
    $('#couponinput').after(discount);
    $('#msg').remove();
    //calculate the current subtotal - the coupon value
    //1.get the current subtotal from DOM
    currentSubtotal = $('.review-order-price:first').text();
    deliveryCharge =  $('.review-order-container:contains("Delivery cost") .review-order-price').text();
    currentTotal =  $('.review-order-container:contains("Total") .review-order-price').text();
    //trim the characters then parse
    currentSubtotal1 = currentSubtotal.replace(/[^\d.-]/g, '');    
    if (deliveryCharge == '') {
        deliveryCharge = 0;
    }else {
        deliveryCharge =  deliveryCharge.replace(/[^\d.-]/g, '');
        deliveryCharge = parseFloat(deliveryCharge);
    }
    couponvalue =  parseFloat(calculatePercentage(discountVal,currentSubtotal1));
    totalwithcoupon = currentSubtotal1 - couponvalue ;
    totalwithDelivery = totalwithcoupon + deliveryCharge;
    $('#currencySym').text('-' + mpCurrencycode);
    //total - coupon discount
    $('#price_amt').text(couponvalue.toFixed(2));
    //Total
    $('.review-order-container:contains("Total") .review-order-price').text(mpCurrencycode + formatter.format(totalwithDelivery));
    updateOrders();
}
  function showPromoCode(){
    mpCurrencycode = $('#currencyCode').val();
    var promo = '<div class="coupon-con checkout-total-line1" id="coupon"><span class="coupon-code" id="couponinput"><i title="Remove" class="fa fa-times remove-coupon" id="remove"></i></span> </div>';
    $('#promodiv').prepend(promo); 
    var discount = '<div class="coupon-con" id="discount"><span class="pull-right checkout-itm-tprice"><span id="currencySym"></span><span class="sub-total"><span id="price_amt" <span id="price_amt"></span></span> </span></span></div>';
  
    $('#couponinput').append(promocode);
    $('#coupon').prepend(discount);
 
    waitForElement('#promodiv',function(){
        $('#discount .checkout-itm-tprice').css('margin-right','31px');
        $('#msg').remove();

    });

    //calculate the current subtotal - the coupon value
    //1.get the current subtotal
    currentSubtotal = $('.checkout-itm-tprice:first').text();
    deliveryCharge =  $('.checkout-itm-total-sec .checkout-total-line1:nth-child(2) .checkout-itm-tprice').text();

    bulkdel = $('.checkout-itm-total-sec .checkout-total-line1:nth-child(3) .checkout-itm-tprice').text();
   
    //trim the characters then parse
    currentSubtotal1 = currentSubtotal.replace(/[^\d.-]/g, '');

    if (deliveryCharge == '') {
        deliveryCharge = 0;
    }else {
        deliveryCharge =  deliveryCharge.replace(/[^\d.-]/g, '');
        deliveryCharge = parseFloat(deliveryCharge);
    }

    if (bulkdel == '') {
        bulkdel = 0;
    }else {
        bulkdel =  bulkdel.replace(/[^\d.-]/g, '');
        bulkdel = bulkdel.replace(/-/g, "");
        bulkdel = parseFloat(bulkdel);
    }
    
    couponvalue =  parseFloat(calculatePercentage(discountVal,currentSubtotal1));
    totalwithcoupon = currentSubtotal1 - couponvalue;
    totalwithDelivery = totalwithcoupon + deliveryCharge - bulkdel;

    $('#currencySym').text('-' + mpCurrencycode);
    //total - coupon discount
    $('#price_amt').text(couponvalue.toFixed(2));
    //Total
    $('.chkout-totla-amt').text(mpCurrencycode + formatter.format(totalwithDelivery));
    updateOrders();
 }

//SHOW PROMOCODE FOR DELIVERY 2.0 
function showPromoCodeDel2(){


    mpCurrencycode = $('#currencyCode').val();
    var promo = '<div class="coupon-con" id="coupon"><span class="coupon-code" id="couponinput"><i title="Remove" class="fa fa-times remove-coupon" id="remove"></i></span> </div>';
    $('#promodiv').prepend(promo); 
    var discount = '<div class="coupon-con pull-right" id="discount"><span class="pull-right"><span id="currencySym"></span><span class="sub-total"><span id="price_amt" <span id="price_amt"></span></span> </span></span></div>';
    $('#couponinput').append(promocode);
    $('#coupon').append(discount);

    waitForElement('#promodiv',function(){
        $('.coupon-con').css('display','inline-flex');
        $('#discount').css('width','auto');
        $('#couponinput').css( "width", "-=5");
        $('#couponinput').css( "margin-right", "3px");
        $('#msg').remove();
    });
    //calculate the current subtotal - the coupon value
    subtotal_del2=  $('.l_box p .sub-total').text();
    deliveryCharge =  $('.l_box p .delivery-costs').text();
    subtotal_del= subtotal_del2.replace(/[^\d.-]/g, '');
    deliveryCharge =  deliveryCharge.replace(/[^\d.-]/g, '');
    deliveryCharge = deliveryCharge.replace(/-/g, "");
    deliveryCharge = parseFloat(deliveryCharge);
    couponvalue =  parseFloat(calculatePercentage(discountVal,subtotal_del));
    totalwithcoupon = subtotal_del - couponvalue ;
    totalwithDelivery = totalwithcoupon + deliveryCharge;
    $('#currencySym').text('-' + mpCurrencycode);
    //total - coupon discount
    $('#price_amt').text(couponvalue.toFixed(2));
    //Total
    $('.total_area .total-cost').text(formatter.format(totalwithDelivery));
    // updateOrders();
    updateOrders_del2();
}

function returnError(errorType) {
    if (errorType == 'Invalid') {
        errorType = '<span class="coupon-msg" id="msg">Coupon code invalid</span>';
    }else if (errorType == 'Expired'){
        errorType = '<span class="coupon-msg" id="msg">Coupon code expired.</span>';
    }else if (errorType == 'Already exists'){
        errorType = '<span class="coupon-msg" id="msg">Coupon code exists.</span>';
    }else if (errorType == 'Excess Coupon'){
        errorType = '<span class="coupon-msg" id="msg">Only '+ couponleft + ' available for redemption.</span>';
    }

        if ($('.promocode-update').find('#msg').length == 0) {  
            $('.apply-promo-btn').after(errorType);
        }
 }
 function calculatePercentage(num, amount){
    return  parseFloat(num*amount/100).toFixed(2);

  }
function calculatepercentvalue(totaldiscount, originalprice){
    return totaldiscount/originalprice*100;
}

function discount_orderDetails() {
    waitForElement('#couponhidden',function(){
        var promo = '<div class="ordr-dtls-trans-line" id="coupon_ordetails"><span id="couponvalue"></span></div>';
        $('.ordr-dtls-trans-info').append(promo);
        var total  = $('.ordr-dtls-trans-line:first').text();
        console.log(total);
        total1 = total.replace(/[^\d.-]/g, ''); 
        console.log(total1);
        $('#coupon_ordetails').css('display','inline-flex');
        var discount = '<div class="coupon-con" id="discount"><span> <span id="currencySym"></span><span id="price_amt"></span></span></div>';
        waitForElement('#discount',function(){
            $('#discount span').css('display','inline');
        });
        $('#couponvalue').text('Discount Total');
        $('#coupon_ordetails').append(discount);
        $('#currencySym').text('- ' + mpCurrencycode);
        // var disc =  coupondiscount * total1 / 100;
        // console.log('disc ' + disc);
        $('#price_amt').text(formatter.format(coupondiscount));

   });
}
function discount_orderDetailsbuyer() {
    waitForElement('#couponhidden',function(){
        var promo = '<div class="ordr-dtls-trans-line" id="coupon_ordetails"><span id="couponvalue"></span></div>';
        $('.ordr-dtls-trans-info').append(promo);
        var total  = $('.ordr-dtls-trans-line:first').text();
        console.log(total);
        total1 = total.replace(/[^\d.-]/g, ''); 
        console.log(total1);
        $('#coupon_ordetails').css('display','inline-flex');
        var discount = '<div class="coupon-con" id="discount"><span> <span id="currencySym"></span><span id="price_amt"></span></span></div>';
        waitForElement('#discount',function(){
            $('#discount span').css('display','inline');
        });
        $('#couponvalue').text('Total Discount');
        $('#coupon_ordetails').append(discount);
        $('#currencySym').text('- ' + mpCurrencycode);
       // var disc =  coupondiscount * total1 / 100;
       // console.log('disc ' + disc);
        $('#price_amt').text(formatter.format(coupondiscount));

   });
}

function discount_checkout() {
    waitForElement('#couponhidden',function(){
        console.log('disc-chekout ' + coupondiscount);
        var last = $('.checkout-itm-total-sec .checkout-total-line1:last');
        var promo = '<div class="checkout-totline-left" id="coupon_ordetails"></div> <div class="checkout-itm-tprice" id="couponvalue"></div> <div class="clearfix"></div>';
        last.append(promo);
        $('#coupon_ordetails').text("Discount Total");
        $('#couponvalue').text('-' + mpCurrencycode + formatter.format(totaldiscountcheckout));
   });
} 

function discount_orderDetails_sp_merchant() {
    waitForElement('#couponhidden',function(){
            var promo = '<div class="ordr-dtls-trans-line" id="coupon_ordetails"><span id="couponvalue"></span></div>';
            $('.ordr-dtls-trans-info').append(promo);
            var total  = $('.ordr-dtls-trans-line:first').text();
            console.log(total);
            total1 = total.replace(/[^\d.-]/g, ''); 
            console.log(total1);

            $('#coupon_ordetails').css('display','inline');
            var discount = '<div class="coupon-con" id="discount"><span> <span id="currencySym"></span><span id="price_amt"></span></span></div>';
        waitForElement('#discount',function(){
            $('.coupon-con').css('display','inline');
        });
        $('#couponvalue').text(couponname);
        $('#coupon_ordetails').append(discount);
        $('#currencySym').text('-' + mpCurrencycode);
        var disc =  coupondiscount * total1 / 100;
        $('#price_amt').text(formatter.format(disc));
        $('#currencySym').css('width','auto');
        $('#price_amt').css('width','auto');
   });
}

//APPEND DISCOUNT DETAIL TO BUYER PURCHASE HISTORY -  SPACETIME
function discount_orderDetails_spacetime() {
    waitForElement('#couponhidden',function(){
        var promo = '<div class="ordr-dtls-trans-line" id="coupon_ordetails"><span id="couponvalue"></span> </div>';
        $('.ordr-dtls-trans-info').append(promo);
        $('#coupon_ordetails').css('display','inline');
        var discount = '<div class="coupon-con" id="discount"><span id="currencySym"></span><span id="price_amt"></span></div>';
    waitForElement('.coupon-con',function(){
            $('.coupon-con').css('display','inline');
        });
     $('#couponvalue').text(couponname);
     $('#coupon_ordetails').append(discount);
     $('#currencySym').text('-' + mpCurrencycode);
     $('#price_amt').text(formatter.format(coupondiscount));
     $('#currencySym').css('width','auto');
     $('#price_amt').css('width','auto');
   });
}

//FORM ACTIONS
//VALIDATE IF THE COUPON IS EXPIRED OR CONSUMES THE MAX AMOUNT
//DECREMENT THE COUPON QTY ON EACH REDEEM.
//
$('#applybutton').click(function(){
    $('#couponhidden').remove();
     promocode =  $('#promocode').val().toUpperCase();
     getCouponDetails();
    waitForElement('#couponhidden',function(){
        if(isEnabled == 0) {
            returnError('Expired');
        }
        else if (couponqty == maxRedeem) {
            //TODO: Check if the coupon attained it's maximum allowed redeemable quantity
            returnError('Expired');
        }     
        else { //return error
        // if ($('#promodiv').find('#coupon').length == 0) {  
        //     showPromoCode();
        // }
        }
    })
})
//SPACETIME
$('#applybutton1').click(function(){
    $('#couponhidden').remove();
    promocode =  $('#promocode').val().toUpperCase();
    getCouponDetails();
   waitForElement('#couponhidden',function(){
        if(isEnabled == 0) {
            returnError('Expired');
        }
        else if (couponqty == maxRedeem) {
            returnError('Expired');
        }     
        else { //return error
            if ($('#promodiv').find('#coupon').length == 0) {  
            showPromoCodeSpacetime();
            }
        }
    })
})
 
$('#applybutton2').click(function(){
    $('#couponhidden').remove();
    promocode =  $('#promocode').val().toUpperCase();
    getCouponDetailsDel2();
   waitForElement('#couponhidden',function(){   
        if(isEnabled == 0) {
            returnError('Expired');
            }
        else if (couponqty == maxRedeem) {
            //TODO: Check if the coupon attained it's maximum allowed redeemable quantity
            returnError('Expired');
        }     
        else { //return error
            if ($('#promodiv').find('#coupon').length == 0) {  
                showPromoCodeDel2()
            }
        }
    })
})

}); //dom content loaded
})(); //function 