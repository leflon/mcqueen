import Base from './base';

export default class User extends Base {
  username!: string;
  password_hash!: string;
}
