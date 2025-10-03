import Base from './base';
import User from './User';

export default class Container extends Base {
  name!: string;
  owner!: string;
  type!: 'directory' | 'list';
  parent_id?: string;

  getOwner(): User {
    throw Error('Not implemented');
  }

  getParent(): Container | null {
    throw Error('Not implemented');
  }
}
