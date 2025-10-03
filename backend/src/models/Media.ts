import Base from './base';
import User from './User';

export default class Media extends Base {
  file!: string;
  owner!: string;
  type!: 'image' | 'video' | 'audio';

  getOwner(): User {
    throw Error('Not implemented');
  }
}
