(function() {
    var scriptSrc = document.currentScript.src;
    var pathname = (window.location.pathname + window.location.search).toLowerCase();
    var packagePath = scriptSrc.replace('/scripts/scripts.js', '').trim();
    console.log(packagePath);
    var re = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
    var packageId = re.exec(scriptSrc.toLowerCase())[1];
    const HOST = window.location.host;
    var customFieldPrefix = packageId.replace(/-/g, "");
    var token = commonModule.getCookie('webapitoken');
    var userId = $('#userGuid').val();
    var campaign_id;
    var timezone_offset_minutes = new Date().getTimezoneOffset();
    timezone_offset_minutes = timezone_offset_minutes == 0 ? 0 : -timezone_offset_minutes;
    var couponname, coupondiscount;
    //get coupon value to display in Admin transaction details page



function getDiscountValue(orderguid,$this){
    //var invoiceNo  = window.location.pathname.split("/").slice(-1)[0];
    var data = { 'order_number': orderguid }; 
    console.log(data);
    var apiUrl = packagePath + '/get_discount.php';
    $.ajax({
        url: apiUrl,
        method: 'POST',
        //async: false,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(result) {
            var discountDetails = $.parseJSON(result);
            if (discountDetails.result.length == 0) {
            }else{
                $.each(discountDetails.result, function(index, item) {
                    coupondorderid = item.OrderId;
                    coupondiscount = item.DiscountValue;
                    console.log(coupondiscount);
                    if (coupondorderid == orderguid) {
                        var currency = $('#currencyCode').val();
                        var promo = "<p class = 'amount'> </p>";
                        $this.find('.price-cal').append(promo);
                        $this.find('.price-cal .amount').text('- ' + $('#currencyCode').val() + formatter.format(coupondiscount));
                        $this.find('.price-cal .amount').prepend('<label id ="couponname"> </label>');
                        $this.find('.price-cal .amount').children('label').text('Discount Total'); 
                    }
                    

                    var couponspan = '<input type="hidden" class="coupon-msg" id="couponhidden"></span>';
                    $('.page-transaction-details').append(couponspan);
                });
            }
       
        },
        error: function(jqXHR, status, err) {
            toastr.error('Error!');
        }
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


    $(document).ready(function() {
            const url = window.location.href.toLowerCase();
        
            //admin transaction page loads
            if(url.indexOf('/admin/transactions/details') >= 0) {
                $('.panel-order').each(function(){
                    var $this = $(this);
                    var orderguid =  $(this).find('input[name=OrderGuid]').val();
                    console.log(orderguid);
                    getDiscountValue(orderguid,$this);
                    
                
                                    
                });
            
              
            }
    });
})();