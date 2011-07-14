<?php
setlocale(LC_CTYPE, "en_US.UTF-8");

$f = $_REQUEST['from'];
$t = $_REQUEST['to'];
$m = escapeshellcmd($_REQUEST['message']);

exec("/usr/bin/python /home/ceda/fredrik/bin/xsend.py fredrik@wendt.se \"From: $f\nTo: $t\n$m\"", $out, $res);
?>
