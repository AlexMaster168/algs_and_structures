<?php
declare(strict_types=1);

$portFiles = []; $portClasses = [];
foreach (['shared', 'data-structures', 'algorithms', 'patterns'] as $portDirectory) {
    $portIterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(__DIR__ . '/' . $portDirectory, FilesystemIterator::SKIP_DOTS));
    foreach ($portIterator as $portFile) {
        if ($portFile->getExtension() !== 'php') continue;
        $portPath = $portFile->getPathname(); $portFiles[] = $portPath; $portSource = file_get_contents($portPath);
        preg_match('/namespace\s+([^;]+);/', $portSource, $portNamespace);
        preg_match_all('/\b(?:class|interface|trait|enum)\s+([A-Za-z_]\w*)/', $portSource, $portNames);
        foreach ($portNames[1] as $portName) $portClasses[$portNamespace[1] . '\\' . $portName] = $portPath;
    }
}
spl_autoload_register(static function(string $class) use ($portClasses): void { if (isset($portClasses[$class])) require_once $portClasses[$class]; });
foreach ($portFiles as $portPath) require_once $portPath;
unset($portFiles, $portClasses, $portDirectory, $portIterator, $portFile, $portPath, $portSource, $portNamespace, $portNames, $portName);
