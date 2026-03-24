<?php
// backend/api/volunteer.php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    // Fallback to $_POST if not JSON
    $data = (object)$_POST;
}

$name = trim($data->name ?? '');
$email = trim($data->email ?? '');
$phone = trim($data->phone ?? '');
$age = isset($data->age) ? (int)$data->age : 0;
$address = trim($data->address ?? '');
$interest = trim($data->interest ?? '');
$message = trim($data->message ?? '');

// Basic validation
if (empty($name) || empty($email) || empty($phone) || empty($address) || empty($interest)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Please fill in all required fields.']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO volunteers (name, email, phone, age, address, interest, message) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $phone, $age, $address, $interest, $message]);

    http_response_code(201);
    echo json_encode(['status' => 'success', 'message' => 'Volunteer application submitted successfully!']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
