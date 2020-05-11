<?php
include 'callAPI.php';
include 'admin_token.php';
$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$userToken = $_COOKIE["webapitoken"];
$customFieldPrefix = getCustomFieldPrefix();
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$order_guid = $content['order_guid'];
error_log('orderid ' . $order_guid);
//TODO:: Validate if the current ORDER ID exists, UPDATE ?? SAVE
//========================================================================VALIDATE IF ORDER ID EXISTS=======================================================================
$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $admin_token['access_token'], $url, false);
$userId = $result['ID'];
//get the discount value
$url =  $baseUrl . '/api/v2/admins/' . $userId .'/transactions/'. $order_guid;
$result = callAPI("GET", $admin_token['access_token'], $url, false);
//error_log('invoice info' . json_encode($result));
//$orderId = $result['Orders'][0]['ID'];

// $order_exists = array(array('Name' => 'OrderId', "Operator" => "in",'Value' => $orderId));
// $url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Orders';
// $couponDetails =  callAPI("POST", $admin_token['access_token'], $url, $order_exists);
//  $rec = json_encode($couponDetails['Records']);
//     if ($rec == '[]') {
       
//     }else{
$redeemed =[];
foreach($result['Orders'] as $orders){
    $orderId = $orders['ID'];
    echo json_encode(['result' => $orderId]);
    $order_exists = array(array('Name' => 'OrderId', "Operator" => "in",'Value' => $orderId));
    $url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Orders';
    $couponDetails =  callAPI("POST", $admin_token['access_token'], $url, $order_exists);
        $rec = json_encode($couponDetails['Records']);
        if ($rec == '[]') {
            
        }else{

        $curr_order_id = json_encode($couponDetails['Records'][0]['Id']);
        echo json_encode(['invoice' => $curr_order_id]);
        //get the coupon value of the current 
        $curr_coupon_code = $couponDetails['Records'][0]['CouponCode'];
        echo json_encode(['couponcode' => $curr_coupon_code]);
        //loop here on coupon code array
      //  $curr_coupon_code = str_replace('"', '', $curr_coupon_code); 
        $curr_orderid = str_replace('"', '', $curr_order_id); 

        //update the status of the coupon in orders.
        $coupon_stat = array('Status' => '1');
        $url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Orders/rows/'.  $curr_orderid;
        echo json_encode(['updateurl' => $url ]);   
        $result =  callAPI("PUT",$admin_token['access_token'], $url, $coupon_stat);
        echo json_encode(['updateresult' => $result ]);    
        //update 
        //check if the coupon code is redeemable
        $coupons = json_decode($curr_coupon_code,true);
        error_log($coupons);
        echo json_encode(['coupondecode' => $coupons ]);
        
       
        foreach($coupons as $c)
        {
            $couponname = $c;
            echo json_encode(['updateresult' => $couponname ]);    
            error_log($couponname);
            if (!in_array($couponname, $redeemed)) {
            
            if (strpos($couponname, '-')  !== false) {
            //explode coupon with qty
            $coupon_details  = explode('-',$couponname);   
            echo json_encode(['coup details' =>  $coupon_details ]);  
            $couponname = $coupon_details[0];
            echo json_encode(['name' => $couponname ]);  
            $coupon_quantity = $coupon_details[1];
            echo json_encode(['qty' => $coupon_quantity ]);    
            }
           
            
            echo json_encode(['in array' => $couponname ]);        
            $coupon_details = array(array('Name' => 'CouponCode', 'Value' => $couponname));
            $url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Coupon';
            $coupondetails1 =  callAPI("POST", $admin_token['access_token'], $url, $coupon_details);
            $isLimited = json_encode($coupondetails1['Records'][0]['IsLimited']);
            echo json_encode(['in array' => $isLimited ]);        
            $coupon_qty =  json_encode($coupondetails1['Records'][0]['Quantity']);
            echo json_encode(['qty' => $coupon_qty  ]);  
            $coupon_id = json_encode($coupondetails1['Records'][0]['Id']);
            $coupon_item = json_encode($coupondetails1['Records'][0]['Items']);
            $tcoupon_id = str_replace('"', '',  $coupon_id); 
            error_log('couponid ' . $tcoupon_id);


            if($isLimited == 1){
                echo json_encode(['in islimited' => $isLimited ]);  
                //1. Get the current quantity and coupon id of the coupon increment by 1
                //check if the coupon is for items,if not, + 1;
                $coupon_left = $coupon_item !== 'null' ?  $coupon_qty + $coupon_quantity :  $coupon_qty + 1;
                
                echo json_encode(['qty' => $coupon_left ]);  
                //2. Update the current quantity of the coupon
                $quantity = array('Quantity' => $coupon_left);
                //3. Save the Coupon details along with the fetched campaign ID
                $url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Coupon/rows/'. $tcoupon_id;
                error_log('qty url' . $url);
                echo json_encode(['qty' => $url ]);  

                $result =  callAPI("PUT",$admin_token['access_token'], $url, $quantity);
                echo json_encode(['qty' => $result ]); 
                error_log('qty result' . json_encode($result));
            }
            $redeemed[] = $couponname;
        }
    }

    }
}
    ?>