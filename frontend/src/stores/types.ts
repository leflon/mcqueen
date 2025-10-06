export interface User {
  id: number;
  username: string;
}

export interface Flashcard {
  id: string;
  question_text: string | null;
  question_media_id: string | null;
  answer_text: string | null;
  answer_media_id: string | null;
  list_id: string;
  created_at: number;
}

export interface FlashcardList {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: number;
}

export interface CreateFlashcardData {
  question_text: string | null;
  question_media_id: string | null;
  answer_text: string | null;
  answer_media_id: string | null;
}

export interface UpdateFlashcardData {
  question_text?: string | null;
  question_media_id?: string | null;
  answer_text?: string | null;
  answer_media_id?: string | null;
}
