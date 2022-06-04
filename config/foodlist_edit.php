<?php

require_once "conn.php";

$name = $_POST['name'];
$type = $_POST['type'];
$calories = $_POST['calories'];

$sql = "SELECT * FROM diets WHERE name = '$name'";
$check = mysqli_query($conn,$sql);
if(mysqli_num_rows($check) > 0){
	
	$result = "UPDATE diets SET name = '$name', type = '$type', calories = '$calories' WHERE name = '$name'";
	
	if(mysqli_query($conn,$result)){
		echo "Foodlist Updated Successfully";
	}else{
		echo "Error Updating Food";
	}
}else{
	echo "Unauthorized User";
}


?>