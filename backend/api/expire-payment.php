<?php
require_once __DIR__ . "/config.php";

$data = json_decode(file_get_contents("php://input"), true);
$transaction_id = trim($data['transaction_id'] ?? '');

if (empty($transaction_id)) {
    echo json_encode([
        "success" => false,
        "message" => "Transaction ID is required."
    ]);
    exit();
}

try {
    $stmt = $pdo->prepare("
        UPDATE donations
        SET payment_status = 'expired'
        WHERE transaction_id = :transaction_id
        AND payment_status = 'pending'
    ");
    $stmt->execute([":transaction_id" => $transaction_id]);

    echo json_encode([
        "success" => true,
        "message" => "Payment expired."
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>