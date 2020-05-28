<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$invoice_number = $content['invoice_number'];
$tracking_number =  $content['trackingNo'];
$tracking_url = $content['trackingURL'];

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$userToken = $_COOKIE["webapitoken"];
$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $userToken, $url, false);
$userId = $result['ID'];

$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $admin_token['access_token'], $url, false);
error_log('admin ' . json_encode($result));
$admin_id = $result['ID'];
error_log('admin id ' . $admin_id);

//get the order id from invoice number
$url =  $baseUrl . '/api/v2/merchants/' . $userId  .'/transactions/'. $invoice_number;
$result = callAPI("GET", $admin_token['access_token'], $url, false);
//save the fulfilment status by obtained order id
 $orderId = $result['Orders'][0]['ID'];
 $invoiceId = $result['InvoiceNo'];

//for MP LOGO
// Query to get marketplace id
$url = $baseUrl . '/api/v2/marketplaces/';
$marketplaceInfo = callAPI("GET", null, $url, false);

$mplogo =   $marketplaceInfo['LogoUrl'];
$mpname =   $marketplaceInfo['Name'];
$mplink =   substr($mplogo,0, strpos($mplogo,"/images"));
$subject = $invoiceId ." Tracking Information";

//if ($status == 'Order Confirmation' || $status == 'Pending Stock') {
    //send EDM
      $merchantEmail =  $result['Orders'][0]['MerchantDetail']['Email'];
      $consumerEmail =  $result['Orders'][0]['ConsumerDetail']['Email'];
      $consumerLastName = $result['Orders'][0]['ConsumerDetail']['LastName'];
      $consumerFirstName = $result['Orders'][0]['ConsumerDetail']['FirstName'];
      //delivery address
      $consumeraddressName = $result['Orders'][0]['DeliveryToAddress']['Name'];  
      $consumeraddressLine1 = $result['Orders'][0]['DeliveryToAddress']['Line1'];  
      $consumeraddressLine2 = !empty($result['Orders'][0]['DeliveryToAddress']['Line2']) ? $result['Orders'][0]['DeliveryToAddress']['Line2'] : '';  
      $consumeraddressState = $result['Orders'][0]['DeliveryToAddress']['State'];  
      $consumeraddressCity= $result['Orders'][0]['DeliveryToAddress']['City']; 
      $consumeraddressCountry = $result['Orders'][0]['DeliveryToAddress']['Country'];  
      $consumeraddressPostCode = $result['Orders'][0]['DeliveryToAddress']['PostCode'];  

      $date = date('d/m/Y H:i', $result['Orders'][0]['CreatedDateTime']);
     
      $data = [
          'From' => $merchantEmail,
          'To' =>  $consumerEmail, //'nmfnavarro@gmail.com'
          'Subject' => $subject,
          
        'Body' => "<html><body><div style=\"max-width:700px; width:100%; margin:0 auto; border:1px solid #ddd; color:#999; font-size:16px; font-family:sans-serif;  line-height:25px;\">
          <div style=\"padding:15px;\">
            <div style=\"text-align:center; margin-bottom:50px;\"> <img src=\" $mplogo\" style=\"max-width:200px;\" /> </div>
            <div>
              <p style=\"color:#000; font-weight:bold; margin-bottom:50px;\">Hi $consumerFirstName,</p>
              <p>The item(s) below in your order <span style=\"color:#000;\">$invoiceId </span>has been dispatched to our delivery partner. To track your order delivery you can find the information below:</p>
              <p>TRACKING ID: <span style=\"color:#000;\"> $tracking_number  </span></p>
              <p>TRACKING PAGE:  <a href=\"$tracking_url\" target=\"_blank\"style=\"text-decoration: none;\"> $tracking_url </a></p>
            </div>
            <div style=\" border-top:1px solid #000; padding-top: 10px; padding-bottom: 10px; margin-top:20px;\">
              <table border=\"0\" style=\"width:100%; color:#B3B3B3;\">
                <tr>
                  <td style=\"font-weight:bold;\">INVOICE ID <span style=\"color:#000;\">$invoiceId</span></td>
                  <td style=\"text-align:right;\"> $date</td>
                </tr>
              </table>
            </div>
            <div style=\"margin-top:10px;\">
              <table  style=\"width:100%; border-collapse: collapse;\">
                <thead style=\"background: #f9f9f9;\">
                  <tr style=\"color: #000; text-align: left; font-size: 14px; font-weight:400;\">
                    <th style=\"padding:10px;\">Item </th>
                    <th style=\"padding:10px;\">Qty </th>
                    <th style=\"text-align: right; padding: 10px\">Price</th>
                  </tr>
                </thead>
                <tbody style=\"color: #999\">"];
                ?>
             

              <?php
              ob_start(); 
              foreach ($result['Orders'][0]['CartItemDetails'] as $orders) {
                  $price = $orders['ItemDetail']['Price'];
                  $qty =  $orders['Quantity'];
                  $currencycode = $orders['ItemDetail']['CurrencyCode'];
                  $total = number_format($price * $qty);
                ?>
                
                <tr>  
                 <td style="padding: 10px;"> <?php echo $orders['ItemDetail']['Name'];  ?> </td>
                <td style="padding: 10px;"><?php echo $qty; ?></td>
                <td style='text-align: right; padding: 10px;'><?php echo  $currencycode . ' ' . $total ?></td>
                </tr>
               
                <?php 
                
              } 
                
              ?>
            
              </tbody>
              </table>
            </div>

            <div style="margin-top:20px; margin-bottom:10px">
              <div style="color:#000; font-weight:bold;">Delivery Address :</div>
              <div><?php echo  $consumeraddressName ?></div>
              <div><?php echo  $consumeraddressLine1 . ' ' . $consumeraddressLine2  ?></div>
              <div><?php echo  $consumeraddressState?></div>
              <div><?php echo  $consumeraddressCity?></div>
              <div><?php echo  $consumeraddressCountry ?></div>
              <div><?php echo  $consumeraddressPostCode ?></div></td>
            </div>


            <div style="margin-top:50px; margin-bottom:50px">Login to your Suntec+ App to view your order </div>
            <div style="margin-bottom:50px;">
              <p>Regards,<br />
               <?php echo $mpname ?></p>
            </div>
          </div>
        </div>
        </body></html>
       <?php
       $my_var = ob_get_contents();
       $data['Body'] .= $my_var;
       ob_end_flush();
       join(" ",$data['Body']); 
      $url =  $baseUrl . '/api/v2/admins/' . $admin_id .'/emails';
      $sendEDM = callAPI("POST", $admin_token['access_token'], $url, $data);
      echo json_encode(['result' => $sendEDM]);        

     ?>

