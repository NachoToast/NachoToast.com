<?php
function verify_captcha($token) {

    $threshold = 0.5; // Score must be > threshold to pass captcha.
    // Default is 0.5, although the majority of users will get 0.9
    $sites = ["localhost", "nachotoast.com", "ntgc.ddns.net"]; // Site names string, e.g. sub.domain.com:8080

    include_once 'secret.php'; // reCAPTCHA secret
    $url = "https://www.google.com/recaptcha/api/siteverify";
    $data = array("secret" => $secret, "response" => $token);
    $options = array(
        "http" => array(
            "header" => "Content-type: application/x-www-form-urlencoded\r\n",
            "method" => "POST",
            "content" => http_build_query($data)
        )
    );
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    $response_keys = json_decode($response, true);

    // error checks
    if (isset($response_keys["error-codes"])) {
        if (in_array("timeout-or-duplicate", $response_keys["error-codes"])) return "expired";
        return $response_keys["error-codes"];
    }

    // success check (theoretically not needed due to above error checks)
    if ($response_keys["success"] !== true) return "invalid-token";

    // score check
    if ($response_keys["score"] < $threshold) return "failed";
    
    // hostname check
    if (!in_array($response_keys["hostname"], $sites)) return "wrong-site";

    // action check
    if ($response_keys["action"] !== "submit") return "wrong-action";

    return true;
}