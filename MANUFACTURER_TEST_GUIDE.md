# Manufacturer Dashboard - Test Guide

## Prerequisites
- Backend server running on `http://localhost:3000`
- Frontend running on `http://localhost:5173`
- Database connected and migrated
- Manufacturer account created

## Test Scenarios

### 1. Login & Authentication
**URL**: `http://localhost:5173/manufacturer/login`

**Test Steps**:
1. Enter manufacturer credentials
2. Click "Sign In to Platform"
3. Verify redirect to dashboard

**Expected Result**:
- Successful login
- Redirect to `/manufacturer/dashboard`
- User name displayed in sidebar

---

### 2. Dashboard Overview
**URL**: `http://localhost:5173/manufacturer/dashboard`

**Test Steps**:
1. View stats cards at top
2. Check pending registrations count
3. View quick action cards
4. Check recent registrations table

**Expected Result**:
- 4 stat cards showing:
  - Pending Registrations (yellow icon)
  - Active Schools (green icon)
  - Total Users (blue icon)
  - Monthly Revenue (purple icon)
- Quick actions section with 3 cards
- Recent registrations table (if any exist)
- "Coming soon" badges on unavailable features

---

### 3. Sidebar Navigation
**Test Steps**:
1. Click each menu item in sidebar
2. Verify active state highlighting
3. Test "Coming Soon" items (should not navigate)
4. Test mobile hamburger menu (resize browser)

**Expected Result**:
- Dashboard: Active, navigates to overview
- School Registrations: Active, navigates to registrations page
- All Schools: Disabled with "Soon" badge
- Subscriptions: Disabled with "Soon" badge
- Payments: Disabled with "Soon" badge
- Users: Disabled with "Soon" badge

---

### 4. School Registrations Page
**URL**: `http://localhost:5173/manufacturer/registrations`

**Test Steps**:
1. Navigate to School Registrations
2. View pending count in header
3. Check Excel-style table
4. Click "View" button on a registration
5. Test Approve/Reject actions

**Expected Result**:
- Pending count badge in header
- Excel-style table with borders
- All columns visible and properly formatted
- View modal shows full school details
- Approve/Reject buttons functional
- Success/error messages display properly

---

### 5. Responsive Design
**Test Steps**:
1. Resize browser to mobile width (< 640px)
2. Test hamburger menu
3. Check sidebar overlay
4. Verify table responsiveness

**Expected Result**:
- Hamburger menu appears on mobile
- Sidebar slides in from left
- Overlay closes sidebar when clicked
- Tables remain scrollable
- All content readable on small screens

---

### 6. User Profile & Logout
**Test Steps**:
1. Check user profile section in sidebar
2. Verify user initial and name display
3. Click logout button
4. Verify redirect to login

**Expected Result**:
- User initial in circle avatar
- Full name and "Administrator" role shown
- Logout button visible
- Successful logout and redirect

---

## Visual Design Checklist

### Colors
- [ ] Primary blue: `#1e3a8a`
- [ ] Background: `#fafaf9`
- [ ] Borders: `#e5e7eb` (gray-200)
- [ ] Text: Gray scale (900, 700, 600, 500)

### Typography
- [ ] Headers: Bold, appropriate sizes
- [ ] Body text: Regular weight
- [ ] Uppercase labels in tables
- [ ] Consistent font sizes

### Layout
- [ ] Sidebar: 256px width (w-64)
- [ ] Clean borders (no rounded corners on tables)
- [ ] Proper spacing and padding
- [ ] Excel-style table appearance

### Components
- [ ] Stat cards with icons
- [ ] Status badges (yellow for pending)
- [ ] Hover effects on rows
- [ ] "Coming Soon" badges
- [ ] Clean button styles

---

## Known Issues / Limitations

1. **Coming Soon Features**: The following are placeholders:
   - All Schools page
   - Subscriptions management
   - Payments tracking
   - User management

2. **Mock Data**: Stats show "0" for:
   - Active schools
   - Total users
   - Monthly revenue

3. **Rate Limiting**: Throttle decorator disabled for testing

---

## Quick Test Commands

### Create Test Manufacturer
```bash
cd educore-os/backend
node create-manufacturer.js "Test Admin" "admin@skoolar.com" "Admin@123"
```

### Start Development Servers
```bash
# Terminal 1 - Backend
cd educore-os/backend
npm run start:dev

# Terminal 2 - Frontend
cd educore-os/frontend
npm run dev
```

---

## Success Criteria

✅ Login works without errors
✅ Dashboard displays with stats
✅ Navigation sidebar functional
✅ School registrations table displays
✅ Approve/reject actions work
✅ Responsive on mobile/tablet/desktop
✅ Professional Excel-style design
✅ No console errors
✅ Logout works properly

---

## Next Steps (Future Development)

1. Implement "All Schools" page
2. Add subscription management
3. Build payment tracking
4. Create user management interface
5. Add analytics charts
6. Implement search/filter functionality
7. Add export to CSV/Excel
8. Build notification system
