<?php
$files = [
    'admin/index.php',
    'admin/contacts.php',
    'admin/subscribers.php',
    'admin/projects.php',
    'admin/programs.php',
    'admin/testimonials.php',
    'admin/medias.php',
    'admin/videos.php'
];

$insert = <<<HTML
            <a href="volunteers.php" class="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-[#2c4029] hover:text-white transition-colors">
                <span>🤝</span> Volunteers
            </a>

HTML;

foreach ($files as $file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        if (strpos($content, 'volunteers.php"') === false) {
            $content = str_replace('<a href="projects.php"', $insert . '            <a href="projects.php"', $content);
            file_put_contents($file, $content);
            echo "Updated $file\n";
        } else {
            echo "Skipped $file (already has volunteers)\n";
        }
    } else {
        echo "File $file not found\n";
    }
}
?>
