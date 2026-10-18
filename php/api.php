<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');

if (is_file(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function respond(mixed $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function body(): array
{
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw ?: '{}', true);
    return is_array($decoded) ? $decoded : [];
}

function moto(array $row): array
{
    $row['images'] = json_decode((string) $row['images'], true) ?: [];
    $row['featured'] = (bool) $row['featured'];
    $row['price'] = (float) $row['price'];
    $row['year'] = (int) $row['year'];
    $row['mileage'] = (int) $row['mileage'];
    $row['views'] = (int) $row['views'];
    return $row;
}

function database(): PDO
{
    static $pdo;
    if ($pdo instanceof PDO) return $pdo;

    $databaseUrl = getenv('DATABASE_URL') ?: '';
    $parsedUrl = $databaseUrl !== '' ? parse_url($databaseUrl) : false;
    $host = getenv('PHP_DB_HOST') ?: ($parsedUrl['host'] ?? '');
    $name = getenv('PHP_DB_NAME') ?: ltrim((string) ($parsedUrl['path'] ?? ''), '/');
    $user = getenv('PHP_DB_USER') ?: (isset($parsedUrl['user']) ? urldecode($parsedUrl['user']) : '');
    $password = getenv('PHP_DB_PASSWORD') ?: (isset($parsedUrl['pass']) ? urldecode($parsedUrl['pass']) : '');

    if ($host === '' || $name === '' || $user === '') {
        throw new RuntimeException('Configuration MySQL manquante. Definissez PHP_DB_HOST, PHP_DB_NAME, PHP_DB_USER et PHP_DB_PASSWORD dans php/config.php.');
    }

    $pdo = new PDO("mysql:host={$host};dbname={$name};charset=utf8mb4", $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    return $pdo;
}

try {
    $resource = $_GET['resource'] ?? '';
    $method = $_SERVER['REQUEST_METHOD'];
    $pdo = database();

    if ($resource === 'motos') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        if ($method === 'GET') {
            if ($id > 0) {
                $statement = $pdo->prepare('SELECT * FROM `Moto` WHERE id = ?');
                $statement->execute([$id]);
                $row = $statement->fetch();
                respond($row ? moto($row) : ['error' => 'Moto introuvable'], $row ? 200 : 404);
            }
            $rows = $pdo->query('SELECT * FROM `Moto` ORDER BY createdAt DESC')->fetchAll();
            respond(array_map('moto', $rows));
        }
        if ($method === 'POST') {
            $data = body();
            $columns = ['brand', 'model', 'category', 'year', 'price', 'currency', 'condition', 'status', 'engine', 'power', 'mileage', 'transmission', 'fuel', 'color', 'description', 'images', 'featured'];
            $values = [
                $data['brand'] ?? '', $data['model'] ?? '', $data['category'] ?? '', (int) ($data['year'] ?? 0),
                (float) ($data['price'] ?? 0), $data['currency'] ?? 'DA', $data['condition'] ?? 'new', $data['status'] ?? 'available',
                $data['engine'] ?? null, $data['power'] ?? null, (int) ($data['mileage'] ?? 0), $data['transmission'] ?? null,
                $data['fuel'] ?? null, $data['color'] ?? null, $data['description'] ?? null,
                json_encode($data['images'] ?? [], JSON_UNESCAPED_UNICODE), !empty($data['featured']) ? 1 : 0,
            ];
            $placeholders = implode(',', array_fill(0, count($columns), '?'));
            $statement = $pdo->prepare('INSERT INTO `Moto` (`' . implode('`,`', $columns) . '`) VALUES (' . $placeholders . ')');
            $statement->execute($values);
            $newId = (int) $pdo->lastInsertId();
            $statement = $pdo->prepare('SELECT * FROM `Moto` WHERE id = ?');
            $statement->execute([$newId]);
            respond(moto($statement->fetch()), 201);
        }
        if ($id <= 0) respond(['error' => 'Identifiant invalide'], 400);
        if ($method === 'PATCH') {
            $data = body();
            $allowed = ['brand', 'model', 'category', 'year', 'price', 'status', 'featured', 'description'];
            $updates = [];
            $values = [];
            foreach ($allowed as $field) {
                if (array_key_exists($field, $data)) {
                    $updates[] = "`{$field}` = ?";
                    $values[] = in_array($field, ['year', 'price'], true) ? (float) $data[$field] : ($field === 'featured' ? (int) (bool) $data[$field] : $data[$field]);
                }
            }
            if (!$updates) respond(['error' => 'Aucune modification'], 400);
            $values[] = $id;
            $statement = $pdo->prepare('UPDATE `Moto` SET ' . implode(', ', $updates) . ' WHERE id = ?');
            $statement->execute($values);
            $statement = $pdo->prepare('SELECT * FROM `Moto` WHERE id = ?');
            $statement->execute([$id]);
            $row = $statement->fetch();
            respond($row ? moto($row) : ['error' => 'Moto introuvable'], $row ? 200 : 404);
        }
        if ($method === 'DELETE') {
            $statement = $pdo->prepare('DELETE FROM `Moto` WHERE id = ?');
            $statement->execute([$id]);
            respond(null, 204);
        }
    }

    if ($resource === 'settings') {
        if ($method === 'GET') {
            $row = $pdo->query('SELECT * FROM `Settings` WHERE id = 1')->fetch();
            if ($row) {
                $row['showPrices'] = (bool) $row['showPrices'];
                $row['showSoldMotos'] = (bool) $row['showSoldMotos'];
            }
            respond($row ?: null);
        }
        if ($method === 'PATCH') {
            $fields = ['name', 'logo', 'description', 'phone', 'whatsapp', 'email', 'address', 'wilaya', 'instagram', 'facebook', 'openingHours', 'accentColor', 'currency', 'showPrices', 'showSoldMotos', 'whatsappBtnText'];
            $data = body();
            $updates = [];
            $values = [];
            foreach ($fields as $field) {
                if (array_key_exists($field, $data)) {
                    $updates[] = "`{$field}` = ?";
                    $values[] = in_array($field, ['showPrices', 'showSoldMotos'], true) ? (int) (bool) $data[$field] : $data[$field];
                }
            }
            if ($pdo->query('SELECT COUNT(*) FROM `Settings` WHERE id = 1')->fetchColumn() === 0) $pdo->exec('INSERT INTO `Settings` (id) VALUES (1)');
            if ($updates) {
                $values[] = 1;
                $pdo->prepare('UPDATE `Settings` SET ' . implode(', ', $updates) . ' WHERE id = ?')->execute($values);
            }
            respond($pdo->query('SELECT * FROM `Settings` WHERE id = 1')->fetch());
        }
    }

    if ($resource === 'auth' && $method === 'POST') {
        $data = body();
        $statement = $pdo->prepare('SELECT * FROM `User` WHERE email = ?');
        $statement->execute([$data['email'] ?? '']);
        $user = $statement->fetch();
        if (!$user && ($data['email'] ?? '') === (getenv('ADMIN_EMAIL') ?: '') && ($data['password'] ?? '') === (getenv('ADMIN_PASSWORD') ?: '') && (int) $pdo->query('SELECT COUNT(*) FROM `User`')->fetchColumn() === 0) {
            $statement = $pdo->prepare('INSERT INTO `User` (email, password, name, role) VALUES (?, ?, ?, ?)');
            $statement->execute([$data['email'], password_hash($data['password'], PASSWORD_DEFAULT), 'Admin', 'admin']);
            $user = ['id' => $pdo->lastInsertId(), 'email' => $data['email'], 'name' => 'Admin', 'role' => 'admin'];
        } elseif (!$user || !password_verify((string) ($data['password'] ?? ''), $user['password'])) {
            respond(['error' => 'Identifiants invalides'], 401);
        }
        respond(['id' => (string) $user['id'], 'email' => $user['email'], 'name' => $user['name'], 'role' => $user['role']]);
    }

    respond(['error' => 'Route inconnue'], 404);
} catch (Throwable $error) {
    error_log($error->getMessage());
    respond(['error' => 'Erreur serveur'], 500);
}
