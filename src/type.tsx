export interface ILink {
  platform: string;
  link: string;
  _id?: string;
}

export interface IFormInput {
  links: ILink[];
}

export interface IUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  profileImg?: string;
  links?: ILink[];
}

export interface IUserInfoFormInput {
  profileImg: File[] | null;
  firstName: string;
  lastName: string;
  email: string | null;
}

export interface ILogInFormInput {
  email: string;
  password: string;
}

export interface IRegisterFormInput {
  email: string;
  password: string;
  confirmPassword: string;
}
