(function() {
    var scriptSrc = document.currentScript.src;
    var pathname = (window.location.pathname + window.location.search).toLowerCase();
    var packagePath = scriptSrc.replace('/scripts/package.js', '').trim();
    var re = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
    var packageId = re.exec(scriptSrc.toLowerCase())[1];
    const HOST = window.location.host;
    var customFieldPrefix = packageId.replace(/-/g, "");
    var token = commonModule.getCookie('webapitoken');
    var userId = $('#userGuid').val();
    var campaign_id;
    var timezone_offset_minutes = new Date().getTimezoneOffset();
    timezone_offset_minutes = timezone_offset_minutes == 0 ? 0 : -timezone_offset_minutes;
    var rrpStatus,ifLimited;
    var id,ids;

    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2
      })
    function setTimezone(){
        var timezone_offset_minutes = new Date().getTimezoneOffset();
        timezone_offset_minutes = timezone_offset_minutes == 0 ? 0 : -timezone_offset_minutes;
        var data = { 'timezone': timezone_offset_minutes  }; 
        var apiUrl = packagePath + '/get_timezone.php';
        $.ajax({
            url: apiUrl,
            headers: {
                'Authorization': 'Bearer ' + token,
            },
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

     $('#campaigntable input[type="checkbox"]').click(function(){
        if($(this).attr('id') == 'limited'){

        }else{

        var tempId =  $(this).attr('value');
         $(this).removeAttr('id');
         $(this).attr('id', tempId);
         var par =  $(this).parent('div');
         par.find('.onoffswitch-label').attr('for',tempId);
         id = $(this).attr('id');
            if( $('#'+id).length){
                saveStatus(tempId);
            }
         
     }
    });

function searchItem(keyword,itemguid){
    var searchKeyword = keyword;
    var data = { 'keyword': searchKeyword, 'itemguid' : itemguid}; 
    console.log(data);
    var apiUrl = packagePath + '/get_items.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
          
             var itemDetails = $.parseJSON(result);;
             if (itemguid) {
                itemDetails = $.parseJSON(result);
                console.log(itemDetails);
                var name =  itemDetails.result.Name;
                var itemId = itemDetails.result.ID;
                var itemPrice = itemDetails.result.Price;
                var hasvariants =  itemDetails.result.HasChildItems;
                console.log(hasvariants);

                itemPrice = $('#currencyCode').val() +  formatter.format(itemPrice);     
                var markup = "<tr id='eachitem'><td>" + name + "</td><td id='itemid'>" + itemId + "</td>  <td id='itemprice' pricevalue='"+itemPrice+"'>" + itemPrice + "</td> <td class='pgfncyopt'><div class='fancy-radio'> <input type='radio' value='s1' name='search_result' class='itemradio' checked = checked> <label id=radiolabel></label> </div> </td> </tr>";
                $("table #items").append(markup);
                    $('#itemstable').find('tr').each(function (i, el) {
                            var $tds = $(this).find('td');
                            var id  =  $tds.eq(1).text();
                            var name = $tds.eq(0).text();
                            radiobutton = $tds.find('.itemradio');
                            radiobutton.attr('id',id);
                            radiobutton.attr('itemname',name);
                            radiolabel = $tds.find('#radiolabel');
                            radiolabel.attr('for',id);
                    
                });
                    
                    $("#itemstable #itemid").hide();

            }else {

                console.log(itemDetails + 'else' );
                if (itemDetails.result.length == 0 || result == null)  {
                // alert('not found');            
                }else{
                    $('#itemstable tbody').empty(); //empty the former results
                
                    $.each(itemDetails.result, function(index, item) {
                    
                        var name =  item.Name;
                        var itemId = item.ID;
                        var itemPrice = item.Price;
                        var hasvariants =  item.HasChildItems;
                        console.log(hasvariants);
                        var disabled;
                        //  (hasvariants == true) ?

                        //     disabled = 'disabled' :   disabled = '';
                            
                          //  if (!hasvariants == true) {
                            itemPrice = $('#currencyCode').val() +  formatter.format(itemPrice);     
                            var markup = "<tr id='eachitem'><td>" + name + "</td><td id='itemid'>" + itemId + "</td>  <td id='itemprice' pricevalue='"+item.Price+"'>" + itemPrice + "</td> <td class='pgfncyopt'><div class='fancy-radio'> <input type='radio' value='s1' name='search_result' class='itemradio' " + disabled +"> <label id=radiolabel></label> </div> </td> </tr>";
                            $("table #items").append(markup);
                                $('#itemstable').find('tr').each(function (i, el) {
                                        var $tds = $(this).find('td');
                                        var id  =  $tds.eq(1).text();
                                        var name = $tds.eq(0).text();
                                        radiobutton = $tds.find('.itemradio');
                                        radiobutton.attr('id',id);
                                        radiobutton.attr('itemname',name);
                                        radiolabel = $tds.find('#radiolabel');
                                        radiolabel.attr('for',id);

                            });
                            
                                $("#itemstable #itemid").hide();
                       // }
                    })
                }
        
            }
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}

//get coupon value to display in Admin transaction details page
function getDiscountValue(){
    // var invoiceNumber = pathname.split('=')[1]; 
    var invoiceNo  = window.location.pathname.split("/").slice(-1)[0];
	var data = { 'invoice_number': invoiceNo }; 
    var apiUrl = packagePath + '/get_discount.php';
    $.ajax({
        url: apiUrl,
        headers: {
            'Authorization': 'Bearer ' + token,
        },
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var discountDetails = $.parseJSON(result);
            if (discountDetails.result.length == 0) {
            }else{
                couponname = discountDetails.result[0].CouponCode;
                coupondiscount = discountDetails.result[0].DiscountValue;  
            
                var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                $('.page-transaction-details').append(couponspan);
            }
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}

$('#coupon_code').blur(function() {
   ValidateCoupon();
  });
//prevent spaces
  $('#coupon_code').on("input", function () {
    $(this).val($(this).val().replace(/ /g, ""));
    $(this).val($(this).val().replace(/[^a-z0-9]/gi, ''));

});

  function ValidateCoupon() {
    var couponinput = $('#coupon_code').val();
	var data = { 'coupon_code': couponinput }; 
    var apiUrl = packagePath + '/validate_coupon.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var discountDetails = $.parseJSON(result);
            if (discountDetails.result.length == 0) {
                $('#msg').remove();
                $('#save_details').prop("disabled",false);
                           
            }else{
                var error = '<span class="coupon-msg" id="msg">Coupon code already exists.</span>';
                var inputparent = $('#coupon_code').parent('.form-element');
                    if ($('.form-element').find('#msg').length == 0) {  
                        inputparent.append(error);
                    }
                         $('#save_details').prop( "disabled", true);
            }
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
    });
}
    
function saveStatus(id) {
    if ($('#'+id).is(":checked")){
            rrpStatus = 1;
            }else { rrpStatus = 0;}

        console.log(rrpStatus);
        var couponid = $('#'+id).val();
        var data = { 'couponId': couponid , 'status': rrpStatus };
         var apiUrl = packagePath + '/package_switch.php';
        $.ajax({
            url: apiUrl,
            headers: {
                'Authorization':  token,
            },
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
               if(rrpStatus == 1){
               }else { toastr.success('Campaign is disabled.');}
              
            },
            error: function (jqXHR, status, err) {
                  toastr.error('---');
            }
        });
       
       }
            
function getMarketplaceCustomFields(callback) {
        var apiUrl = '/api/v2/marketplaces'
        $.ajax({
            url: apiUrl,
            method: 'GET',
            contentType: 'application/json',
            success: function(result) {
                if (result) {
                    callback(result.CustomFields);
                }
            }
        });
}

function saveCampaignDetails() {
        if ($('#limited').is(":checked")){
            ifLimited =  1;
        }else{ ifLimited = 0}
        //get the merchants
        var merchantlist = [];
        var $boxes = $('input[name=merchant]:checked');
        console.log('checks '+  $boxes.length );
    
        $boxes.parents('.item-row').each(function(){
           var $this = $(this); 
           var merchant = $this.find('input').attr('id'); 
           merchantlist.push(merchant);
           console.log(merchantlist);
           
       });

       //get the discount type
        var discountType = $('input[name=discount_type]:checked').parent().text().trim();
        console.log(discountType);
        var data = { 'campaign_name': $('#campaign_name').val(), 'last_updated': timezone_offset_minutes, 'coupon_code': $('#coupon_code').val(), 'isLimited': ifLimited, 'isEnabled': '1', 'discount_value': $('#d-val').val(), 'max_redeem': $('#redeem').val(),'merchants': JSON.stringify(merchantlist), 'discountType': discountType };
        var apiUrl = packagePath + '/save_details.php';
        $.ajax({
            url: apiUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(result) {
                toastr.success('Campaign details successfully saved.');
                location.reload(); 
                clearFields();
            },
            error: function(jqXHR, status, err) {
               // toastr.error('Error!');
            }
        });
    }


    function saveItemDetails() {
        if ($('#limiteditem').is(":checked")){
            ifLimited =  1;
        }else{ ifLimited = 0}
     
       //get the discount type
        var discountType = $('input[name=discount_type_item]:checked').parent().text().trim();
        var itemId = $('input[name=search_result]:checked').attr('id');
        console.log(discountType);
        var data = { 'campaign_name': $('#keyword').val(), 'Item': itemId , 'last_updated': timezone_offset_minutes, 'coupon_code': $('#coupon_codeitem').val(), 'isLimited': ifLimited, 'isEnabled': '1', 'discount_value': $('#dval_item').val(), 'max_redeem': $('#redeemitem').val(),'merchants': null, 'discountType': discountType };
        console.log(data);
        var apiUrl = packagePath + '/save_details.php';
        $.ajax({
            url: apiUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(result) {

                toastr.success('Campaign details successfully saved.');
                location.reload(); 
                clearFieldsItem();
            },
            error: function(jqXHR, status, err) {
               // toastr.error('Error!');
            }
        });
    }

    function clearFields(){
        $('#campaign_name').val('');
        $('#redeem').val('');
        $('#campaign_name').val('');
        $("#limited").prop("checked", false);
        $('#coupon_code').val('');
        $('#d-val').val('');
       
        }

    function clearFieldsItem(){
        $('#keyword').val('');
        $('#coupon_codeitem').val('');
        $('#redeemitem').val('');
        $('#dval_item').val('');
        $("#limiteditem").prop("checked", false);
    }
    function deletePage() {
        var data = { 'campaignId' : campaign_id,'userId': userId};
        // console.log(pagedids);
         var apiUrl = packagePath + '/delete_content.php';
        $.ajax({
            url: apiUrl,          
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(result) {
                toastr.success('Campaign details successfully deleted.');
                location.reload(); 
            },
            error: function (jqXHR, status, err) {
            }
        });
    }

    function editPage(col1) {
        var couponname,coupondiscount,islimited,redeemable;
        $('#campaign_name').val(col1);
       
        console.log($('.coupon_id').val());
        var data = { 'couponId' : $('.coupon_id').val()};
         var apiUrl = packagePath + '/get_coupon_details.php';
        $.ajax({
            url: apiUrl,          
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(result) {
                var discountDetails1 = $.parseJSON(result);
                console.log(JSON.stringify(discountDetails1));
                   couponname = discountDetails1.result[0].CouponCode;
                   coupondiscount = discountDetails1.result[0].DiscountValue;  
                   islimited = discountDetails1.result[0].IsLimited; 
                   redeemable =  discountDetails1.result[0].MaxRedeem;
                   discounttype = discountDetails1.result[0].DiscountType;
                   if (discounttype == 'Fixed') {
                    $("#fix").prop("checked", true);
                    $('.sign-indicator').addClass('hide');
                    
                    }
                     $('#redeem').val(redeemable);
                     $('#coupon_code').val(couponname);
                     $('#d-val').val(coupondiscount);
                    if(islimited == 1) {
                        $("#limited").prop("checked", true);
                    }else {
                        //disable max redeem if unlimited
                        $('#redeem').attr("disabled", "disabled");
                    }
                    //added merchants feature
                    merchants = JSON.parse(discountDetails1.result[0].Merchants);
                    console.log(merchants);
                    if(merchants != null) {
                        merchants.forEach(function(element) {
                            var $boxes = $('input[name=merchant]');
                            $boxes.parents('.item-row').each(function(){
                            var $this = $(this); 
                                var merchantid = $this.find('input').attr('id'); 
                                    if (element == merchantid) {
                                    $this.find('input').prop("checked", true);
                                }
                            })
                        });
                    }
            },
            error: function (jqXHR, status, err) {
            }
        });
    }

    //edit for items coupon
    function editItems(col1,itemguid) {
        var couponname,coupondiscount,islimited,redeemable;
        $('#keyword').val(col1);
        console.log($('.coupon_id').val());
        var data = { 'couponId' : $('.coupon_id').val()};
         var apiUrl = packagePath + '/get_coupon_details.php';
        $.ajax({
            url: apiUrl,          
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(result) {
                var discountDetails1 = $.parseJSON(result);
                couponname = discountDetails1.result[0].CouponCode;
                coupondiscount = discountDetails1.result[0].DiscountValue;  
                islimited = discountDetails1.result[0].IsLimited; 
                redeemable =  discountDetails1.result[0].MaxRedeem;
                discounttype = discountDetails1.result[0].DiscountType;

                if (discounttype == 'Fixed') {
                $("#fixed").prop("checked", true);
                $('.sign-indicator').addClass('hide');
                
                }
                    $('#redeemitem').val(redeemable);
                    $('#coupon_codeitem').val(couponname);
                    $('#dval_item').val(coupondiscount);
                if(islimited == 1) {
                    $("#limiteditem").prop("checked", true);
                }else {
                    //disable max redeem if unlimited
                    $('#redeemitem').attr("disabled", "disabled");
                }
                searchItem('',itemguid);
                   
            },
            error: function (jqXHR, status, err) {
            }
        });
    }

    //update coupon details

    function updateDetails(){
        if ($('#limited').is(":checked")){
            ifLimited =  1;
        }else{ ifLimited = 0}
        console.log('limited ' + ifLimited);
        var discountType = $('input[name=discount_type]:checked').parent().text().trim();
         //get the merchants
         var merchantlist = [];
         var $boxes = $('input[name=merchant]:checked');
         console.log('checks '+  $boxes.length );
     
         $boxes.parents('.item-row').each(function(){
            var $this = $(this); 
            var merchant = $this.find('input').attr('id'); 
            merchantlist.push(merchant);
            console.log(merchantlist);
            
        });

        var data = { 'couponId' : $('.coupon_id').val(), 'campaignId': $('.camp_id').val(), 'campaign_name': $('#campaign_name').val(), 'last_updated': timezone_offset_minutes, 'coupon_code': $('#coupon_code').val(), 'isLimited': ifLimited, 'isEnabled': '1', 'discount_value': $('#d-val').val(), 'max_redeem': $('#redeem').val(),'merchants': JSON.stringify(merchantlist),'discountType': discountType };
        var apiUrl = packagePath + '/update_details.php';
        $.ajax({
            url: apiUrl,
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(result) {
                toastr.success('Campaign details successfully updated.');
                location.reload(); 
                clearFields();
               
            },
            error: function(jqXHR, status, err) {
                toastr.error('Error!');
            }
        });
    }

    //update ITEM coupons
    function updateItemDetails(){
        if ($('#limiteditem').is(":checked")){
            ifLimited =  1;
        }else{ ifLimited = 0}
        console.log('limited ' + ifLimited);
        var itemId = $('input[name=search_result]:checked').attr('id');
        var discountType = $('input[name=discount_type_item]:checked').parent().text().trim();
        var data = { 'couponId' : $('.coupon_id').val(), 'campaignId': $('.camp_id').val(), 'campaign_name': $('#keyword').val(), 'last_updated': timezone_offset_minutes, 'coupon_code': $('#coupon_codeitem').val(), 'isLimited': ifLimited, 'isEnabled': '1', 'discount_value': $('#dval_item').val(), 'max_redeem': $('#redeemitem').val(),'discountType': discountType, 'Item': itemId  };
        var apiUrl = packagePath + '/update_details.php';
        $.ajax({
            url: apiUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(result) {
                toastr.success('Campaign details successfully updated.');
                location.reload(); 
                clearFieldsItem();
               
            },
            error: function(jqXHR, status, err) {
                toastr.error('Error!');
            }
        });
    }

    $(document).ready(function() {

        //limit the value to 100% max if discount type is percentage
        $('#d-val').on('input', function () {
            var discountType = $('input[name=discount_type]:checked').parent().text().trim();
            if (discountType == 'Percentage') {
                var value = $(this).val();
                
                if ((value !== '') && (value.indexOf('.') === -1)) {
                    
                    $(this).val(Math.max(Math.min(value, 100), -90));
                }
            }
        });
         
        //for item coupon, if the discount type is percentage
        $('#dval_item').on('input', function () {
            var discountType = $('input[name=discount_type_item]:checked').parent().text().trim();
            if (discountType == 'Percentage') {
                var value = $(this).val();
                if ((value !== '') && (value.indexOf('.') === -1)) {
                    $(this).val(Math.max(Math.min(value, 100), -90));
                }
            }
        });

        discounttype('input[name=discount_type_item]');
        discounttype('input[name=discount_type]');

        // input[name=discount_type_item],input[name=discount_type]
        function discounttype(el){
            $('body').on('change', el, function(){
                $('.sign-indicator').addClass('hide');
                if( $(this).val() == 'percentage' ) {
                    $('.sign-indicator').removeClass('hide');
                }
            });
        }
      
        const url = window.location.href.toLowerCase();
        setTimezone();
        $('#save_details').click(function() {
            var isUpdate =  $('.coupon_id').attr('dir');
            var $boxes = $('input[name=merchant]:checked');
            if (isUpdate ==  'update') {
                updateDetails();
                //update function
            }else {
               if($('#campaign_name').val() == "") {
                    $('#campaign_name').css('border','1px solid red');}
                else if  ($('#coupon_code').val() == "" ) {
                  $('#coupon_code').css('border','1px solid red');
                } 
                else if ($('#d-val').val() == "" ){
                  $('#d-val').css('border','1px solid red');
                }
                // else if (!$('#redeem').is(':disabled') && !$('#coupon_code').is(':disabled'))  
                else if ( $('#redeem').val() == "" && $('#limited').is(":checked"))  
                {   console.log('cond 2')
                 $('#redeem').css('border','1px solid red');
                }
               
                else if ($boxes.length < 1) {
                    $('#merchanterror').text('Please select a merchant.').css('color', 'red');
                }
                
               else {
                saveCampaignDetails();
                $('#merchanterror').text('');
                $('#createcampaign').modal().hide();
                $("#modal .close").click();
               }
              
            }           
        });

        $('#save_items').click(function() {
            var isUpdate =  $('.coupon_id').attr('dir');
            if (isUpdate ==  'update') {
                updateItemDetails();
                //update function
            }else {
               if($('#keyword').val() == "") {
                    $('#keyword').css('border','1px solid red');}
                else if ($('#coupon_codeitem').val() == "" ) {
                  $('#coupon_codeitem').css('border','1px solid red');
                } 
                else if (!$('#redeemitem').is(':disabled') && !$('#coupon_codeitem').is(':disabled') )  
                {   
                    $('#redeemitem').val() == "" ? $('#redeemitem').css('border','1px solid red') : ''
                }
                else if ($('#dval_item').val() == "" ){
                  $('#dval_item').css('border','1px solid red');
                }
           
              else {
                saveItemDetails();
                $('#freeitemcoupon').modal().hide();
                $("#modal .close").click();
              }
              
           }           
        });


        $('#createcampaign .close').click(function() {
            $('#limitedoption').show();
            clearFields();
            $('#msg').remove();

            //
          });

        $('#createcampaign2 .close').click(function() {
            $('#limiteitem').show();
            clearFieldsItem();
            $("#itemstable > tbody").empty();
         //   $('#msg').remove();

            //
          });


  //delete the page contents
  $('#popup_btnconfirm').click(function() {
    campaign_id = $('.record_id').val();
    deletePage();
    //
  });
  $("#campaigntable").on('click', '#edit', function() {

    var itemid =  $(this).parents('tr').find('#campaignname').attr('value');
    console.log(itemid);
    if (itemid) {
    // get the current row
    // campaign id for campaign name
    var camp_id = $(this).attr('data-id');
    $('.camp_id').val(camp_id);

    var coup_id = $(this).attr('dir');
     $('.coupon_id').val(coup_id);
     $('.coupon_id').attr('dir','update');
      var isUpdate =  $('.coupon_id').attr('dir'); 
   if (isUpdate ==  'update') {
        $("#redeemitem").removeAttr("disabled");
         $("#coupon_codeitem").attr("disabled", "disabled");
         $('#limiteditem').hide();
    }

    ids = $(this).attr('dir');
    $('.coupon_id').val(ids);
    
    var currentRow = $(this).closest("tr");
    col1 = currentRow.find("#campaignname").html(); // get current row 1st table cell TD value
    editItems(col1,itemid);
    }else{

    // get the current row
    // campaign id for campaign name
    var camp_id = $(this).attr('data-id');
    $('.camp_id').val(camp_id);

    var coup_id = $(this).attr('dir');
     $('.coupon_id').val(coup_id);
     $('.coupon_id').attr('dir','update');
      var isUpdate =  $('.coupon_id').attr('dir'); 
   if (isUpdate ==  'update') {
        $("#redeem").removeAttr("disabled");
         $("#coupon_code").attr("disabled", "disabled");
         $('#limitedoption').hide();
    }

    ids = $(this).attr('dir');
    $('.coupon_id').val(ids);
   
    var currentRow = $(this).closest("tr");
    col1 = currentRow.find("#campaignname").html(); // get current row 1st table cell TD value
    editPage(col1);
    }


  });


//admin transaction page loads
if(url.indexOf('/admin/transactions/details') >= 0) {
    getDiscountValue();
}

$('body').on('keyup', '.merchant-box-head > input', function(){
    var value = $.trim($(this).val()).toLowerCase();
    $('.body-items .item-row').filter(function(){
        $(this).toggle($(this).find('.fancy-checkbox1 label').text().toLowerCase().indexOf(value) > -1)
    });
});  

$('body').on('click', '#search', function(){
    !$('#keyword').val() ? $('#keyword').addClass("noinput") : searchItem($('#keyword').val(),''), $('#keyword').removeClass("noinput") ;
  
});


$('body').on('click', '#select-all-merchant', function(){
    if( $(this).is(":checked") ) {
        $('.merchant-box-body .body-items input[type=checkbox]').prop('checked', true);
    }
    else 
    {
        $('.merchant-box-body .body-items input[type=checkbox]').prop('checked', false);
    }
});


$('body').on('click', 'input[name=merchant]',function(){
    var boxes = $('input[name=merchant]:checked');
    console.log('click ' + boxes.length);
     (boxes.length < 1) ? $('#merchanterror').text('Please select a merchant.').css('color','red') : $('#merchanterror').text('');
});

$('body').on('click', '#select-all-merchant',function(){
    var boxes = $('input[name=merchant]:checked');
    console.log('click select all ' + boxes.length);
    (boxes.length < 1) ? $('#merchanterror').text('Please select a merchant.').css('color','red') : $('#merchanterror').text('');
});

$('body').on('click', '.itemradio', function(){
     $('#keyword').val($(this).attr("itemname"));
    
});


    });
    
})();