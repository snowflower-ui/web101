<?php
require('conn.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] == "register") {
	$pdo->beginTransaction();
	try {
		$sql = 'INSERT INTO user(idnumber, firstname, lastname, gender, bday, program, yearlevel) VALUES(:idnumber, :firstname, :lastname, :gender, :bday, :program, :yearlevel)';
		$statement = $pdo->prepare($sql);
		$statement->execute([
			':idnumber' => $_POST['userdata']['idnumber'],
			':firstname' => $_POST['userdata']['firstname'],
			':lastname' => $_POST['userdata']['lastname'],
			':gender' => (int) $_POST['userdata']['gender'],
			':bday' => $_POST['userdata']['bday'],
			':program' => $_POST['userdata']['program'],
			':yearlevel' => (int) $_POST['userdata']['yearlevel'],
		]);

		echo $pdo->lastInsertId();
		$pdo->commit();
	} catch (Exception $e) {
		$pdo->rollback();
	}
} else if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['action'] == "getusers") {
	$sql = "SELECT * FROM user";
	$statement = $pdo->query($sql);
	$users = $statement->fetchAll(PDO::FETCH_ASSOC);
	echo json_encode($users);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] == "deleteuser") {
	$id = $_POST['userId'];
	$sql = "DELETE FROM user WHERE id=$id";
	$statement = $pdo->prepare($sql);

	if ($statement->execute()) {
		echo 'post deleted successfully!';
	}
} else if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] == "update_user") {
	$id = $_POST['userdata']['id'];

	$pdo->beginTransaction();
	try {
		$sql = "UPDATE user 
				SET idnumber=:idnumber,
			    	firstname=:firstname,
			    	lastname=:lastname,
			    	gender=:gender,
			    	bday=:bday,
			    	program=:program,
			    	yearlevel=:yearlevel
				WHERE id=:id";
		$statement = $pdo->prepare($sql);

		$statement->bindParam(':id', $id, PDO::PARAM_INT);
		$statement->bindParam(':idnumber', $_POST['userdata']['idnumber']);
		$statement->bindParam(':firstname', $_POST['userdata']['firstname']);
		$statement->bindParam(':lastname', $_POST['userdata']['lastname']);	
		$statement->bindParam(':gender', $_POST['userdata']['gender'], PDO::PARAM_INT);
		$statement->bindParam(':bday', $_POST['userdata']['bday']);
		$statement->bindParam(':program', $_POST['userdata']['program']);
		$statement->bindParam(':yearlevel', $_POST['userdata']['yearlevel'], PDO::PARAM_INT);

		if ($statement->execute()) {
			echo 'post updated successfully!'; 
		}

		$pdo->commit();
	} catch (Exception $e) {
		$pdo->rollback();
	}
}