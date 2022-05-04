<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<!-- begin header --> 
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Discount Coupon</title>

    <link href="css/adminstyle.css" rel="stylesheet" type="text/css">
    <link href="css/coupon.css" rel="stylesheet" type="text/css">
</head>
<!-- end header --> 
        <div class="page-coupon">
                <div class="pull-left">
              
            </div>
            <div class="page-content page-layout">
                <div class="gutter-wrapper">
                <div class="page-topnav" style="height: 5px;">
                    <div class="float">
                        <!-- <a class="btn-info-plug-in" href="https://support.arcadier.com/hc/en-us/articles/360030008454" target="_blank" >How to use this Plug-In?</a> -->
                    </div>
                </div>

                    <div class="panel-box">
                        <div class="page-content-top private-setting-container-switch">
                            <div class="row">
                                <div class="col-md-8">
                                    <div><i class="icon icon-3x discount-icon-big"></i></div>
                                    <div>
                                        <p><b>Create coupons for buyers to use on your marketplace for discounts</b></p>
                                    </div>
                                </div>
                                <div class="col-md-4 text-right">
                                    <a href="#" class="blue-btn al-middle" data-toggle="modal"data-target="#freeitemcoupon">Create Item Coupon</a>
                                    <a href="#" class="blue-btn al-middle" data-toggle="modal" data-target="#createcampaign">Create New Campaign</a>
                                </div>
                            </div>
                        </div>
                    
                    <div class="panel-box ">
                        <div class="blsl-list-tblsec1">
                            <table id ="campaigntable" class="sortable">
                                <thead>
                                    <tr>
                                        <th>Campaign Name</th>
                                        <th>Last Updated</th>
                                        <th class="sorting_2"  style='visibility:hidden'>Last Updated1</th>
                                        <th>Coupon Code</th>
                                        <th>Discount Value</th>
                                        <th>Merchants</th>
                                        <th>Validity Period</th>
                                        <th>Redemption</th>
                                        <th>Actions</th>
                                     
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- <tr> -->
                                    <?php   
                                        include 'get_details.php';
                                        $campaign =  getCampaignDetails();
                                        $admin_token = getAdminToken();
                                        $customFieldPrefix = getCustomFieldPrefix();
                                        $baseUrl = getMarketplaceBaseUrl(); 
                                        $url = $baseUrl . '/api/v2/marketplaces/';
                                        $marketplaceInfo = callAPI("GET", $admin_token['access_token'], $url, false);
                                        
                                        foreach ($marketplaceInfo['CustomFields'] as $cf) {
                                            if ($cf['Name'] == 'Timezone' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
                                                $tz= $cf['Values'][0];
                                            }
                                        }
                                        foreach($campaign['Records'] as $campaigndetails){
                                        ?>

                                            <!-- <tr> -->
                                                <?php
                                            error_log($campaign_id = $campaigndetails['Id']);
                                             $campaign_name = $campaigndetails['CampaignName'];  
                                             $last_updated =  $campaigndetails['LastUpdated'];
                                             $coupon =  getCouponDetails($campaign_id);
                                                 foreach($coupon['Records'] as $coupondetails) {
                                                    $coupon_id = $coupondetails['Id'];
                                                    $coupon_code = $coupondetails['CouponCode'];
                                                    $coupon_discount = $coupondetails['DiscountValue'];
                                                    $coupon_maxredeem = $coupondetails['MaxRedeem'];
                                                    $coupon_quantity =  $coupondetails['Quantity'];
                                                    $coupon_enabled = $coupondetails['IsEnabled'];
                                                    $coupon_limited = $coupondetails['IsLimited'];
                                                    $coupon_item =  $coupondetails['Items'];
                                                    $coupon_discout_type = $coupondetails['DiscountType'];
                                                    $coupon_merchants = json_decode($coupondetails['Merchants']);
                                                    // $merchanttno;
                                                    if($coupon_merchants != null ||  $coupon_merchants != '[]'){
                                                        $merchanttno =  0;
                                                        foreach($coupon_merchants as $coupmerchants){
                                                            $merchanttno++;
                                                         }
                                                    }else {
                                                        //$merchanttno = 'ITEM';
                                                    }

                                                     $coupon_item != null ? $merchanttno = 'ITEM' : $merchanttno;   

                                                    $timezone_name = timezone_name_from_abbr("", $tz*60, false);
                                                    date_default_timezone_set($timezone_name);
 
                                                    $date = date('d/m/Y H:i', $last_updated);
                                                    $date1 = date('Ymd', $last_updated);

                                                    $valid_end = $coupondetails['valid_end_date'] != null ?  date('d/m/Y H:i', $coupondetails['valid_end_date']) : "";
                                                    $valid_start = $coupondetails['valid_start_date'] != null ? date('d/m/Y H:i', $coupondetails['valid_start_date']) : "";


                                                    if($coupon_enabled == 1){
                                                        error_log('index '. $coupon_enabled);
                                                       $checked = "checked = checked";
                                                    }else { 
                                                       $checked = "";
                                                       error_log($coupon_enabled);
                                                    
                                                    }
                                                    $discount_type = $coupon_discout_type == 'Percentage' ? $discount_type =  $coupon_discount . '%' : $discount_type = number_format($coupon_discount,2);
                                   
                                                    echo  "<td id = 'campaignname' value = $coupon_item>" . $campaign_name . "</td>";
                                                    echo "<td class='sorting_1'>" .  $date . "</td>";
                                                    echo "<td class='sorting_2' style='visibility:hidden'>" .  $date1 . "</td>";
                                                    echo "<td>" .  $coupon_code . "</td>";
                                                    echo  "<td>". $discount_type . "</td>";
                                                    echo  "<td>". $merchanttno  . "</td>";
                                                     echo  "<td>". $valid_start .' - ' . $valid_end  . "</td>";
                                                    echo "<td>";
                                        ?>

                                            <?php
                                                    if($coupon_limited == '1') {
                                                        echo "<span>  $coupon_quantity  </span>  <span> / $coupon_maxredeem </span>" ;
                                                    }else{
                                                        echo "<div class='onoffswitch yn'>";
                                                        echo "<input type='checkbox'  value= $coupon_id name='onoffswitch' class='onoffswitch-checkbox switch-private-checkbox' id= $coupon_id $checked>";
                                                        echo "<label class='onoffswitch-label' for= $coupon_id > <span class='onoffswitch-inner'></span> <span class='onoffswitch-switch'></span> </label>";
                                                        echo "</div> ";    
                                                }
                                            ?> 
                                        </td>
                                        <td>    
                                            <?php
                                                ($coupon_item != null || $coupon_item != '') ?  $datatarget = "#freeitemcoupon" : $datatarget = "#createcampaign" ;
                                            ?>
                                             
                                            <a href="#" data-toggle="modal" dir="<?php echo $coupon_id; ?>"data-target="<?php echo $datatarget ?>" id="edit" data-id="<?php echo $campaign_id; ?>"><i class="icon icon-edit"></i></a>
                                            <a href="#" dir= "<?php echo $campaign_id; ?>" class="btn_delete_act" id = "del"><i class="icon icon-delete"></i></a>
                                        </td>
                                    </tr>
                                    <?php
                                             }
                                        }
                                    ?>
                                </tbody>
                            </table>

                          </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-12"> 
            <nav class="text-center" aria-label="Page navigation">
              <ul class="pagination justify-content-center">

              </ul>
            </nav>
        </div>
            </div>
            <div class="clearfix"></div>
        </div>
        <div class="popup  popup-area popup-delete-confirm page-coupon" id="DeleteCustomMethod">
        <input type="hidden" class="record_id" value="">
            <div class="wrapper"> <a href="javascript:;" class="close-popup"><img src="images/cross-icon.svg"></a>
                <div class="content-area">
                    <p>Are you sure you want to delete this?</p>
                </div>
                <div class="btn-area text-center smaller">
                    <input type="button" value="Cancel" class="btn-black " id="popup_btncancel">
                    <input id="popup_btnconfirm" type="button" value="Okay" class="my-btn btn-blue">
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>



        <div class="modal fade modal-campaign-details" tabindex="-1" role="dialog" aria-labelledby="createcampaign" id="createcampaign">

            <input type="hidden" class="coupon_id" value="" dir="">
            <input type="hidden" class="camp_id" value="" dir="">
           
            <div class="modal-dialog modal-cm" role="document">
                <div class="modal-content">
                    <form class="needs-validation" action=" " method="post" id="createcampaign2" novalidate>
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><img src="images/cross-icon.svg"></button>
                            <h4 class="modal-title" id="gridSystemModalLabel">Campaign Details</h4>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="form-element">
                                        <label>Campaign Name</label>
                                        <input type="text" name="" class="w-100 " id = "campaign_name"  required="required"/>
                                    </div>
                                </div>

                            </div>                 


                            <div class= "row">            

                              <div class ="col-md-6">          
                                    <div id ="limitedoption">
                                        <div class="form-element">
                                            <label>Is this a limited coupon?</label>
                                            <div class="onoffswitch ">
                                                <input type="checkbox"  name="limited" class="onoffswitch-checkbox switch-private-checkbox " id="limited">
                                                <label class="onoffswitch-label" for="limited"> <span class="onoffswitch-inner"></span> <span class="onoffswitch-switch"></span> </label>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- <div class="col-sm-12"> -->
                                        <div class="form-element">
                                            <label>Maximum Redemptions</label>
                                            <div class="row">
                                                <div class="col-sm-6">
                                                    <input type="number" onkeypress="return isNumber1(event)" name="" class="w-100" id="redeem" disabled="disabled" min="0" required>
                                                </div>
                                            </div>
                                        </div>
                                    <!-- </div> -->
                                    <div class="clearfix"></div>
                                    <!-- <div class="col-sm-6"> -->
                                        <div class="form-element">
                                            <label>Coupon Code</label>
                                            <input type="text" name="" class="w-100" id="coupon_code" maxlength="10 "  required="required"/>
                                        </div>
                                    <!-- </div> -->

                                    <div class="form-element pgfncyopt">
                                        <label>Discount Type</label>
                                        <div class="fancy-radio">
                                            <input value="percentage" name="discount_type" id="percent" checked="" class="" type="radio">
                                            <label for="percent"><span>Percentage</span></label>
                                        </div>
                                     
                                        <div class="fancy-radio">
                                            <input value="fixed" name="discount_type" id="fix" class="" type="radio">
                                            <label for="fix"><span>Fixed</span></label>
                                        </div>
                                    </div>
                                    <!-- <div class="clearfix">   </div> -->
                                    <!-- <div class="col-sm-6"> -->
                                        <div class="form-element val-change">
                                            <label>Discount value</label>
                                            <span>
                                            <input type="number" onkeypress="return isNumber(event)" name="" id="d-val" class="w-100"  min="0" max="100" id="discount_value"  required="required"/>
                                            </span>
                                            <span class="sign-indicator">%</span>
                                       </div>
                                    
                                    <div class="form-element val-change">
                                            <label>Validity Period</label>
                                            <input type="text" class="w-100 vp-range review-datepicker-input" data-parent="#createcampaign .modal-body" name="validity_period" id='review-datepicker'>
                                    </div>

                                       <!-- <div class='review-datepicker'><h4>Validity Date</h4><form><div class='form-element'><input class='review-datepicker-input' type='text' name='review-daterange' id='review-datepicker' placeholder='DD/MM/YYYY - DD/MM/YYYY'></div></form></div> -->
                                   
                                         <!-- <label>Discount Value</label>
                                          
                                            <span class="sign-indicator">%</span> -->
                                        
                              </div>

                                <div class="col-md-6">

                                    <div class="form-element">
                                        <label>Apply to Merchants</label>
                                        <div class="classy-merchant-box">
                                            <div class="merchant-box-head">
                                                <input type="text" name="q" placeholder="Search merchants">
                                            </div>
                                            <div class="merchant-box-body">
                                                <div class="body-filter">
                                                    <div class="item-row">
                                                        <div class="fancy-checkbox1">
                                                            <input type="checkbox" id="select-all-merchant">
                                                            <label for="select-all-merchant">Select all</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="body-items">
                                                <?php
                                                  //added for dynamic merchants
                                                    $merchants =  getMerchants();
                                                    foreach($merchants['Records'] as $merchantdetails) {
                                                        $firstname = $merchantdetails['FirstName'];
                                                        $lastname = $merchantdetails['LastName'];
                                                        $id = $merchantdetails['ID'];
                                                        $displayname = $merchantdetails['DisplayName'];
                                                      echo  "<div class='item-row'>";
                                                       echo "<div class='fancy-checkbox1'>";
                                                         echo  "<input type='checkbox' id= '$id' name='merchant'>";
                                                           echo "<label for='$id' class='merchantname'>$displayname</label>";
                                                       echo "</div>";
                                                    echo "</div>";
                                                    }
                                                ?>
                                            </div>
                                        </div>
                                     
                                    </div>    
                                </div>
                           </div>  
                    </div>
                    <p id ="merchanterror"><p>                             
                        <div class="modal-footer text-left">
                            <input type="button" class="blue-btn" value="Save changes" id ="save_details">
                            <!-- data-dismiss="modal" -->
                        </div>
                    </form>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->
    </div>

        <div class="modal fade modal-campaign-details" tabindex="-1" role="dialog" aria-labelledby="freeitemcoupon" id="freeitemcoupon">
            <div class="modal-dialog modal-cm" role="document">
                <div class="modal-content">
                    <form class="needs-validation" id="createcampaign2" novalidate>
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><img
                                    src="images/cross-icon.svg"></button>
                            <h4 class="modal-title" id="gridSystemModalLabel">Create Item Coupon</h4>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="form-element">
                                        <label>Select Item</label>
                                        <div class="search-i-free">
	                                        <input type="text" name="" placeholder="Search Item name" class="w-100 search" required id="keyword" />
	                                        <button id ="search"><img src="images/icon-w-search.png"></button>
	                                    </div>
                                    </div>

                                    <div class="free-coupan-list ">
                                    	<table class="table" id = itemstable>
                                    		<thead>
                                    			<tr>
                                    				<th>Item</th>
                                    				<th>Price</th>
                                    				<th></th>
                                    			</tr>
                                    		</thead>
                                    		<tbody id ="items">
                                    			<tr>
                                    			
                                    			</tr>
                                    		</tbody>
                                    	</table>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 left-part">
                                <div id ="limitedoption">
                                        <div class="form-element">
                                            <label>Is this a limited coupon?</label>
                                            <div class="onoffswitch ">
                                       
                                                 <!-- <input type="checkbox" value =  name="limited" class="onoffswitch-checkbox switch-private-checkbox " id="limiteditem"> -->
                                                <input type="checkbox" name="limited" class="onoffswitch-checkbox switch-private-checkbox " id="limiteditem">
                                                <label class="onoffswitch-label" for="limiteditem"> <span class="onoffswitch-inner"></span> <span class="onoffswitch-switch"></span> </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-element">
                                        <label>Maximum Redemptions</label>
                                        <input type="number" onkeypress="return isNumber1(event)" name="" class="w-100" id="redeemitem" disabled="disabled"  min="0" required>
                                    </div>
                                    <div class="form-element">
                                        <label>Coupon Code</label>
                                        <input type="text" name="" class="w-100" id="coupon_codeitem" maxlength="10" required />
                                        <!-- <div class="error_msg">Coupon code already exists.</div> -->
                                    </div>
                                </div>

                                <div class="col-md-6 right-part">
                                    <div class="form-element pgfncyopt">
                                        <label>Discount Type</label>
                                        <div class="fancy-radio">
                                            <input type="radio" value="percentage" name="discount_type_item" id="percentage" checked="" class="">
                                            <label for="percentage"><span>Percentage</span></label>
                                        </div>
                                        &nbsp;
                                        &nbsp;
                                        &nbsp;
                                        <div class="fancy-radio">
                                            <input type="radio" value="fixed" name="discount_type_item" id="fixed" class="">
                                            <label for="fixed"><span>Fixed</span></label>
                                        </div>
                                    </div>
                                    <div class="form-element val-change">
                                        <label>Discount value</label>
                                        <span>
                                            <input type="number" name="" id="dval_item" class="w-100 " min="0" max="100" required="">
                                        </span>
                                        <span class="sign-indicator">%</span>
                                    </div>


                                      <div class="form-element val-change">
                                            <label>Validity Period</label>
                                            <input type="text" class="w-100 vp-range review-datepicker-input" data-parent="freeitemcoupon .modal-body" name="validity_period1" id='review-datepicker1'>
                                    </div>


                                </div>                    



                            </div>
                        </div>
                        <div class="modal-footer text-left">
                        <input type="button" class="blue-btn" value="Save changes" id ="save_items">
                            <!-- <input type="submit" class="blue-btn" value="Save"> -->
                        </div>
                    </form>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->






        <!-- End Start Seller popup-->
        <div id="cover"></div>
        <div id="coverdark"></div>

        <!-- begin footer --> 
    
        <script type="text/javascript">

        jQuery("#myModal").on('shown.bs.modal', function() {
            jQuery('#modaldialog').html5imageupload({});
        });
        /*fixed canvas size issue while edit*/
        jQuery("#myModal").on('show.bs.modal', function() {
            jQuery(window).resize('trigger');
        });
        jQuery('.model-img-crop a.download').attr('data-dismiss', 'modal');
        jQuery('body').on('click', '.model-img-crop .download', function() {
            var src = jQuery(this).attr('href');
            var name = jQuery(this).attr('download');
            jQuery(".browse-control input[name='file_name']").val(name);
            jQuery(".cover-photo.bg-image-photo").html('');
            jQuery(".cover-photo.bg-image-photo").append("<img src=" + src + " alt=" + name + ">");
            jQuery("#myModal").modal("hide")
            return false;
        });


