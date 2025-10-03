import Base from './base';

export default class FlashCard extends Base {
  question_text?: string;
  question_media_id?: string;
  answer_text?: string;
  answer_media_id?: string;
  list_id!: string;
}
