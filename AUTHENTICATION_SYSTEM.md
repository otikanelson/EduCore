# Authentication & Route Protection System

## 🔐 Overview

The authentication system prevents unauthorized access to protected pages by:
1. **JWT Token Authentication**: Secure token-based authentication
2. **Protected Routes**: Routes that require authentication
3. **Role-Based Access Control (RBAC)**: Different permissions for different roles
4. **Automatic Redirects**: Redirect to login if not authenticated
5. **Token Expiration Handling**: Auto-logout when token expires

## 📁 Files Created

### 1. Authentication Utilities
**`src/utils/auth.js`**
- Token management (store, retrieve, clear)
- User data management
- Authentication checks
- Role verification
- Token expiration detection

### 2. Protected Route Component
**`src/components/ProtectedRoute.jsx`**
- Wraps protected pages
- Checks authentication status
- Verifies user roles
- Redirects unauthorized users

### 3. API Service
**`src/services/api.js`**
- Centralized API calls
- Automatic token injection
- Error handling
- Auto-logout on 401

### 4. Unauthorized Page
**`src/pages/Unauthorized.jsx`**
- Shown when user lacks permissions
- Provides navigation options
- Shows current user role

### 5. Logout Component
**`src/components/LogoutButton.jsx`**
- Reusable logout button
- Confirmation dialog
- Clears auth data

## 🔒 How It Works

### Authentication Flow

```
1. User enters credentials
   ↓
2. Frontend calls /auth/login API
   ↓
3. Backend validates credentials
   ↓
4. Backend returns JWT token + user data
   ↓
5. Frontend stores token in localStorage
   ↓
6. User can access protected routes
```

### Route Protection Flow

```
User tries to access /admin
   ↓
ProtectedRoute checks:
   ├─ Is user authenticated? (has token?)
   │  └─ NO → Redirect to /login
   │  └─ YES → Continue
   ├─ Is token expired?
   │  └─ YES → Clear storage, redirect to /login
   │  └─ NO → Continue
   └─ Does user have required role?
      └─ NO → Redirect to /unauthorized
      └─ YES → Show page
```

## 🎭 Role-Based Access Control

### Roles & Permissions

| Role | Can Access |
|------|-----------|
| **Admin** | All pages (admin, teacher, parent, student) |
| **HOD** | Teacher pages, result approvals |
| **Teacher** | Teacher pages only |
| **Parent** | Parent portal, report cards |
| **Student** | Exam hall, results |

### Route Configuration

```javascript
// Admin only
<ProtectedRoute allowedRoles={['admin']}>
  <AdminDashboard />
</ProtectedRoute>

// Admin or HOD
<ProtectedRoute allowedRoles={['admin', 'hod']}>
  <ResultApproval />
</ProtectedRoute>

// Any authenticated user
<ProtectedRoute>
  <SomePage />
</ProtectedRoute>
```

## 🔑 Authentication Functions

### Login
```javascript
import { authAPI } from './services/api';
import { login } from './utils/auth';

const response = await authAPI.login(email, password);
login(response.access_token, response.user);
```

### Logout
```javascript
import { logout } from './utils/auth';

logout(); // Clears storage and redirects to login
```

### Check Authentication
```javascript
import { isAuthenticated } from './utils/auth';

if (isAuthenticated()) {
  // User is logged in
}
```

### Get User Data
```javascript
import { getUserData, getUserRole } from './utils/auth';

const user = getUserData();
const role = getUserRole();
```

## 🛡️ Security Features

### 1. Token Storage
- Stored in `localStorage`
- Automatically included in API requests
- Cleared on logout or expiration

### 2. Token Expiration
- Checked before each protected route access
- Automatic logout when expired
- User redirected to login

### 3. API Request Security
- All API requests include `Authorization` header
- 401 responses trigger automatic logout
- 403 responses show permission error

### 4. Route Protection
- Cannot access protected pages by typing URL
- Automatic redirect to login
- Return URL preserved for post-login redirect

### 5. Role Verification
- Server-side role stored in JWT
- Frontend checks role before rendering
- Backend validates role on each API call

## 📝 Usage Examples

### Protecting a New Page

```javascript
// In App.jsx
<Route 
  path="/new-page" 
  element={
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <NewPage />
    </ProtectedRoute>
  } 
/>
```

### Adding Logout Button to Dashboard

