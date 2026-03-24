<?php
require_once __DIR__ . "/config.php";

$data = json_decode(file_get_contents("php://input"), true);
$transaction_id = trim($data['transaction_id'] ?? '');

if ($transaction_id === '') {
    echo json_encode([
        "success" => false,
        "message" => "Transaction ID is required."
    ]);
    exit();
}

try {
    $stmt = $pdo->prepare("
        UPDATE donations
        SET payment_status = 'success'
        WHERE transaction_id = :transaction_id
          AND payment_status = 'pending'
    ");

    $stmt->execute([
        ':transaction_id' => $transaction_id
    ]);

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Payment marked as success."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Transaction not found or already updated."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}