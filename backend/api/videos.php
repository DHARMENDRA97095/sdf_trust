<?php
// backend/api/videos.php
require_once 'config.php';

header('Content-Type: application/json');

try {
    // Fetch all active videos, ordered by newest first
    $stmt = $pdo->query("SELECT id, title, video_url,image_url, duration, views FROM video_gallery ORDER BY created_at DESC");
    $videos = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'data' => $videos
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch videos: ' . $e->getMessage()
    ]);
}
?>