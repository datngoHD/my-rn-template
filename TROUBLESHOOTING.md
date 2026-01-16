# Troubleshooting Guide

## Common Errors and Solutions

### Error: "expected dynamic type 'boolean', but had type 'string'"

**Nguyên nhân:**
- Lỗi này thường xảy ra khi Expo hoặc React Native cố đọc một giá trị boolean từ config nhưng nhận được string
- Có thể do giá trị trong `app.json` bị parse sai
- Hoặc do environment variables được đọc là string thay vì boolean

**Giải pháp:**

1. **Kiểm tra app.json:**
   - Đảm bảo tất cả giá trị boolean là `true` hoặc `false` (không phải string `"true"` hoặc `"false"`)
   - Đã xóa `newArchEnabled` vì có thể gây xung đột

2. **Kiểm tra environment variables:**
   - Tất cả `EXPO_PUBLIC_*` variables là strings
   - Không nên dùng environment variables cho boolean values trực tiếp
   - Nếu cần, phải convert: `process.env.EXPO_PUBLIC_FLAG === 'true'`

3. **Clear cache và rebuild:**
   ```bash
   # Clear Metro bundler cache
   yarn start --clear
   
   # Hoặc
   rm -rf node_modules
   yarn install
   yarn start --clear
   ```

4. **Kiểm tra native modules:**
   - Một số native modules có thể yêu cầu boolean values
   - Đảm bảo các config cho native modules đúng kiểu

### Lỗi khác

Nếu gặp lỗi khác, hãy:
1. Kiểm tra console logs
2. Xem file lỗi cụ thể
3. Clear cache và rebuild
4. Kiểm tra version compatibility


