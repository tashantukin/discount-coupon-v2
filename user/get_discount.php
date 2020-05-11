<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$invoice_number = $content['invoice_number'];
error_log($invoice_number);
$invoice_number = str_replace(' ', '', $invoice_number);

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$userToken = $_COOKIE["webapitoken"];
$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $admin_token['access_token'], $url, false);
$userId = $result['ID'];
//get the discount value
$url =  $baseUrl . '/api/v2/admins/' . $userId .'/transactions/'. $invoice_number;
$result = callAPI("GET", $admin_token['access_token'], $url, false);
//echo json_encode(['result' => $result['Orders'][0]['ID']]);


$totaldiscount = 0;

foreach($result['Orders'] as $orders){

$orderId = $orders['ID'];
//echo json_encode(['result' => $orderId]);

$coupon_details = array(array('Name' => 'OrderId', 'Value' => $orderId));

$url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Orders';
//echo json_encode(['result' => $url]);

$couponDetails =  callAPI("POST", $admin_token['access_token'], $url, $coupon_details);

$discount = $couponDetails['Records'][0]['DiscountValue'];
//echo json_encode(['discount' => $discount]);

$totaldiscount =  $totaldiscount + $discount;

}
echo json_encode(['result' => $totaldiscount]);

?>
