import requests
import sys
import json
from datetime import datetime

class AdminUserManagementAPITester:
    def __init__(self, base_url="https://admin-user-hub-4.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_base = f"{base_url}/api"
        self.token = None
        self.admin_token = None
        self.user_token = None
        self.test_admin_id = None
        self.test_user_id = None
        self.created_user_id = None
        self.tests_run = 0
        self.tests_passed = 0

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED {details}")
        else:
            print(f"❌ {name} - FAILED {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, token_type=None):
        """Run a single API test"""
        url = f"{self.api_base}{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        # Add appropriate token
        if token_type == 'admin' and self.admin_token:
            test_headers['Authorization'] = f'Bearer {self.admin_token}'
        elif token_type == 'user' and self.user_token:
            test_headers['Authorization'] = f'Bearer {self.user_token}'
        elif self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f", Expected: {expected_status}"
                try:
                    details += f", Response: {response.text[:200]}"
                except:
                    pass
            
            self.log_test(name, success, details)
            
            try:
                return success, response.json() if response.text else {}
            except:
                return success, response.text

        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            return False, {}

    def test_user_registration(self):
        """Test user registration"""
        print("\n=== Testing User Registration ===")
        
        # Test admin registration
        admin_data = {
            "name": "Test Admin",
            "email": f"admin_{datetime.now().strftime('%H%M%S')}@test.com",
            "password": "TestAdmin123!",
            "role": "admin"
        }
        
        success, response = self.run_test(
            "Register Admin User",
            "POST", "/register", 201, admin_data
        )
        
        if success:
            self.test_admin_id = response.get('userId')
        
        # Test regular user registration
        user_data = {
            "name": "Test User",
            "email": f"user_{datetime.now().strftime('%H%M%S')}@test.com",
            "password": "TestUser123!",
            "role": "user"
        }
        
        success, response = self.run_test(
            "Register Regular User",
            "POST", "/register", 201, user_data
        )
        
        if success:
            self.test_user_id = response.get('userId')
            
        # Test duplicate email registration
        self.run_test(
            "Register Duplicate Email",
            "POST", "/register", 400, admin_data
        )
        
        return admin_data, user_data

    def test_user_login(self, admin_data, user_data):
        """Test user login"""
        print("\n=== Testing User Login ===")
        
        # Test admin login
        admin_login = {
            "email": admin_data["email"],
            "password": admin_data["password"]
        }
        
        success, response = self.run_test(
            "Admin Login",
            "POST", "/login", 200, admin_login
        )
        
        if success:
            self.admin_token = response.get('token')
            
        # Test user login
        user_login = {
            "email": user_data["email"],
            "password": user_data["password"]
        }
        
        success, response = self.run_test(
            "User Login",
            "POST", "/login", 200, user_login
        )
        
        if success:
            self.user_token = response.get('token')
            
        # Test invalid login
        invalid_login = {
            "email": "invalid@test.com",
            "password": "wrongpassword"
        }
        
        self.run_test(
            "Invalid Login",
            "POST", "/login", 401, invalid_login
        )

    def test_user_management_apis(self):
        """Test user management APIs (admin only)"""
        print("\n=== Testing User Management APIs ===")
        
        # Test get all users (admin only)
        self.run_test(
            "Get All Users (Admin)",
            "GET", "/users", 200, token_type='admin'
        )
        
        # Test get all users (user access - should fail)
        self.run_test(
            "Get All Users (User - Should Fail)",
            "GET", "/users", 403, token_type='user'
        )
        
        # Test create user (admin only)
        new_user_data = {
            "name": "Created User",
            "email": f"created_{datetime.now().strftime('%H%M%S')}@test.com",
            "password": "CreatedUser123!",
            "role": "user"
        }
        
        success, response = self.run_test(
            "Create User (Admin)",
            "POST", "/users", 200, new_user_data, token_type='admin'
        )
        
        if success:
            self.created_user_id = response.get('id')
        
        # Test update user (admin only)
        if self.created_user_id:
            update_data = {
                "name": "Updated User Name",
                "role": "admin"
            }
            
            self.run_test(
                "Update User (Admin)",
                "PUT", f"/users/{self.created_user_id}", 200, update_data, token_type='admin'
            )
        
        # Test delete user (admin only)
        if self.created_user_id:
            self.run_test(
                "Delete User (Admin)",
                "DELETE", f"/users/{self.created_user_id}", 200, token_type='admin'
            )

    def test_profile_apis(self):
        """Test profile APIs"""
        print("\n=== Testing Profile APIs ===")
        
        # Test get own profile (user)
        if self.test_user_id:
            self.run_test(
                "Get Own Profile (User)",
                "GET", f"/profile/{self.test_user_id}", 200, token_type='user'
            )
        
        # Test update own profile (user)
        if self.test_user_id:
            profile_update = {
                "name": "Updated Test User",
                "email": f"updated_user_{datetime.now().strftime('%H%M%S')}@test.com"
            }
            
            self.run_test(
                "Update Own Profile (User)",
                "PUT", f"/profile/{self.test_user_id}", 200, profile_update, token_type='user'
            )
        
        # Test access other's profile (should fail)
        if self.test_admin_id and self.test_user_id:
            self.run_test(
                "Access Other's Profile (Should Fail)",
                "GET", f"/profile/{self.test_admin_id}", 403, token_type='user'
            )

    def test_analytics_apis(self):
        """Test analytics APIs (admin only)"""
        print("\n=== Testing Analytics APIs ===")
        
        # Test dashboard stats
        self.run_test(
            "Get Dashboard Stats (Admin)",
            "GET", "/analytics/stats", 200, token_type='admin'
        )
        
        # Test user growth data
        self.run_test(
            "Get User Growth (Admin)",
            "GET", "/analytics/user-growth", 200, token_type='admin'
        )
        
        # Test role distribution
        self.run_test(
            "Get Role Distribution (Admin)",
            "GET", "/analytics/role-distribution", 200, token_type='admin'
        )
        
        # Test weekly activity
        self.run_test(
            "Get Weekly Activity (Admin)",
            "GET", "/analytics/weekly-activity", 200, token_type='admin'
        )
        
        # Test analytics access as user (should fail)
        self.run_test(
            "Get Dashboard Stats (User - Should Fail)",
            "GET", "/analytics/stats", 403, token_type='user'
        )

    def test_root_endpoint(self):
        """Test root API endpoint"""
        print("\n=== Testing Root Endpoint ===")
        
        self.run_test(
            "Root API Endpoint",
            "GET", "/", 200
        )

def main():
    print("🚀 Starting Admin User Management API Tests")
    print("=" * 60)
    
    tester = AdminUserManagementAPITester()
    
    # Test root endpoint
    tester.test_root_endpoint()
    
    # Test user registration and get credentials
    admin_data, user_data = tester.test_user_registration()
    
    # Test login functionality
    tester.test_user_login(admin_data, user_data)
    
    # Test user management APIs
    if tester.admin_token:
        tester.test_user_management_apis()
    else:
        print("⚠️  Skipping user management tests - no admin token")
    
    # Test profile APIs
    if tester.user_token:
        tester.test_profile_apis()
    else:
        print("⚠️  Skipping profile tests - no user token")
    
    # Test analytics APIs
    if tester.admin_token:
        tester.test_analytics_apis()
    else:
        print("⚠️  Skipping analytics tests - no admin token")
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    print(f"🎯 Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())