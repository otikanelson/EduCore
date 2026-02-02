# 🧪 Authentication Testing Guide

## Quick Test Checklist

### ✅ Test 1: Unauthenticated Access (Should Fail)
1. Open browser in **incognito/private mode**
2. Try to access: `http://localhost:5173/admin`
3. **Expected**: Redirected to `/login`
4. **Status**: ⬜ Pass / ⬜ Fail

### ✅ Test 2: Login Flow
1. Go to: `http://localhost:5173/login`
2. Enter portal: `fieldgreen`
3. Click "Connect to Portal"
4. Enter credentials:
   - Email: `admin@fieldgreen.edu`
   - Password: `password123`
5. Click "Sign In"
6. **Expected**: Redirected to `/admin` dashboard
7. **Status**: ⬜ Pass / ⬜ Fail

### ✅ Test 3: Direct URL Access After Login (Should Work)
1. After logging in (Test 2)
2. Type in URL bar: `http://localhost:5173/admin/students`
3. **Expected**: Page loads successfully
4. **Status**: ⬜ Pass / ⬜ Fail

### ✅ Test 4: Role-Based Access (Should Fail)
1. Logout if logged in
2. Login as **student**:
   - Email: `student@fieldgreen.edu`
   - Password: `password123`
3. Try to access: `http://localhost:5173/admin`
4. **Expected**: Redirected to `/unauthorized`
5. **Status**: ⬜ Pass / ⬜ Fail

### ✅ Test 5: Logout
1. Login as any user
2. Click "Logout" button (if added to dashboard)
3. Try to access: `http://localhost:5173/admin`
4. **Expected**: Redirected to `/login`
5. **Status**: ⬜ Pass / ⬜ Fail

### ✅ Test 6: Direct Login Bypass
1. Go to: `http://localhost:5173/login/direct`
2. Enter:
   - Email: `teacher@fieldgreen.edu`
   - Password: `password123`
3. Click "Sign In"
4. **Expected**: Redirected to `/teacher` dashboard
5. **Status**: ⬜ Pass / ⬜ Fail

### ✅ Test 7: Token Persistence
1. Login as any user
2. Close browser tab
3. Open new tab
4. Go to: `http://localhost:5173/admin`
5. **Expected**: Page loads (still logged in)
6. **Status**: ⬜ Pass / ⬜ Fail

### ✅ Test 8: Manual Token Removal
1. Login as any user
2. Open browser console (F12)
3. Run: `localStorage.clear()`
4. Try to access: `http://localhost:5173/admin`
5. **Expected**: Redirected to `/login`
6. **Status**: ⬜ Pass / ⬜ Fail

## 🔍 Debugging Commands

### Check if User is Logged In
```javascript
// Open browser console (F12) and run:
localStorage.getItem('educore_auth_token')
// Should return token string if logged in
```

### Check User Data
```javascript
JSON.parse(localStorage.getItem('educore_user_data'))
// Should return user object with role
```

### Check Token Expiration
```javascript
const token = localStorage.getItem('educore_auth_token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Expires:', new Date(payload.exp * 1000));
```

### Manual Login (For Testing)
```javascript
// Simulate login without API call
localStorage.setItem('educore_auth_token', 'fake-token-for-testing');
localStorage.setItem('educore_user_data', JSON.stringify({
  id: '1',
  email: 'admin@fieldgreen.edu',
  role: 'admin',
  name: 'Test Admin'
}));
// Refresh page
```

### Clear Auth Data
```javascript
localStorage.removeItem('educore_auth_token');
localStorage.removeItem('educore_user_data');
// Refresh page
```

## 📊 Test Results Table

| Test | Description | Expected | Result | Notes |
|------|-------------|----------|--------|-------|
| 1 | Unauthenticated access | Redirect to login | ⬜ | |
| 2 | Login flow | Access dashboard | ⬜ | |
| 3 | Direct URL after login | Page loads | ⬜ | |
| 4 | Wrong role access | Redirect to unauthorized | ⬜ | |
| 5 | Logout | Redirect to login | ⬜ | |
| 6 | Direct login | Access dashboard | ⬜ | |
| 7 | Token persistence | Stay logged in | ⬜ | |
| 8 | Manual token removal | Redirect to login | ⬜ | |

## 🚨 Common Issues

### Issue: Redirected to login immediately after login
**Cause**: Token not being stored
**Fix**: Check browser console for errors, verify API response

### Issue: Can still access pages without login
**Cause**: ProtectedRoute not wrapping routes
**Fix**: Check App.jsx, ensure routes are wrapped

### Issue: Wrong dashboard after login
**Cause**: Role-based redirect not working
**Fix**: Check user data has correct role

### Issue: CORS error
**Cause**: Backend not allowing frontend origin
**Fix**: Update backend CORS configuration

## 🎯 Success Criteria

All tests should **PASS** for authentication to be working correctly:
- ✅ Cannot access protected pages without login
- ✅ Can login successfully
- ✅ Can access pages after login
- ✅ Cannot access pages for other roles
- ✅ Logout works correctly
- ✅ Token persists across page refreshes
- ✅ Clearing token requires re-login

## 📝 Test Report Template

```
Date: ___________
Tester: ___________

Test Results:
- Test 1: ⬜ Pass ⬜ Fail
- Test 2: ⬜ Pass ⬜ Fail
- Test 3: ⬜ Pass ⬜ Fail
- Test 4: ⬜ Pass ⬜ Fail
- Test 5: ⬜ Pass ⬜ Fail
- Test 6: ⬜ Pass ⬜ Fail
- Test 7: ⬜ Pass ⬜ Fail
- Test 8: ⬜ Pass ⬜ Fail

Overall: ⬜ All Pass ⬜ Some Fail

Notes:
_________________________________
_________________________________
_________________________________
```

---

**Run these tests to verify your authentication system is secure!** 🔐
