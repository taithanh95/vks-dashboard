// Gõ lệnh 'ng s' để chạy môi trường BE mặc định --> http://45.122.253.178:8989/
// Gõ lệnh 'ng s -c localhost' để chạy môi trường BE --> http://localhost:8989/
// Gõ lệnh 'ng s -c dev' để chạy môi trường BE --> http://45.122.253.178:8989/
// Gõ lệnh 'ng s -c uat' để chạy môi trường BE --> https://gateway.vksndtc.gov.vn/
// Gõ lệnh 'ng s -c live' để chạy môi trường BE --> https://gateway.vksndtc.gov.vn/

export const environment = {
  production: false,
  GATEWAY_URI: 'http://localhost:8989/',
  QUANLYAN_URI: 'http://localhost:4100/#/',
  DOMAIN: 'localhost'
};
