<?php
            //load coupon values here.
            include 'callAPI.php';
            include 'admin_token.php';

            $contentBodyJson = file_get_contents('php://input');
            $content = json_decode($contentBodyJson, true);
            $coupon_id = $content['couponId'];
            error_log($coupon_id);

            $baseUrl = getMarketplaceBaseUrl();
            $admin_token = getAdminToken();
            $customFieldPrefix = getCustomFieldPrefix();
            // 'Operator' => 'equal', 
            $coupon_details = array(array('Name' => 'Id', 'Value' => $coupon_id));
           // echo json_encode(['result' => $coupon_details]);
            error_log('details' . json_encode($coupon_details));
            $url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Coupon';
            error_log('url' . $url);
            $couponDetails =  callAPI("POST", $admin_token['access_token'], $url, $coupon_details);
            error_log(json_encode($couponDetails['Records']));
            echo json_encode(['result' => $couponDetails['Records']]);

    ?>                           
    