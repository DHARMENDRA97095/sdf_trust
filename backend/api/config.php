<?php
// backend/api/config.php

// CORS headers: allow known frontend origins, keep localhost for development.
$allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://sdftrust.vercel.app',
    'https://hrntechsolutions.com',
    'https://www.hrntechsolutions.com',
];

$frontendUrl = getenv('FRONTEND_URL');
if ($frontendUrl) {
    $allowedOrigins[] = rtrim($frontendUrl, '/');
}

$requestOrigin = isset($_SERVER['HTTP_ORIGIN']) ? rtrim($_SERVER['HTTP_ORIGIN'], '/') : '';
if ($requestOrigin !== '' && in_array($requestOrigin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $requestOrigin");
}

header('Vary: Origin');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Database — production cPanel (hrntechsolutions.com).
// Do NOT use getenv() here: many hosts inject DB_USER=root, which breaks MySQL login.
// For local XAMPP, add backend/api/config.local.php (see config.local.php.example).
if (file_exists(__DIR__ . '/config.local.php')) {
    require_once __DIR__ . '/config.local.php';
}

if (!defined('DB_HOST')) {
    define('DB_HOST', 'localhost');
}
if (!defined('DB_USER')) {
    define('DB_USER', 'hrntechs_DHARMENDRA_97095');
}
if (!defined('DB_PASS')) {
    define('DB_PASS', 'Dkp@97095');
}
if (!defined('DB_NAME')) {
    define('DB_NAME', 'hrntechs_sdf_database');
}

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    // --- TEMPORARY: remove this whole block after testing ---
    // Shows output when: (1) you open config.php directly in the browser, or (2) any API URL has ?db_test=1
    $scriptPath = @realpath($_SERVER['SCRIPT_FILENAME'] ?? '');
    $configPath = realpath(__FILE__);
    $openedConfigDirectly = $scriptPath && $configPath && $scriptPath === $configPath;
    $dbTestQuery = isset($_GET['db_test']) && (string) $_GET['db_test'] === '1';
    if ($openedConfigDirectly || $dbTestQuery) {
        echo json_encode(
            [
                'db_test' => 'ok',
                'message' => 'Database connection successful',
                'host' => DB_HOST,
                'database' => DB_NAME,
                'user' => DB_USER,
            ],
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES,
        );
        exit();
    }
    // --- end TEMPORARY ---
} catch (PDOException $e) {
    // Never expose raw database errors to API clients.
    error_log('Database connection failed: ' . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed.'
    ]);
    exit();
}
?>
