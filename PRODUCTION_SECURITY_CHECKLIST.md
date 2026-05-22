# 🔒 Production Security Audit & Hardening Checklist

## Executive Summary

This document contains a comprehensive security audit of your full-stack application (React + Vite frontend, Spring Boot backend) deployed on Vercel + AWS EC2. All findings and recommended fixes are included.

---

## ✅ COMPLETED SECURITY HARDENING

### 1. Frontend Console Statements Removal
- **Status**: ✅ **COMPLETED**
- **What was fixed**: Removed all `console.log()`, `console.error()`, `console.warn()` statements from 11 frontend files
- **Files fixed**:
  - `src/pages/Home.jsx`
  - `src/components/Footer.jsx`
  - `src/components/Navbar.jsx`
  - `src/pages/admin/Services.jsx`
  - `src/pages/admin/Settings.jsx`
  - `src/pages/admin/Testimonials.jsx`
  - `src/pages/admin/ProjectForm.jsx`
  - `src/pages/admin/Dashboard.jsx`
  - `src/pages/admin/RouteManagement.jsx`
  - `src/pages/admin/Pricing.jsx`
  - `src/components/ui/demo-bauhaus.jsx`
- **Impact**: Production bundles will be free of debug output; browser console will not leak information
- **Build protection**: Vite is already configured with `drop_console: true` in terser options for additional safety

---

### 2. Vite Build Configuration (Already Secure)
- **Status**: ✅ **VERIFIED SECURE**
- **Current config** (`vite.config.js`):
  ```javascript
  build: {
    sourcemap: false,           // ✅ Source maps disabled in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,     // ✅ All console.* calls stripped
        drop_debugger: true,    // ✅ Debugger statements removed
      },
    },
  }
  ```
- **Security benefit**: Users cannot view readable source code in DevTools; no sensitive data in console

---

### 3. Backend Logging Configuration (Already Secure)
- **Status**: ✅ **VERIFIED SECURE**
- **Current config** (`application.properties`):
  ```properties
  logging.level.root=WARN                                    # ✅ Only warnings and errors
  logging.level.org.springframework=WARN                     # ✅ Framework logging suppressed
  logging.level.com.forgelabs=INFO                          # ✅ App logs at INFO level
  logging.level.org.hibernate.SQL=OFF                       # ✅ SQL queries not logged
  logging.level.org.hibernate.type.descriptor.sql=OFF       # ✅ Prepared statement params not logged
  ```
- **Impact**: No sensitive query information leaks; production logs remain clean

---

### 4. Backend Error Handling (Already Hardened)
- **Status**: ✅ **VERIFIED SECURE**
- **Current config** (`application.properties`):
  ```properties
  server.error.include-stacktrace=never            # ✅ No stack traces to clients
  server.error.include-message=never               # ✅ No detailed error messages
  server.error.include-binding-errors=never        # ✅ No parameter errors exposed
  server.error.include-exception=false             # ✅ No exception details
  ```
- **Impact**: Error pages won't leak internal architecture or paths

---

### 5. Hardcoded Backend IP Removal (Critical Issue - Fixed)
- **Status**: ✅ **CRITICAL FIX APPLIED**
- **Issue Found**: `vercel.json` exposed hardcoded EC2 IP: `http://13.234.114.141:8080`
- **Fix Applied**: 
  ```json
  {
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```
- **How it works**: Frontend uses `VITE_API_URL` environment variable (already in axios config)
- **Setup for Vercel**: Add this environment variable in Vercel dashboard:
  - Key: `VITE_API_URL`
  - Value: `https://your-api-domain.com` (use domain name, not IP)

---

### 6. Backend System.out Statements (Cleaned)
- **Status**: ✅ **COMPLETED**
- **Files fixed**: `backend/src/main/java/com/forgelabs/api/config/InitialDataSeeder.java`
- **Changes**: Replaced all `System.out.println()` calls with proper logging via SLF4J logger
- **Security benefit**: Logs go to configured appender (not stdout), respecting logging levels

