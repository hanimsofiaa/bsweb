<?php

require_once "conn.php";
$qry = "SELECT * FROM diets";

$raw =mysqli_query($conn,$qry);

while($res=mysqli_fetch_array($raw)){
	$data[]=$res;
}
print(json_encode($data));



?>