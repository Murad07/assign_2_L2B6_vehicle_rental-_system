# 🚗 Vehicle Rental System

## Live Demo: []()

## 🎯 Project Overview

A backend API for a vehicle rental management system that handles:
- **Vehicles** - Manage vehicle inventory with availability tracking
- **Customers** - Manage customer accounts and profiles
- **Bookings** - Handle vehicle rentals, returns and cost calculation
- **Authentication** - Secure role-based access control (Admin and Customer roles)

---

## 🛠️ Technology Stack

- **Node.js** + **TypeScript**
- **Express.js** (web framework)
- **PostgreSQL** (database)
- **bcrypt** (password hashing)
- **jsonwebtoken** (JWT authentication)

## 🚀 Setup and Usage

1. Clone the repository: `git clone https://github.com/Murad07/assign_2_L2B6_vehicle_rental-_system`

2. Install dependencies: `npm install`

3. Use Neon DB for Database setup. and get the connection string.

4. flow the .env.example and rename it to .env and update the values

5. Start the server: `npm run dev`

6. Use Postman or other tools to test the API endpoints.

---

# API Endpoints

## 🔐 Authentication Endpoints

### 1. User Registration

**Access:** Public  
**Description:** Register a new user account

#### Endpoint
```
POST /api/v1/auth/signup
```

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phone": "01712345678",
  "role": "customer"
}
```

---

### 2. User Login

**Access:** Public  
**Description:** Login and receive JWT authentication token

#### Endpoint
```
POST /api/v1/auth/signin
```

#### Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

---

## 🚗 Vehicle Endpoints

### 3. Create Vehicle

**Access:** Admin only  
**Description:** Add a new vehicle to the system

#### Endpoint
```
POST /api/v1/vehicles
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body
```json
{
  "vehicle_name": "Toyota Camry 2024",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 50,
  "availability_status": "available"
}
```

---

### 4. Get All Vehicles

**Access:** Public  
**Description:** Retrieve all vehicles in the system

#### Endpoint
```
GET /api/v1/vehicles
```

---

### 5. Get Vehicle by ID

**Access:** Public  
**Description:** Retrieve specific vehicle details

#### Endpoint
```
GET /api/v1/vehicles/:vehicleId
```

**Example:**
```
GET /api/v1/vehicles/2
```

### 6. Update Vehicle

**Access:** Admin only  
**Description:** Update vehicle details, price, or availability status

#### Endpoint
```
PUT /api/v1/vehicles/:vehicleId
```

**Example:**
```
PUT /api/v1/vehicles/1
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body (All fields optional)
```json
{
  "vehicle_name": "Toyota Camry 2024 Premium",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 55,
  "availability_status": "available"
}
```


### 7. Delete Vehicle

**Access:** Admin only  
**Description:** Delete a vehicle (only if no active bookings exist)

#### Endpoint
```
DELETE /api/v1/vehicles/:vehicleId
```

**Example:**
```
DELETE /api/v1/vehicles/1
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Vehicle deleted successfully"
}
```

## 👥 User Endpoints

### 8. Get All Users

**Access:** Admin only  
**Description:** Retrieve all users in the system

#### Endpoint
```
GET /api/v1/users
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

---

### 9. Update User

**Access:** Admin or Own Profile  
**Description:** Admin can update any user's role or details. Customer can update own profile only

#### Endpoint
```
PUT /api/v1/users/:userId
```

**Example:**
```
PUT /api/v1/users/1
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body (All fields optional)
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "+1234567899",
  "role": "admin"
}
```

### 10. Delete User

**Access:** Admin only  
**Description:** Delete a user (only if no active bookings exist)

#### Endpoint
```
DELETE /api/v1/users/:userId
```

**Example:**
```
DELETE /api/v1/users/1
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

## 📅 Booking Endpoints

### 11. Create Booking

**Access:** Customer or Admin  
**Description:** Create a new booking with automatic price calculation and vehicle status update

#### Endpoint
```
POST /api/v1/bookings
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body
```json
{
  "customer_id": 1,
  "vehicle_id": 2,
  "rent_start_date": "2024-01-15",
  "rent_end_date": "2024-01-20"
}
```

---

### 12. Get All Bookings

**Access:** Role-based (Admin sees all, Customer sees own)  
**Description:** Retrieve bookings based on user role

#### Endpoint
```
GET /api/v1/bookings
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

---

### 13. Update Booking

**Access:** Role-based  
**Description:** Update booking status based on user role and business rules

#### Endpoint
```
PUT /api/v1/bookings/:bookingId
```

**Example:**
```
PUT /api/v1/bookings/1
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body - Customer Cancellation
```json
{
  "status": "cancelled"
}
```

#### Request Body - Admin Mark as Returned
```json
{
  "status": "returned"
}
```

