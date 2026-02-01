# Render Deployment Configuration Guide

## Environment Variables yang Harus Di-set di Render Dashboard

Setelah deploy ke Render, Anda **HARUS** mengatur environment variables berikut di Render Dashboard (Settings → Environment):

### 1. Database Configuration (REQUIRED)
```
DATABASE_URL=postgresql://postgres.lzxqtkoyemforixvvjcd:FSeiOyOmRjvJwura@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres.lzxqtkoyemforixvvjcd:FSeiOyOmRjvJwura@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres
```

### 2. Supabase Configuration (REQUIRED untuk Auth)
```
SUPABASE_URL=https://lzxqtkoyemforixvvjcd.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6eHF0a295ZW1mb3JpeHZ2amNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTQyMTAsImV4cCI6MjA4NTM3MDIxMH0.SRicy_mRy-1hC0OMGqQP16cAS4fedj3CmV0NhcAdE38
```

### 3. AI API Keys (OPTIONAL, tapi GROQ digunakan)
```
GROQ_API_KEY=[YOUR-GROQ-API-KEY]
OPENAI_API_KEY=(optional - kosongkan jika tidak dipakai)
GEMINI_API_KEY=(optional - kosongkan jika tidak dipakai)
```

### 4. Server Configuration (AUTO dari render.yaml)
```
PORT=3001
NODE_ENV=production
```

---

## Cara Mengatur Environment Variables di Render

1. **Login ke Render Dashboard**: https://dashboard.render.com
2. **Pilih Service**: `healthfit-backend`
3. **Go to Environment**: Settings → Environment
4. **Add Environment Variables**: Click "Add Environment Variable"
5. **Paste Values**: Copy nilai dari atas ke masing-masing key
6. **Save Changes**: Render akan auto-redeploy

---

## Verifikasi Deployment

### Test Health Check
```bash
curl https://backend-health-eq7q.onrender.com/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### Test Auth Endpoint
```bash
curl https://backend-health-eq7q.onrender.com/api/auth/login
```

**Expected Response:**
```json
{
  "message": "Please login via the Mobile App using Supabase."
}
```

---

## Frontend Configuration

Frontend `.env` sudah benar:
```bash
EXPO_PUBLIC_API_URL=https://backend-health-eq7q.onrender.com
```

**API Service** akan otomatis append `/api` sehingga request dikirim ke:
- `https://backend-health-eq7q.onrender.com/api/users`
- `https://backend-health-eq7q.onrender.com/api/auth/verify`
- dll.

---

## Troubleshooting

### ❌ Backend Error: "Missing Supabase configuration"
**Solusi**: Pastikan `SUPABASE_URL` dan `SUPABASE_ANON_KEY` sudah di-set di Render

### ❌ Frontend Error: "Network request failed"
**Solusi**: 
1. Cek apakah Render service sedang running
2. Test health check endpoint
3. Pastikan CORS enabled (sudah di-set di `backend/src/index.ts`)

### ❌ Auth Error: "Invalid token"
**Solusi**: Pastikan Supabase credentials di frontend dan backend sama

---

## Checklist Deployment ✅

- [ ] Set `DATABASE_URL` di Render
- [ ] Set `DIRECT_URL` di Render
- [ ] Set `SUPABASE_URL` di Render
- [ ] Set `SUPABASE_ANON_KEY` di Render
- [ ] Set `GROQ_API_KEY` di Render (jika pakai AI feature)
- [ ] Deploy ulang backend di Render
- [ ] Test health check endpoint
- [ ] Test login dari mobile app
- [ ] Verify user data sync ke database
