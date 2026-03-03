// domains/auth/auth.repository.ts
import type { BackendLoginResponse, BackendUser, LoginInput } from './auth.types';

const BACKEND_URL = (process.env.BACKEND_API_BASE_URL ?? 'http://127.0.0.1:8000').replace(/\/+$/, '');
const API = `${BACKEND_URL}/api`;

export class AuthRepository {
  async login(input: LoginInput): Promise<{ tokens: BackendLoginResponse; user: BackendUser }> {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(err.detail ?? 'Login failed');
    }

    const tokens = (await res.json()) as BackendLoginResponse;

    // FIX 1: Never manually decode JWTs — they are NOT encrypted, just Base64.
    // A malformed or tampered token causes a silent crash. Extract sub safely:
    let userId: string;
    try {
      const payloadB64 = tokens.access_token.split('.')[1];
      if (!payloadB64) throw new Error('Malformed token');
      const payload = JSON.parse(
        Buffer.from(payloadB64, 'base64').toString('utf-8')  // Node-safe, not atob()
      );
      userId = payload?.sub;
      if (!userId) throw new Error('Token missing sub claim');
    } catch {
      throw new Error('Failed to parse access token');
    }

    // FIX 2: Pass auth token to the user lookup so it works behind auth middleware
    const user = await this.findUserById(userId, tokens.access_token);
    if (!user) throw new Error('User not found after login');

    return { tokens, user };
  }

  async findUserById(id: string, accessToken: string): Promise<BackendUser | null> {
    const res = await fetch(`${API}/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // FIX 2: Send Bearer token — /users/:id is a protected route
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) return null;
    return res.json();
  }
}