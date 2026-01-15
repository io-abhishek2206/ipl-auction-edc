export interface AuthUser {
  id: string
  username: string
  role: "admin" | "team"
  teamId?: string
}

export interface DecodedToken extends AuthUser {
  iat: number
  exp: number
}
