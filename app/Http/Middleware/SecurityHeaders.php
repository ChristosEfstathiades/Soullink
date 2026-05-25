<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        // Generate the nonce before $next() so Blade can read it while rendering.
        $nonce = base64_encode(random_bytes(16));
        $request->attributes->set('csp_nonce', $nonce);

        $response = $next($request);

        // Safe in all environments
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        if ($request->secure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        // CSP is skipped in local dev — Vite HMR uses inline scripts and WebSockets
        // that would be blocked by a strict policy.
        if (! app()->isLocal()) {
            $response->headers->set(
                'Content-Security-Policy',
                "default-src 'self'; " .
                "script-src 'self' 'nonce-{$nonce}'; " .
                "style-src 'self' 'unsafe-inline' https://fonts.bunny.net; " .
                "img-src 'self' data: blob:; " .
                "connect-src 'self' https://pokeapi.co; " .
                "font-src 'self' data: https://fonts.bunny.net; " .
                "object-src 'none'; " .
                "base-uri 'self';"
            );
        }

        return $response;
    }
}
