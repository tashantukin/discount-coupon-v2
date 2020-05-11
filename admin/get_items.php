<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$keyword = $content['keyword'];
$itemguid = $content['itemguid'];

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$userToken = $_COOKIE["webapitoken"];
$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $userToken, $url, false);
$userId = $result['ID'];

//get the item details
if ($keyword) {
$url =  $baseUrl . '/api/v2/items?keywords=' . $keyword;
$itemDetails = callAPI("GET", $admin_token['access_token'], $url, false);
echo json_encode(['result' => $itemDetails['Records']]);
}
else {
    $url =  $baseUrl . '/api/v2/items/' . $itemguid;
    $itemDetails = callAPI("GET", $admin_token['access_token'], $url, false);  
    //echo json_encode(['result' => $url]);
echo json_encode(['result' => $itemDetails]);
}
   
?>
