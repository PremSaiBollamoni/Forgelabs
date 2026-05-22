# 🚀 Production Deployment Guide

## Quick Summary of Security Hardening Completed

✅ **All console.log/error statements removed** from frontend (11 files)  
✅ **Backend System.out.println replaced** with proper logging (InitialDataSeeder.java)  
✅ **Hardcoded backend IP removed** from vercel.json (CRITICAL FIX)  
✅ **Vite production build optimized** (source maps disabled, minified, console stripped)  
✅ **Backend logging configured** (WARN level, no SQL queries, no stack traces)  
✅ **Security headers already in place** (vercel.json)  
✅ **JWT implementation verified** (HS512, environment-based secrets)  
✅ **CORS configuration verified** (environment-based allowed origins)  

---

## 📦 Step-by-Step Deployment

### STEP 1: Prepare Environment Variables

#### **Frontend (.env files)**
```bash
# .env.production (used during build on Vercel)
VITE_API_URL=https://api.yourdomain.com
```

#### **Backend (.env file on EC2)**
Create `/opt/forgelabs/.env`:
```bash
# Database
DB_HOST=your-rds-endpoint.amazonaws.com
DB_PORT=3306
DB_NAME=forgelabs_production
DB_USERNAME=admin_user
DB_PASSWORD=YOUR_STRONG_32_CHAR_PASSWORD

# JWT (generate with: openssl rand -base64 32)
JWT_SECRET=YOUR_STRONG_64_CHAR_JWT_SECRET
JWT_EXPIRATION=604800000

# CORS
FRONTEND_URL=https://www.yourdomain.com,https://yourdomain.com

# Encryption
ENCRYPTION_KEY=YOUR_32_CHAR_ENCRYPTION_KEY

# Claude API (if using AI features)
CLAUDE_API_KEY=sk-ant-api03-...
```

---

### STEP 2: Deploy Frontend to Vercel

#### **Option A: Using Vercel Dashboard**
1. Go to **Project Settings** → **Environment Variables**
2. Add `VITE_API_URL = https://api.yourdomain.com` (Production)
3. Commit to git main branch
4. Vercel auto-deploys (or manually trigger)

#### **Option B: Using Vercel CLI**
```bash
npm install -g vercel
vercel --prod --env VITE_API_URL=https://api.yourdomain.com
```

#### **Verify Production Build**
```bash
npm run build
# Check dist/ folder for:
# ✅ No .map files (source maps removed)
# ✅ Minified JS files
# ✅ No console statements in output
```

---

### STEP 3: Deploy Backend to AWS EC2

#### **Build JAR**
```bash
cd backend
mvn clean package -DskipTests
```

#### **Copy to EC2**
```bash
scp -i your-key.pem target/forgelabs-api-1.0.0.jar ec2-user@your-ec2-ip:/opt/forgelabs/
```

#### **On EC2 Instance**
```bash
# Install Java 17+ (if not already)
sudo yum install java-17-amazon-corretto -y

# Create systemd service
sudo tee /etc/systemd/system/forgelabs.service > /dev/null <<EOF
[Unit]
Description=ForgeLabs API
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/forgelabs
EnvironmentFile=/opt/forgelabs/.env
ExecStart=/usr/bin/java -jar forgelabs-api-1.0.0.jar
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable forgelabs
sudo systemctl start forgelabs

# Check status
sudo systemctl status forgelabs

# View logs
sudo journalctl -u forgelabs -f
```

---

### STEP 4: Setup SSL/TLS (Vercel + EC2)

