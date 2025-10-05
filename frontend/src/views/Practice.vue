<script setup lang="ts">
import McCard from '../components/McCard.vue'
import McButton from '../components/McButton.vue'
import { RouterLink } from 'vue-router';
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()



const secondsOnCard= ref(0)
const questionNumber= ref(1)

const isRecto= ref(true)

function chronometer() : void {
  setInterval( ()=> { secondsOnCard.value++ }, 1000) 
}

function rectoVerso() : void {
  isRecto.value=!isRecto.value
}


function resetAction() : void {
  secondsOnCard.value=0
  questionNumber.value=1
  isRecto.value=true
}

function secondsToMMSS(seconds: number) : string {
  
  return `${Math.floor(seconds/60)}:${ seconds%60 < 10 ? '0'+seconds%60 : seconds%60}`
}

/*
We need to fetch cards

So I need to have a test deck
It seems that there is the following structure for card
          - `id` (TEXT, PRIMARY KEY)
          - `question_text` (TEXT, nullable)
          - `question_media_id` (TEXT, FK → Media.id, nullable)
          - `answer_text` (TEXT, nullable)
          - `answer_media_id` (TEXT, FK → Media.id, nullable)
          - `list_id` (TEXT, NOT NULL, FK → Container.id)
          - `created_at` (INTEGER, NOT NULL)
But in my case, the deck is actually something important,
because we need an attribute "question number" for example,
so I'll try the following:
  The deck is made by fetching all cards with the same `list_id`
  the question number is a local variable for the Practice view, not something stored on the server side 
*/

//trying to do a Flashcard in Typescript like specified in backend's readme
interface Flashcard {
  id: string
  question_text: string | null
  question_media_id: string | null
  answer_text: string | null
  answer_media_id: string | null
  list_id: string
  created_at: number
}


function loadDeckFromBackend() : Flashcard[] {
  /* Cette fonction cherche un deck dans le backend
  Je ne sais pas si elle a besoin de prendre comme argument l'id ou le nom du deck à fetch
  elle doit retourner un tableau de Flashcards qui sera le deck
  pour le moment elle ne fait rien donc pour la demo je vais juste return un tableau créé en dur
  le tableau créé en dur sera remplacé par le code qui fetch dans le backend
  */
  
  
  
  //Local construction, of a deck, should be directly imported with the backend in the future 
  const deck: Flashcard[] = [
    {
      id: '1',
      question_text: 'What are the four main types of macromolecules?',
      question_media_id: null,
      answer_text: 'Carbohydrates, lipids, proteins, nucleic acids.',
      answer_media_id: null,
      list_id: '1',
      created_at: Date.now()
    },
    {
      id: '2',
      question_text: 'What is the function of DNA?',
      question_media_id: null,
      answer_text: 'DNA stores and transmits genetic information.',
      answer_media_id: null,
      list_id: '1',
      created_at: Date.now()
    }
  ]
  
  return deck
}

const deck=ref<Flashcard[]>([])

deck.value= loadDeckFromBackend()

function exit() : void {
  router.push('/flashcards')
}

</script>

<template>

    <!-- Je ne sais pas si cela servirait de mettre tous les titres etc en composants 
    Je pense d'abord tester le backend    -->
    <div class="Practice-page">
        <h1>Practice</h1>
        
        <div class="Title-section">
            <h2>Biology</h2>
            <div class="Title-buttons">
                <button @click="resetAction">Reset</button>
                <button @click='exit'>Exit</button>
                
            </div>
        </div>

        <div class="Stats-section">
            <div class="Stats-item">
                <p>{{ secondsToMMSS(secondsOnCard) }}</p>
            </div>
            <div class="Stats-item">
                <p>Question : {{ questionNumber }}</p>
            </div>
        </div>
        
        <!-- 
          - `id` (TEXT, PRIMARY KEY)
          - `question_text` (TEXT, nullable)
          - `question_media_id` (TEXT, FK → Media.id, nullable)
          - `answer_text` (TEXT, nullable)
          - `answer_media_id` (TEXT, FK → Media.id, nullable)
          - `list_id` (TEXT, NOT NULL, FK → Container.id)
          - `created_at` (INTEGER, NOT NULL)
        -->
        
        <McCard 
        v-if="deck[questionNumber-1]"
        :recto='isRecto' 
        :rectoText='deck[questionNumber-1].question_text' 
        :versoText='deck[questionNumber-1].answer_text' 
        :questionNumber='questionNumber'
        @cardSeen='chronometer' />
        
      
        <div class="Control-buttons">
        <McButton variant='nextQuestion' @click="questionNumber > 1 ? (questionNumber--, isRecto=true) : null">< previous question</McButton>
        <McButton variant='nextQuestion' @click='rectoVerso'>See Answer</McButton>
        <McButton variant='nextQuestion' @click="questionNumber == deck.length ? null : (questionNumber++,isRecto=true)">Next question ></McButton>
        </div>

    </div>
</template>

<style scoped>
.Practice-page {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px;
}

.Practice-page h1 {
    color: white;
    font-size: 48px;
    margin: 0;
    font-weight: bold;
}

.Title-section {
    background-color: #e9b796;
    width: 90%;
    max-width: 800px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 40px;
    border-radius: 15px;
}

.Title-section h2 {
    color: black;
    font-size: 36px;
    margin: 0;
    font-weight: bold;
}

.Title-buttons {
    display: flex;
    gap: 15px;
    position: absolute;
    transform: translateX(300px);
}

.Title-buttons button {
    background-color: transparent;
    border: 2px solid black;
    color: black;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
}

.Stats-section {
    width: 90%;
    max-width: 800px;
    display: flex;
    justify-content: space-between;
}

.Stats-item {
    background-color: #A64039;
    color: white;
    padding: 15px 30px;
    border-radius: 10px;
    flex: 1;
    margin: 0 10px;
    text-align: center;
}

.Stats-item p {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
}

.Question-card {
    background-color: #ade1ee;
    width: 90%;
    max-width: 800px;
    min-height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
    border-radius: 20px;
    text-align: center;
}

.Question-card h3 {
    color: black;
    font-size: 24px;
    margin: 0 0 30px 0;
    font-weight: bold;
}

.Question-card p {
    color: black;
    font-size: 20px;
    margin: 0;
    line-height: 1.4;
}

.Control-buttons {
    display: flex;
    gap: 20px;
    margin-top: 20px;
}

.Control-buttons button {
    background-color: #e9b796;
    border: none;
    color: black;
    padding: 15px 25px;
    border-radius: 10px;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    min-width: 150px;
}

.See-answer-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}
</style>