```javascript
import LogoutButton from '../components/LogoutButton';

function Dashboard() {
  return (
    <div>
      <header>
        <LogoutButton className="text-white hover:underline" />
      </header>
    </div>
  );
}
```

### Making Authenticated API Calls

```javascript
import { studentsAPI } from './services/api';

// Token automatically included
const students = await studentsAPI.getAll();
```

### Checking User Role in Component

```javascript
import { getUserRole } from './utils/auth';

function MyComponent() {
  const role = getUserRole();
  
  return (
    <div>
      {role === 'admin' && <AdminOnlyFeature />}
      {role === 'teacher' && <TeacherFeature />}
    </div>
  );
}
```

## 🔄 Login Flow with Protected Routes

### Scenario 1: Direct URL Access (Not Logged In)
```
1. User types: /admin
2. ProtectedRoute checks authentication
3. Not authenticated → Redirect to /login
4. User logs in
5. Redirect back to /admin
```

### Scenario 2: Direct URL Access (Logged In)
```
1. User types: /admin
2. ProtectedRoute checks authentication
3. Authenticated → Check role
4. Has admin role → Show page
```

### Scenario 3: Wrong Role
```
1. Student user types: /admin
2. ProtectedRoute checks authentication
3. Authenticated → Check role
4. Student role, needs admin → Redirect to /unauthorized
5. Show error page with link to student dashboard
```

### Scenario 4: Expired Token
```
1. User types: /admin
2. ProtectedRoute checks authentication
3. Token expired → Clear storage
4. Redirect to /login with "Session expired" message
```

## 🧪 Testing Authentication

### Test Cases

1. **Unauthenticated Access**
   - Try accessing `/admin` without logging in
   - Should redirect to `/login`

2. **Successful Login**
   - Login with valid credentials
   - Should redirect to appropriate dashboard
   - Should be able to access protected pages

3. **Role-Based Access**
   - Login as student
   - Try accessing `/admin`
   - Should redirect to `/unauthorized`

4. **Token Expiration**
   - Login and wait for token to expire
   - Try accessing protected page
   - Should redirect to login

5. **Logout**
   - Click logout button
   - Try accessing protected page
   - Should redirect to login

## 🔧 Configuration

### API URL
Set in `.env`:
```
VITE_API_URL=http://localhost:3000
```

### Token Expiration
JWT tokens expire after 24 hours (configured in backend)

### Storage Keys
```javascript
AUTH_TOKEN_KEY = 'educore_auth_token'
USER_DATA_KEY = 'educore_user_data'
```

## 🚨 Common Issues & Solutions

### Issue: "Cannot access page after login"
**Solution**: Check if token is being stored correctly
```javascript
console.log(localStorage.getItem('educore_auth_token'));
```

### Issue: "Redirected to login immediately"
**Solution**: Check token expiration
```javascript
import { isTokenExpired } from './utils/auth';
console.log('Token expired:', isTokenExpired());
```

### Issue: "CORS error on API calls"
**Solution**: Ensure backend CORS is configured for frontend URL

### Issue: "Role check not working"
**Solution**: Verify user data is stored correctly
```javascript
import { getUserData } from './utils/auth';
console.log('User data:', getUserData());
```

## 📊 Security Best Practices

✅ **DO:**
- Store tokens in localStorage (or httpOnly cookies for better security)
- Validate tokens on every protected route
- Check token expiration
- Clear tokens on logout
- Use HTTPS in production
- Implement refresh tokens (future enhancement)

❌ **DON'T:**
- Store sensitive data in localStorage
- Trust client-side role checks alone (always verify on backend)
- Expose tokens in URLs
- Keep expired tokens
- Skip token validation

## 🔮 Future Enhancements

1. **Refresh Tokens**: Auto-refresh expired tokens
2. **Remember Me**: Persistent login option
3. **Session Timeout**: Auto-logout after inactivity
4. **Multi-Device Logout**: Logout from all devices
5. **Login History**: Track login attempts
6. **2FA**: Two-factor authentication
7. **Password Reset**: Forgot password flow
8. **Account Lockout**: After failed attempts

## 📞 Support

If authentication issues persist:
1. Check browser console for errors
2. Verify API is running
3. Check network tab for failed requests
4. Clear localStorage and try again
5. Check backend logs

---

**Your app is now secure!** 🔐 Users cannot bypass login by typing URLs.
