<?php
include 'callAPI.php';
include 'admin_token.php';

$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$order_guid = $content['order_guid'];

//2. Query the total, apply the discount coupon
$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$userToken = $_COOKIE["webapitoken"];
$customFieldPrefix = getCustomFieldPrefix();

$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $userToken, $url, false);
$userId = $result['ID'];

$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $admin_token['access_token'], $url, false);
$admin_id = $result['ID'];

//get the current total
$url = $baseUrl . '/api/v2/users/'. $userId . '/orders/' . $order_guid;
$paymentGateways = callAPI("GET", $admin_token['access_token'], $url, false);

$subtotal = $paymentGateways['Total'];
echo json_encode(['result' => $subtotal]);
?>