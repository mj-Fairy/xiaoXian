<?php
	header('Content-type:text/html;Charset=UTF-8');
	$dsn = "mysql:host=localhost;dbname=mugujie";
	$username="root";
	$password ="021381ec0e";
	$pdo = new PDO($dsn,$username,$password);