# Hệ thống báo cáo quản lý án - Viện kiểm sát nhân dân tối cao
# Chạy lệnh sau để start ở môi trường localhost(môi trường mặc định) (config ở file environment.localhost.ts --> BE call vào API http://localhost:8989/**)
# Ứng dụng sẽ được start với đường dẫn mặc định http://localhost:4200

ng s
hoặc
ng s -c localhost

# Chạy lệnh sau để start ở môi trường dev (config ở file environment.ts --> BE call vào API http://45.122.253.178:8989/**)
# Ứng dụng sẽ được start với đường dẫn mặc định http://localhost:4200

ng s -c dev

# Chạy lệnh sau để start ở môi trường UAT (config ở file environment.uat.ts --> BE call vào API https://gateway.vksndtc.gov.vn/**)
# Ứng dụng sẽ được start với đường dẫn mặc định http://localhost:4200

ng s -c uat

# Chạy lệnh sau để start ở môi trường live (config ở file environment.live.ts --> BE call vào API https://gateway.vksndtc.gov.vn/**)
# Ứng dụng sẽ được start với đường dẫn mặc định http://localhost:4200

ng s -c live

----
# Cấu hình môi trường phát triển project Dashboard 
node: v12.22.12
npm: 6.14.16
angular cli: 9.1.13
