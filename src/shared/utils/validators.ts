const USERNAME_PATTERN = /^[A-Za-z0-9_]+$/;
const MIN_PASSWORD_LENGTH = 6;

// hàm check hợp lệ tên ng dùng
export function isValidUsername(username: string): boolean {
  return USERNAME_PATTERN.test(username);
}

// hàm check hợp lệ của mật khẩu
export function isValidPassword(password: string): boolean {
  return password.length >= MIN_PASSWORD_LENGTH;
}

// hàm check hợp lệ của cả mật khẩu và tên ng dùng
export function validateAuth(username: string, password: string): string[] {
  const errors: string[] = [];

  if (!isValidUsername(username)) {
    errors.push("Cảnh báo: Chỉ có chữ, số, và gạch dưới mới được phép.");
  }

  if (!isValidPassword(password)) {
    errors.push(`Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`);
  }

  return errors;
}
