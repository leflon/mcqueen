
<template>
    <div class="Home-body">
        <h1>Revise easily with <br>
            McQueen Flash Cards 
        </h1>
        <p class="Home-subtitle"> Boost your memory, learn faster, and stay on track — one flashcard at a time.</p>
        <button>Start now !</button>
        <hr>
        
        <h2>Check out the FlashCard</h2>
        <div class="Home-Card-circle">
            <div class="Circle_1"></div>
            <div class="Home-card">
                <p>What is the capital of France ?</p>
            </div>
            <div class="Circle_2">

            </div>
        </div>
        
        <div>
            <button>See answer</button>
            <button>Next Question</button>
        </div>
    </div>
    
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'

onMounted(() => {
  nextTick(() => {
    const cardContainer = document.querySelector('.Home-Card-circle') as HTMLElement
    const circles = document.querySelectorAll('.Circle_1, .Circle_2') as NodeListOf<HTMLElement>
    
    if (cardContainer && circles.length > 0) {
      const rect = cardContainer.getBoundingClientRect()
      circles.forEach(circle => {
        circle.style.top = `${rect.top + window.scrollY}px`
      })
    }
  })
})
</script>

<style scoped>
    .Home-body{
        padding: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    h1,h2{
        color: white;
        text-align: center;
    }

    h2{
        font-size: large;
    }

    .Home-subtitle{
        color:white;

    }

    button{
        background-color: #e9b796;
        border: none;
        padding: 10px;
        border-radius: 10px;
        cursor: pointer;
        margin: 20px;
    }
    
    .Home-card{
        width: 600px;
        height: 300px;
        background-color:#ade1ee;

        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 20px;

    }

    .Home-Card-circle{
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        height: 300px;
        overflow: hidden;
        margin:10px
    }
    
    .Circle_1, .Circle_2{
        width: 300px;
        height: 300px;
        border-radius: 100%;
        background-color: #A64039;
        position: fixed;
        z-index: -1;
    }
    .Circle_1{
        left: -150px; 
    }
    .Circle_2{
        right: -150px; 
    }
    
    hr{
        width: 900px;
        color: white;
        margin: 20px;
    }
    
</style>