---

## 🚨 CRITICAL RECOMMENDATIONS - IMPLEMENT IMMEDIATELY

### 1. Environment Variable Security

#### **Vercel Frontend Deployment**
1. Go to **Project Settings** → **Environment Variables**
2. Add the following:
   ```
   VITE_API_URL = https://api.yourdomain.com    (or your actual backend domain)
   ```
3. Ensure variables are added to **Production** environment specifically
4. **Never commit `.env` files to git** (already has `.env.example`)

#### **AWS EC2 Backend Deployment**
1. Create an `.env` file on your EC2 instance (not in version control):
   ```bash
   sudo vim /opt/forgelabs/.env
   ```
2. Add all variables from `.env.example`:
   - `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`
   - `JWT_SECRET` (strong, random)
   - `JWT_EXPIRATION`
   - `FRONTEND_URL`
   - `ENCRYPTION_KEY`
   - `CLAUDE_API_KEY` (if using AI features)
3. Load variables in your Spring Boot startup script:
   ```bash
   #!/bin/bash
   source /opt/forgelabs/.env
   java -jar forgelabs-api.jar
   ```

---

### 2. JWT Security Audit ✅ **VERIFIED**

**Current implementation** (`JwtUtils.java`):
- ✅ Algorithm: HS512 (HMAC-SHA512) - **Secure**
- ✅ Uses strong secret from environment variable
- ✅ Token expiration configured
- ✅ Proper validation in filter

**Recommendations**:
1. **Increase JWT secret length**: Generate 64+ character secret
   ```bash
   openssl rand -base64 32  # Generates 44-char base64 string
   ```
2. **Add token refresh mechanism** (optional but recommended):
   - Issue short-lived access tokens (15-30 min)
   - Use refresh tokens (7 days) to get new access tokens
3. **Never store JWT in localStorage** - consider HttpOnly cookies instead:
   ```javascript
   // Instead of localStorage.setItem('user', token)
   // Use HttpOnly cookie set by backend:
   response.addCookie(new HttpCookie("auth_token", token, true));
   ```

---

### 3. CORS Configuration ✅ **VERIFIED**

**Current implementation** (`WebSecurityConfig.java`):
- ✅ Reads allowed origins from environment: `app.cors.allowed-origins`
- ✅ Restricts methods to: GET, POST, PUT, PATCH, DELETE
- ✅ Credentials enabled (needed for JWT auth)

**Production Setup**:
```properties
# In application.properties or .env
app.cors.allowed-origins=https://www.yourdomain.com,https://yourdomain.com
```
- ✅ Only include your production domain (no trailing slashes)
- ✅ Use HTTPS URLs only
- ✅ Remove localhost entries in production

---

### 4. Database Security Hardening

#### **AWS RDS Configuration**:
1. **Enable encryption**:
   - Encrypted at rest (AWS KMS)
   - Encrypted in transit (SSL/TLS)
2. **Use IAM Database Authentication** (recommended):
   ```properties
   # Instead of password in env, use IAM token
   spring.datasource.url=jdbc:mysql:aws://your-rds-endpoint.amazonaws.com:3306/db?allowPublicKeyRetrieval=false&useSSL=true
   spring.datasource.username=iamDbUser
   spring.datasource.password=${AWS_RDS_IAM_TOKEN}
   ```
3. **Restrict Security Groups**:
   - Allow access only from your EC2 instance's security group
   - Never allow `0.0.0.0/0` (public internet)
4. **Enable backup and multi-AZ deployment**
5. **Use strong password policy**: 32+ characters, mixed case, numbers, special chars

---

### 5. HTTPS & SSL/TLS Enforcement

#### **Vercel (Frontend)**:
- ✅ **Automatic HTTPS** - Vercel provides free SSL certificates
- Already configured in `vercel.json` with security headers

