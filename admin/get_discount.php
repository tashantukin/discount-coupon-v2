
<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$invoice_number = $content['order_number'];
error_log($invoice_number);
//$order_number = str_replace(' ', '', $invoice_number);

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$userToken = $_COOKIE["webapitoken"];
$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $admin_token['access_token'], $url, false);
$userId = $result['ID'];
//get the discount value
// $url =  $baseUrl . '/api/v2/admins/' . $userId .'/transactions/'. $invoice_number;
// $result = callAPI("GET", $admin_token['access_token'], $url, false);
//echo json_encode(['result' => $result['Orders'][0]['ID']]);

// $totaldiscount = 0;

//foreach($result['Orders'] as $orders){

// $orderId = $orders['ID'];
//echo json_encode(['result' => $orderId]);

$coupon_details = array(array('Name' => 'OrderId', 'Value' => $order_number));

$url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Orders';
//echo json_encode(['result' => $url]);

$couponDetails =  callAPI("GET", $admin_token['access_token'], $url, false);

$discount = $couponDetails['Records'];
//echo json_encode(['discount' => $discount]);

//$totaldiscount =  $totaldiscount + $discount;
//}
echo json_encode(['result' => $discount]);

?>
