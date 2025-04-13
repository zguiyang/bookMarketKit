export class AuthRegisterDTO {
  username: string;
  email: string;
  password: string;
  emailCode: string;
}

export class AuthLoginDTO {
  email: string;
  password: string;
}
