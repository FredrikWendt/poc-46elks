<?

session_start();
  $urlPart = $_GET['urlPart'];

  $context = stream_context_create(array(
    'http' => array(
      'method' => 'GET',
      'header'  => "Authorization: Basic ".
                   base64_encode($_SESSION['username'].':'.$_SESSION['password']). "\r\n".
                   "Content-type: application/x-www-form-urlencoded\r\n",
      'content' => http_build_query($_POST),
      'timeout' => 10
  )));

  echo file_get_contents(
    'https://api.46elks.com/a1/'. $urlPart, false, $context );
    
?>