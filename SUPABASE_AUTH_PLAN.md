# Supabase OTP Authentication Implementation Plan

## Current State
- Auth pages exist (`/login`, `/otp`) but are static templates
- Navbar has placeholder "Sign out" links
- No actual authentication logic implemented

## Implementation Steps

### 1. Setup Supabase
- [x] Install `@supabase/supabase-js` and `@supabase/ssr` packages
- [x] Create `.env.local` with Supabase credentials:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [x] Create Supabase client utilities for server/client components:
  - `src/lib/supabase/client.ts` - Browser client
  - `src/lib/supabase/server.ts` - Server client
  - `src/lib/supabase/middleware.ts` - Middleware helper

### 2. Authentication Infrastructure
- [x] Create auth context provider for client-side user state
  - `src/contexts/auth-context.tsx`
  - Export `useAuth()` hook
  - Provide user state and loading state
- [x] Create server actions for OTP operations:
  - `src/app/(auth)/actions.ts`
  - `sendOTP(email)` - Send OTP to email
  - `verifyOTP(email, token)` - Verify OTP code
  - `signOut()` - Sign out user
  - `resendOTP(email)` - Resend OTP code
- [x] Add middleware to protect routes and handle auth redirects
  - `middleware.ts` at root
  - Protect all routes except `/login`, `/otp`, and public assets
  - Redirect unauthenticated users to `/login`
  - Redirect authenticated users away from `/login`

### 3. Login Flow
- [x] Update `/login` page (`src/app/(auth)/login/page.tsx`):
  - Convert form to use server action
  - Add loading state during OTP send
  - Handle errors (invalid email, rate limiting, etc.)
  - Redirect to `/otp` on success with email in URL params or state
  - Show success message after sending OTP

### 4. OTP Verification
- [ ] Update `/otp` page (`src/app/(auth)/otp/page.tsx`):
  - Get email from URL params or session
  - Display actual user email (not hardcoded)
  - Add server action to verify OTP
  - Implement "resend code" functionality with cooldown
  - Handle successful verification → redirect to `/`
  - Handle errors (invalid code, expired code, etc.)
  - Add loading state during verification

### 5. Protected Routes & User State
- [ ] Add middleware (`middleware.ts`):
  - Refresh Supabase session on each request
  - Protect routes (redirect to `/login` if not authenticated)
  - Allow public routes: `/login`, `/otp`
- [ ] Update navbar (`src/components/navbar.tsx`):
  - Use auth context to get user state
  - Show user email or name when authenticated
  - Show "Sign in" link when not authenticated
  - Implement working sign out functionality
  - Add loading state while checking auth
- [ ] Wrap app with auth provider:
  - Update root layout or create provider wrapper
  - Initialize auth state on mount

### 6. Testing Checklist
- [ ] Test complete signup flow (new user)
  - Enter email on `/login`
  - Receive OTP email
  - Enter correct OTP on `/otp`
  - Redirect to course page
  - See user email in navbar
- [ ] Test signin flow (existing user)
  - Same as signup (Supabase OTP works for both)
- [ ] Test OTP resend
  - Click "Request new code"
  - Receive new OTP email
  - Verify with new code
- [ ] Test protected route access
  - Try accessing `/` without auth → redirect to `/login`
  - Sign in → can access `/`
- [ ] Test sign out and session cleanup
  - Click "Sign out"
  - Redirect to `/login`
  - Cannot access protected routes
- [ ] Test error cases
  - Invalid email format
  - Wrong OTP code
  - Expired OTP code
  - Network errors

## Files to Create/Modify

### New Files
- `.env.local` - Environment variables (gitignored)
- `.env.local.example` - Example env file for documentation
- `src/lib/supabase/client.ts` - Browser Supabase client
- `src/lib/supabase/server.ts` - Server Supabase client
- `src/lib/supabase/middleware.ts` - Middleware helper
- `src/contexts/auth-context.tsx` - Auth context provider
- `src/app/(auth)/actions.ts` - Server actions for auth
- `middleware.ts` - Route protection middleware

### Modified Files
- `src/app/(auth)/login/page.tsx` - Add OTP send functionality
- `src/app/(auth)/otp/page.tsx` - Add OTP verification
- `src/components/navbar.tsx` - Show user state and sign out
- `src/app/layout.tsx` - Wrap with auth provider

## Supabase Configuration Required

### In Supabase Dashboard
1. Create a new project (if not exists)
2. Enable Email Auth in Authentication settings
3. Configure email templates for OTP (optional)
4. Copy Project URL and Anon Key to `.env.local`
5. (Optional) Customize email template for OTP

### Authentication Settings
- Enable Email provider
- Disable email confirmation (use OTP only)
- Set OTP expiry time (default: 1 hour)
- Configure redirect URLs for production

## Security Considerations
- Never commit `.env.local` to git (already in `.gitignore`)
- Use environment variables for all Supabase credentials
- Implement rate limiting for OTP sending (Supabase handles this)
- Add CSRF protection via Next.js server actions
- Use secure cookies for session management (handled by Supabase SSR)
- Validate email format on both client and server
- Handle session refresh in middleware