function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function isNumber1(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;

     if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

 function waitForElement(elementPath, callBack){
	window.setTimeout(function(){
	if($(elementPath).length){
			callBack(elementPath, $(elementPath));
	}else{
			waitForElement(elementPath, callBack);
	}
	},10)
}


$('#redeem, #redeemitem').keyup(function(e){         
      if($(this).val().match(/^0/)){
          $(this).val('');
          return false;
      }
    });


    $('#d-val, #dval_item').keyup(function(e){         
      if($(this).val().match(/^0/)){
          $(this).val('');
          return false;
      }
    });
                                
$(document).ready(function() {
    jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "formatted-num-pre": function ( a ) {
        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
        return parseFloat( a );
    },
 
    "formatted-num-asc": function ( a, b ) {
        return a - b;
    },
 
    "formatted-num-desc": function ( a, b ) {
        return b - a;
    }
} );

        $('#campaigntable').DataTable(
        {
        // "paging":   false,
        order: [2, 'desc'],
        // aaSorting: [[2, 'desc']],
        "lengthMenu": [[20], [20]],
        //  "ordering": true,
        "info":     false,
        "searching" :true,
        "pagingType": "first_last_numbers",
        // "columnDefs" : [{"targets": 1, "type": "date-euro"}],
        // "order": [[ 1, "desc" ]]    
        //   "bInfo": true
        columnDefs: [{  "orderable": false, 'targets': [1] },
        {
            'targets': [2], "visible": false
        }]
   
        }
    );

    waitForElement('#campaigntable_wrapper',function(){
        var pagediv =  "<div class ='paging' id = 'pagination-insert'> </div>";
        $('#campaigntable_wrapper').append(pagediv);
    });

    waitForElement('#campaigntable_length',function(){
         $('#campaigntable_length').css({ display: "none" });
    });

    waitForElement('#campaigntable_filter',function(){
        $('div.dataTables_filter input').addClass('w-100');
        $('div.dataTables_filter').addClass('form-element');
        $('div.dataTables_filter input').css('height','34px');
        // https://datatables.net/forums/discussion/9204/custom-class-on-search-input

    });

    $('#coupon_code').keypress(function(e) { var regex = new RegExp("^[a-zA-Z0-9]+$"); var str = String.fromCharCode(!e.charCode ? e.which : e.charCode); if (regex.test(str)) { return true; } e.preventDefault(); return false; });
   // $('#coupon_code').input(function(e) { var regex = new RegExp("^[a-zA-Z0-9]+$"); var str = String.fromCharCode(!e.charCode ? e.which : e.charCode); if (regex.test(str)) { return true; } e.preventDefault(); return false; });
    $('.pr-text').keypress(function(e) { var regex = new RegExp("^[a-zA-Z0-9]+$"); var str = String.fromCharCode(!e.charCode ? e.which : e.charCode); if (regex.test(str)) { return true; } e.preventDefault(); return false; });
    
        //});

        jQuery(window).bind('scroll', function() {

            // jQuery(".sidebar").getNiceScroll().resize();

        });

        jQuery(".mobi-header .navbar-toggle").click(function(e) {

            e.preventDefault();

            jQuery("body").toggleClass("sidebar-toggled");

        });

        jQuery(".navbar-back").click(function() {

            jQuery(".mobi-header .navbar-toggle").trigger('click');

        });

    
            jQuery('.btn_delete_act').click(function() {
            var page_id = $(this).attr('dir');

             $('.record_id').val(page_id);

                jQuery(this).parents("tr").addClass("active");
                jQuery('#DeleteCustomMethod').show();
                jQuery('#cover').show();

            });

            //update button
            jQuery('#edit').click(function() {
         
    
            });
            jQuery('#popup_btnconfirm').click(function() {

                jQuery('#DeleteCustomMethod').hide();
                jQuery("tr.active").remove();
                jQuery('#cover').hide();

            });

            jQuery('#save_details').click(function() {

            jQuery('#DeleteCustomMethod').hide();
            jQuery("tr.active").remove();
            jQuery('#cover').hide();

            });
        
            jQuery('#popup_btncancel,.close-popup').click(function() {
                jQuery("tr.active").removeClass("active");
                jQuery('#DeleteCustomMethod').hide();

                jQuery('#cover').hide();

            });
            
            // checklimit();
            // checklimit($("#limited"),$("#redeem"),$("#coupon_code"));
            // checklimit($("#limiteditem"),$("#redeemitem"),$("#coupon_codeitem"));
            
            $("#limited").on("click", function() {
                checklimit($("#limited"),$("#redeem"),$("#coupon_code"));
            });

            $("#limiteditem").on("click", function() {
                checklimit($("#limiteditem"),$("#redeemitem"),$("#coupon_codeitem"));
            });
        });

        function checklimit(limited,redeem,couponcode){
            if (limited.prop("checked") == false) {
                var isUpdate =  $('.coupon_id').attr('dir');
                if (isUpdate ==  'update') {
                    // $("#redeem").removeAttr("disabled");
                    redeem.removeAttr("disabled");
                    // $("#coupon_code").attr("disabled", "disabled");
                    couponcode.attr("disabled", "disabled");
                }else {
                    // $("#redeem").attr("disabled", "disabled");
                    redeem.attr("disabled", "disabled");
                    // $("#coupon_code").removeAttr("disabled");
                    couponcode.removeAttr("disabled");
                }
                    
            } else {
                    redeem.removeAttr("disabled");
                    // couponcode.attr("disabled", "disabled");
                    //GENERATE RANDOM COUPON CODE
                    // var randcoupon =  Math.random().toString(36).substr(2, 10);
                    // randcouponstring = randcoupon.toUpperCase();
                    // couponcode.val(randcouponstring);
                }
        }
        </script>
        
        <script type="text/javascript">
        (function() {
     'use strict';
     window.addEventListener('load', function() {
         // Fetch all the forms we want to apply custom Bootstrap validation styles to
         var forms = document.getElementsByClassName('needs-validation');
         // Loop over them and prevent submission
         var validation = Array.prototype.filter.call(forms, function(form) {
             form.addEventListener('submit', function(event) {
                 if (form.checkValidity() === false) {
                     event.preventDefault();
                     event.stopPropagation();
                 }
                 form.classList.add('was-validated');
             }, false);
         });
     }, false);
 })();


 
waitForElement('#pagination-insert',function(){
var pagination  = $('#campaigntable_paginate');
$('#pagination-insert').append(pagination);



});

$('#campaigntable .th:contains("Last Updated")').click(function() {
    

});


var date2 = $('#campaigntable th:contains("Last Updated1")');



</script>
<script type="text/javascript" src="scripts/package.js"></script>
<script type="text/javascript" src="scripts/pagination.js"></script>
<script type="text/javascript" src="scripts/jquery.dataTables.js"></script>


<!-- end footer --> 
