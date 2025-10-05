<script setup lang="ts">
import McCard from '../components/McCard.vue'
import McButton from '../components/McButton.vue'

import { ref } from 'vue'

const secondsOnCard= ref(0)
const questionNumber= ref(10)

const isRecto= ref(true)

function chronometer() : void {
  setInterval( ()=> { secondsOnCard.value++ }, 1000) 
}

function rectoVerso() : void {
  isRecto.value=false
}


function resetAction() : void {
  secondsOnCard.value=0
  questionNumber.value=1
  isRecto.value=true
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
                <button>Exit</button>
            </div>
        </div>

        <div class="Stats-section">
            <div class="Stats-item">
                <p>Time : {{ secondsOnCard }}</p>
            </div>
            <div class="Stats-item">
                <p>Questions : {{ questionNumber }}</p>
            </div>
        </div>
        
        <!-- Ici j'ai 
        -intégré le composant MyCard dont on peut voir la première création avec ce commit
        -intégré les McButton dont j'ai amélioré le style pour le rendre plus réutilisable
        -j'y ai lié les fonctions de chronomètre et de score ainsi que la gestion des question
        /!\ C'est un prototype qui n'intègre pas du tout le backend, j'ai intégré une question pour faire une preview
        -->
        
        <McCard 
        :recto='isRecto' 
        :rectoText="'What are the four main types of macromolecules in living organisms?'" 
        :versoText="'Carbohydrates, Lipids, Proteins, Nucleic acids'" 
        :questionNumber='questionNumber'
        @cardSeen='chronometer' />
        
      
        <div class="Control-buttons">
        <McButton @click='questionNumber > 1 ? questionNumber-- : ()=>{} '>< previous question</McButton>
        <McButton @click='rectoVerso'>See Answer</McButton>
        <McButton @click='questionNumber++'>Next question ></McButton>
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
