<?php
// backend/api/medias.php
require_once 'config.php';

header('Content-Type: application/json');

try {
    // Fetch all active medias, ordered by newest first
    $stmt = $pdo->query("SELECT id, title, image_url FROM photo_gallery ORDER BY created_at DESC");
    $medias = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'data' => $medias
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch photos: ' . $e->getMessage()
    ]);
}
?>