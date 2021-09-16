
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


$coupon_details = array(array('Name' => 'OrderId', 'Value' => $order_number));

$url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Orders';

$couponDetails =  callAPI("GET", $admin_token['access_token'], $url, false);

$discount = $couponDetails['Records'];

echo json_encode(['result' => $discount]);

?>
