import Container from '../models/Container';

/**
 * Arboresernce of a user's flash card lists
 */
export type UserContent = {
  id: string;
  lists: Partial<Container>[];
  directories: UserContent[];
};
