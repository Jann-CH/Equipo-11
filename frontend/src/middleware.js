import { NextResponse } from "next/server";

/**
 * ==================================================
 * Next.js Middleware — Protección de rutas
 * ==================================================
 **/

// Rutas que requieren autenticación
const PROTECTED_ROUTES = [
    "/dashboard",
    "/clientes",
    "/items",
    "/presupuestos",
];

// Rutas de autenticación (redirigir si ya está logueado)
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Leer el token desde la Cookie HttpOnly
    // (imposible con localStorage, sí posible con cookies)
    const token = request.cookies.get("auth_token")?.value;

    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    const isAuthRoute = AUTH_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    // Caso 1: Usuario NO autenticado intenta acceder a ruta privada
    if (isProtectedRoute && !token) {
        const loginUrl = new URL("/login", request.url);
        // Guardar la URL original para redirigir después del login
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Caso 2: Usuario YA autenticado intenta ir al login/register
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

/**
 * Configuración del matcher: el middleware solo se ejecuta
 * en rutas relevantes. Se excluyen explícitamente:
 * - _next/static: assets estáticos de Next.js
 * - _next/image: optimización de imágenes
 * - favicon.ico: ícono del sitio
 * - public/: archivos públicos
 */
export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
    ],
};
