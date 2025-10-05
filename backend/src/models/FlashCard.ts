import Base from './base';

export default class FlashCard extends Base {
  question_text: string | null = null;
  question_media_id: string | null = null;
  answer_text: string | null = null;
  answer_media_id: string | null = null;
  list_id!: string;
}
