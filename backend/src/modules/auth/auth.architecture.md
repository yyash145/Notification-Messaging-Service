Request
 → AuthController
   → AuthService
     → UsersService
       → Database
     → JWT Service
 → Response (JWT)

Auth never talks directly to DB — it uses UsersModule.