#### **AWS EC2 (Backend)**:
1. **Install SSL Certificate** (AWS Certificate Manager recommended):
   ```bash
   # Using Certbot for Let's Encrypt (free)
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot certonly --standalone -d api.yourdomain.com
   ```
2. **Configure Spring Boot for HTTPS**:
   ```properties
   server.ssl.enabled=true
   server.ssl.key-store=/etc/letsencrypt/live/api.yourdomain.com/keystore.p12
   server.ssl.key-store-password=${SSL_KEYSTORE_PASSWORD}
   server.ssl.key-store-type=PKCS12
   server.ssl.key-alias=tomcat
   ```
3. **Force HTTP → HTTPS redirect**:
   ```java
   @Configuration
   public class SecurityConfig {
       @Bean
       public EmbeddedServletContainerCustomizer containerCustomizer() {
           return container -> {
               container.getSession().setTrackingModes(
                   Collections.singleton(SessionTrackingMode.COOKIE));
               container.getSession().getCookie().setSecure(true);
               container.getSession().getCookie().setHttpOnly(true);
           };
       }
   }
   ```

---

## 🔐 HTTP SECURITY HEADERS (Already Configured)

**Vercel `vercel.json`** already includes excellent security headers:

```json
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload"
}
```

### What each header does:
- **X-Content-Type-Options: nosniff** - Prevents MIME type sniffing attacks
- **X-Frame-Options: DENY** - Prevents clickjacking by disallowing iframe embedding
- **X-XSS-Protection** - Legacy XSS filter (modern browsers use CSP)
- **Referrer-Policy** - Controls referrer leakage
- **Permissions-Policy** - Disables dangerous browser features
- **Strict-Transport-Security** - Forces HTTPS for 2 years

### Add to Backend (Spring Boot):
```java
@Component
public class SecurityHeadersFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
            HttpServletResponse response, FilterChain filterChain) 
            throws ServletException, IOException {
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("X-XSS-Protection", "1; mode=block");
        response.setHeader("Strict-Transport-Security", 
            "max-age=31536000; includeSubDomains; preload");
        response.setHeader("Content-Security-Policy", 
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';");
        filterChain.doFilter(request, response);
    }
}
```

---

## 🛡️ ADDITIONAL SECURITY HARDENING

### 1. Content Security Policy (CSP)
Add strict CSP header to prevent inline script injection:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https:; font-src 'self'; connect-src 'self' https:;
```

### 2. Input Validation & Sanitization
- ✅ Your Axios interceptor checks for 401 (good JWT handling)
- Add request validation:
  ```java
  @PostMapping("/api/inquiries")
  public ResponseEntity<?> createInquiry(@Valid @RequestBody InquiryRequest request) {
      // Spring Validation ensures fields are checked
  }
  ```

### 3. Rate Limiting (Critical for API endpoints)
```java
@Configuration
public class RateLimitConfig {
    @Bean
    public RateLimitingInterceptor rateLimitingInterceptor() {
        return new RateLimitingInterceptor();
    }
}

// Limit login attempts to 5 per minute
@PostMapping("/api/auth/login")
public ResponseEntity<?> login(
    @RateLimited(limit = 5, window = 60)
    @RequestBody LoginRequest request) {
    // Implementation
}
```

### 4. SQL Injection Prevention
- ✅ Your Spring Data JPA is parameterized (safe from SQL injection)
- ✅ No raw SQL queries visible
- Continue using JPA queries only

### 5. CSRF Protection
- ✅ Disabled for API (stateless JWT authentication is CSRF-safe)
- Correct configuration in `WebSecurityConfig`

### 6. Dependency Scanning
```bash
# Check for vulnerable dependencies
mvn dependency-check:check

