<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$startDate = $content['startdate'];
$enddate = $content['enddate'];

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();
// Query to get marketplace id
$url = $baseUrl . '/api/v2/marketplaces/';
$marketplaceInfo = callAPI("GET", null, $url, false);
$url = $baseUrl . '/api/developer-packages/custom-fields?packageId=' . getPackageID();
$packageCustomFields = callAPI("GET", null, $url, false);

//get admin ID
$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $admin_token['access_token'], $url, false);
$admin_id = $result['ID'];
//get merchant ID
$userToken = $_COOKIE["webapitoken"];
$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $userToken, $url, false);
$userId = $result['ID'];

$temp_id ='875bf3b8-95c7-4df0-ab25-383b879e6165'; //bpdiana0613.test
// $temp_id = '5e812d60-73ef-4411-a016-867f496fbc0b';
//get all invoice info
$url =  $baseUrl . '/api/v2/merchants/' . $userId .'/transactions?pageSize=1000&startDate='. $startDate .'&endDate=' .$enddate;
// print_r($url);
$result = callAPI("GET", $admin_token['access_token'], $url, false);

$dirInvoice =  realpath("downloads/invoice.csv");
$dirItems =  realpath("downloads/item.csv");

$fh = fopen($dirInvoice, 'w');
$fh_items = fopen($dirItems, 'w');

// save the invoice headers
fputcsv($fh, array('Invoice ID', 'Timestamp', 'Buyer Display Name', 'Buyer Email', 'Payment Status', 'Order Status', 'Shipping Method', 'Pick-Up', 'Order Sub-total', 'Shipping Cost', 'Discounts', 'Admin Fees', 'Grand Total' ));

//items headers
fputcsv($fh_items, array('Invoice ID', 'Parent Category', 'Sub-Category Name', 'Item Name', 'Variant 1 Option', 'Variant 2 Option', 'Variant 3 Option' ,'SKU', 'Item Price', 'Qty'));

foreach($result['Records'] as $orders) {
    $orderId = $orders['Orders'][0]['ID'];
    $invoiceId = $orders['InvoiceNo'];
    $timestamp= date('d/m/Y H:i', $orders['Orders'][0]['CreatedDateTime']);
    $merchantEmail =  $orders['Orders'][0]['MerchantDetail']['Email'];
    $consumerEmail =  $orders['Orders'][0]['ConsumerDetail']['Email'];
    $buyerDisplayName = $orders['Orders'][0]['ConsumerDetail']['DisplayName'];   
    $paymentStatus = $orders['Orders'][0]['PaymentStatus'];  
    $orderStatus = $orders['Orders'][0]['FulfilmentStatus']; 
    $delInfo = $orders['Orders'][0]['CustomFields'][0]['Values'][0];
    $delInfo = json_decode($delInfo,true);
    $delName = $delInfo['DeliveryName'];
    $delCost = $delInfo['DeliveryCost'];  
    $subtotal = $orders['Total'];
    $discounts = $orders['Orders'][0]['DiscountAmount'] != null ?  $orders['Orders'][0]['DiscountAmount'] : 0;
    $adminFee = $orders['Fee'];
    $grandTotal = $orders['Orders'][0]['GrandTotal'];

     //pick up or delivery
     $cartItemType = $orders['Orders'][0]['CartItemDetails'][0]['CartItemType'];

     
     $delivery=  $cartItemType == 'delivery' ? $delName : '';
     $pickUp = $cartItemType == 'pickup' ? $delName : '';
     
    $invoiceRow =  array($invoiceId, $timestamp, $buyerDisplayName, $consumerEmail, $paymentStatus, $orderStatus, $delivery, $pickUp,  $subtotal, $delCost, $discounts, $adminFee, $grandTotal);
    fputcsv($fh,  $invoiceRow);

    foreach($orders['Orders'][0]['CartItemDetails'] as $itemDetails){
        $itemId = $itemDetails['ItemDetail']['ID'];
        $itemName = $itemDetails['ItemDetail']['Name'];

        $url = $baseUrl . '/api/v2/items/' . $itemId ; 
        $items = callAPI("GET", $admin_token['access_token'], $url, false);  
        //$itemCategory = $items['Categories'][0]['Name'];
        $categoryList = [];
        foreach($items['Categories'] as $category) {
            $categoryList[] = $category['Name'];
        }
        $item_categories =  implode("|",$categoryList);
        $subCategoryName = $itemCategory != null ? $itemCategory : null;

        $parentCategoryName= '';
        $variantList = [];
        foreach($itemDetails['ItemDetail']['Variants'] as $variant) {
            $variantList[] = $variant['Name'];
        }
       
        $variantOption1 = count($variantList) ? $variantList[0]: null;    
        $variantOption2 = count($variantList) >= 2 ? $variantList[1] : null;  
        $variantOption3 = count($variantList) >= 3 ? $variantList[2] : null; 

        $SKU = $itemDetails['ItemDetail']['SKU'];
        $itemPrice = $itemDetails['ItemDetail']['Price'];
        $qty = $itemDetails['Quantity'];

         //populate items csv
         $itemsRows = array($invoiceId,  $parentCategoryName,  $item_categories, $itemName, $variantOption1, $variantOption2, $variantOption3,  $SKU,  $itemPrice, $qty);
         fputcsv($fh_items,  $itemsRows);

    }
   
}

// $rename = $timestamp . '.csv';
fclose($fh);
// rename('item.csv', $rename);
fclose($fh_items);
// rename('invoice.csv', $rename);

// Timestamp ok
// Buyer display name	ok 
// Buyer Email	ok
// Payment Status ok
// Order Status	 ok 
// Shipping Method	ok
// Order Sub-total	ok
// Shipping Costs	ok
// Discounts	ok
// Admin Fees	ok
// Grand Total	ok

?>

