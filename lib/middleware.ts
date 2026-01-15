import { verifyToken } from "./auth"
import type { DecodedToken } from "./types"

export function getAuthFromRequest(request: any): DecodedToken | null {
  const token = request.cookies?.get?.("auth_token")?.value

  if (!token) {
    return null
  }

  const decoded = verifyToken(token)
  return decoded as DecodedToken | null
}

export function requireAuth(handler: Function) {
  return async (request: any, ...args: any[]) => {
    const auth = getAuthFromRequest(request)

    if (!auth) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    request.auth = auth
    return handler(request, ...args)
  }
}

export function requireRole(role: string | string[]) {
  return (handler: Function) => {
    return async (request: any, ...args: any[]) => {
      const auth = getAuthFromRequest(request)

      if (!auth) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        })
      }

      const requiredRoles = Array.isArray(role) ? role : [role]

      if (!requiredRoles.includes(auth.role)) {
        return new Response(JSON.stringify({ error: "Forbidden - insufficient permissions" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        })
      }

      request.auth = auth
      return handler(request, ...args)
    }
  }
}
