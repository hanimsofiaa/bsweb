<?php

require_once "conn.php";

$name = $_POST['name'];

$query = "SELECT * FROM diets WHERE name = '$name'";
$check = mysqli_query($conn,$query);
$result = array();

if(mysqli_num_rows($check) == 1){																																																									
	$sql = "DELETE FROM diets WHERE name = '$name'";
		
	if(mysqli_query($conn, $sql)){
		$result['state'] = "delete";
		echo json_encode($result);
	}else{
		echo 'Food Already Deleted';
	}
	
}else{
	echo "Invalid";
}
	
?>