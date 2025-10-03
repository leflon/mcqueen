import Base from '../models/base';
import FlashCard from '../models/FlashCard';

/**
 * Information about a flash card when it's being created by the user.
 */
export type NewFlashCard = Omit<
  Pick<FlashCard, Exclude<keyof FlashCard, keyof Base>>,
  'list_id'
>;
