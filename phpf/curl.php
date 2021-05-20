<?php
$url = 'https://api.github.com/zen';
$head = [
    'User-Agent: Awesome-Octocat-App'
];

$curl = curl_init();

curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPHEADER, $head);

$out = curl_exec($curl);
curl_close($curl);

echo $out;