#### **Vercel**
- ✅ Automatic HTTPS (free SSL from Let's Encrypt)
- Already configured in `vercel.json`

#### **EC2 (for API domain)**
```bash
# Install Certbot
sudo yum install certbot -y

# Get certificate
sudo certbot certonly --standalone \
  -d api.yourdomain.com \
  --email your-email@example.com \
  -n --agree-tos

# Auto-renew (runs daily)
sudo systemctl enable certbot-renew
sudo systemctl start certbot-renew
```

#### **Configure Spring Boot for HTTPS**
```bash
# Convert cert to PKCS12 for Java
sudo openssl pkcs12 -export \
  -in /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem \
  -inkey /etc/letsencrypt/live/api.yourdomain.com/privkey.pem \
  -out /opt/forgelabs/keystore.p12 \
  -name tomcat \
  -password pass:your-keystore-password
```

Update `application.properties`:
```properties
server.port=443
server.ssl.enabled=true
server.ssl.key-store=/opt/forgelabs/keystore.p12
server.ssl.key-store-password=${SSL_KEYSTORE_PASSWORD}
server.ssl.key-store-type=PKCS12
server.ssl.key-alias=tomcat
server.http2.enabled=true
```

---

### STEP 5: Security Group & Firewall Configuration

#### **AWS Security Group**
```
Inbound Rules:
✅ SSH (22) - from your IP only
✅ HTTP (80) - from 0.0.0.0/0 (for cert renewal)
✅ HTTPS (443) - from 0.0.0.0/0
✅ Custom TCP (8080) - from Vercel IP ranges (optional, if not using HTTPS)

Outbound Rules:
✅ All traffic
```

#### **EC2 Firewall (if using UFW)**
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

---

### STEP 6: Database Setup (AWS RDS MySQL)

#### **Connect and Initialize**
```bash
mysql -h your-rds-endpoint.amazonaws.com -u admin_user -p

# Create database
CREATE DATABASE forgelabs_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Verify connection from EC2
mysql -h your-rds-endpoint.amazonaws.com -u admin_user -p -e "SHOW DATABASES;"
```

#### **Spring Boot Auto-Migration**
- Set in `application.properties`:
  ```properties
  spring.jpa.hibernate.ddl-auto=update  # Auto-creates tables on startup
  ```
- First deployment will create all tables automatically

---

### STEP 7: Post-Deployment Verification

#### **Frontend**
```bash
# Test HTTPS
curl -I https://yourdomain.com
# Should return 200 OK

# Check security headers
curl -I https://yourdomain.com
# Look for: X-Content-Type-Options, X-Frame-Options, HSTS

# Verify no source maps
curl https://yourdomain.com/assets/main.*.js
# Should be minified with no readable code
```

#### **Backend API**
```bash
# Test API health
curl -X GET https://api.yourdomain.com/api/auth/me
# Should return 401 (unauthorized, as expected without JWT)

# Test database connectivity
curl -X GET https://api.yourdomain.com/api/settings
# Should return data from database

# Check logs for no errors
sudo journalctl -u forgelabs -n 50
```

#### **Database**
```bash
# Verify RDS security group
# EC2 should be able to reach database
mysql -h your-rds-endpoint.amazonaws.com -u admin_user -p -D forgelabs_production -e "SELECT COUNT(*) FROM admin_user;"
```

---

## 🔐 Production Security Verification Checklist

- [ ] **Environment Variables**: All secrets in `.env` file (not in git)
- [ ] **Frontend**: No console statements in minified JS
- [ ] **Backend**: Logs set to WARN level, no SQL queries
- [ ] **HTTPS**: Both frontend and API use HTTPS only
- [ ] **Security Headers**: X-Frame-Options, X-Content-Type-Options present
- [ ] **JWT Secret**: Strong 64+ character secret from environment
- [ ] **Database**: AWS RDS with encryption, strong password, restricted access
- [ ] **CORS**: Only your production domain allowed
- [ ] **Backups**: RDS automated backups enabled (7+ days)
- [ ] **Monitoring**: CloudWatch logs configured
- [ ] **Dependencies**: `npm audit` and `mvn dependency-check` passing

---

## 🚨 Common Deployment Issues & Fixes

### Issue: "Mixed Content" Error (HTTP API called from HTTPS frontend)
**Solution**: Ensure API uses HTTPS
```
Error: Loading mixed-content (HTTP resource from HTTPS page)
Fix: Update VITE_API_URL to https:// in Vercel environment
```

### Issue: "CORS Error" - Cross-Origin Request Blocked
**Solution**: Verify CORS config matches production domain
```properties
app.cors.allowed-origins=https://yourdomain.com
# NOT: app.cors.allowed-origins=yourdomain.com (missing https://)
```

### Issue: Database Connection Timeout
**Solution**: Verify RDS security group
```bash
# From EC2, test RDS connectivity
mysql -h your-rds-endpoint.amazonaws.com -u admin_user -p -D forgelabs_production -e "SELECT 1;"
# If fails, check RDS security group allows EC2 instance
```

### Issue: "JWT Secret Not Set" Error
**Solution**: Ensure .env file is loaded
```bash
# Verify service reads environment
sudo journalctl -u forgelabs | grep "app.jwt"

# Or manually source before starting
source /opt/forgelabs/.env && java -jar forgelabs-api-1.0.0.jar
```

---

## 📊 Production Monitoring

### Set Up CloudWatch Logs (AWS)
```bash
# View real-time logs
aws logs tail /aws/ec2/forgelabs --follow

# View error spikes
aws logs insights --query '
  fields @timestamp, @message
  | filter @message like /ERROR/
  | stats count() by bin(5m)
'
```

### Uptime Monitoring
```bash
# Health check endpoint (create if needed)
curl https://api.yourdomain.com/api/health
```

### Performance Monitoring
```bash
# Monitor request latency
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApplicationELB \
  --metric-name TargetResponseTime \
  --statistics Average
```

---

## 🔄 Rollback Plan

If production deployment fails:

```bash
# Keep previous JAR version
mv forgelabs-api-1.0.0.jar forgelabs-api-1.0.0.jar.backup
mv forgelabs-api-0.9.9.jar.backup forgelabs-api-0.9.9.jar

# Restart with previous version
sudo systemctl restart forgelabs

# Check logs
sudo journalctl -u forgelabs -f
```

---

## 📚 Further Reading

- [PRODUCTION_SECURITY_CHECKLIST.md](./PRODUCTION_SECURITY_CHECKLIST.md) - Comprehensive security guide
- [.env.example](./.env.example) - Environment variable template
- [Vercel Docs](https://vercel.com/docs) - Frontend deployment best practices
- [Spring Boot Production](https://spring.io/blog/2015/06/17/logging-into-the-enterprise/) - Logging configuration
- [AWS RDS Best Practices](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html)

---

**Status**: ✅ Ready for Production Deployment  
**Last Updated**: 2026-05-21
