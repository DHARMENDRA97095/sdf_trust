<?php
// backend/api/get_testimonials.php
require_once __DIR__ . '/config.php';

try {
    $stmt = $pdo->query("SELECT name, title, message, image_url as image FROM testimonials ORDER BY created_at DESC");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>