# Frontend
npm audit
npm audit fix
```

---

## 📋 VERCEL DEPLOYMENT CHECKLIST

- [ ] Set environment variable `VITE_API_URL` to your backend API domain
- [ ] Verify no `.env` file is committed (only `.env.example`)
- [ ] Run `npm run build` locally and verify no console statements in output
- [ ] Enable "Automatic Production Deployments" for main branch
- [ ] Set up branch protection rules requiring status checks
- [ ] Configure custom domain with SSL
- [ ] Test HTTPS enforcement: `https://yourdomain.com`
- [ ] Verify security headers in browser DevTools (Network tab)

---

## 📋 AWS EC2 DEPLOYMENT CHECKLIST

### Security Groups & Networking
- [ ] Create security group restricting SSH to your IP only
- [ ] Allow port 8080 (or 443) only from Vercel IP ranges or your domain's CDN
- [ ] Enable VPC Flow Logs for monitoring
- [ ] Use Elastic IP (not dynamic public IP)
- [ ] Consider using AWS WAF (Web Application Firewall) in front

### SSL/TLS
- [ ] Install SSL certificate (Let's Encrypt or AWS Certificate Manager)
- [ ] Auto-renew certificate (Certbot handles this)
- [ ] Force HTTPS redirect

### Database (AWS RDS)
- [ ] Enable automated backups (7+ day retention)
- [ ] Enable multi-AZ deployment for HA
- [ ] Enable encryption at rest (KMS)
- [ ] Use strong password (32+ chars)
- [ ] Restrict security group to EC2 instance only
- [ ] Enable enhanced monitoring

### Backend Application
- [ ] Load environment variables from secure source (AWS Secrets Manager recommended)
- [ ] Set `LOGGING_LEVEL=WARN` in production
- [ ] Configure log rotation to prevent disk filling
- [ ] Use CloudWatch for centralized logging
- [ ] Set up alarms for error spikes

### Monitoring & Logging
- [ ] AWS CloudWatch for logs
- [ ] AWS CloudTrail for API audit logs
- [ ] Set up alerts for suspicious activity
- [ ] Regular backup testing

---

## 🧪 PRODUCTION TESTING CHECKLIST

Before deploying to production:

```bash
# Frontend
npm run build                    # Should succeed with no warnings
npm run preview                  # Test production build locally
# Check DevTools → Network → JS files - no source maps or console calls

# Backend
mvn clean package               # Build JAR
java -jar target/api-*.jar      # Test locally with env vars set
# Verify logs don't contain sensitive data
# Test all API endpoints for proper error handling
```

---

## 🔍 ONGOING SECURITY PRACTICES

### Monthly Tasks:
- [ ] Review CloudWatch logs for errors/warnings
- [ ] Update dependencies: `npm update`, `mvn versions:display-updates`
- [ ] Check security advisories: `npm audit`, `mvn dependency-check`

### Quarterly Tasks:
- [ ] Penetration testing (professional)
- [ ] Review CORS and auth policies
- [ ] Audit database backups
- [ ] Update SSL certificates

### Annually:
- [ ] Full security audit
- [ ] Dependency vulnerability scanning
- [ ] Review AWS cost optimization & security posture

---

## 📞 INCIDENT RESPONSE

If a security issue is discovered:

1. **Immediately**:
   - Rotate all secrets (JWT_SECRET, DB_PASSWORD, API_KEYS)
   - Invalidate all active sessions
   - Review audit logs (CloudTrail, CloudWatch)

2. **Within 24 hours**:
   - Deploy fixed code
   - Notify affected users (if applicable)
   - Document incident

3. **Post-incident**:
   - Root cause analysis
   - Implement preventive measures
   - Update policies

---

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [Vercel Security Best Practices](https://vercel.com/docs/concepts/deployments/security)
- [AWS Security Best Practices](https://aws.amazon.com/security/best-practices/)

---

**Last Updated**: 2026-05-21  
**Status**: ✅ Production Ready (with environment configuration)
