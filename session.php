<?php
// Set your 46elks.com Username and Password here
session_start();
$_SESSION['username'] = $_REQUEST['username'];
$_SESSION['password'] = $_REQUEST['password'];
?>
{success:true}