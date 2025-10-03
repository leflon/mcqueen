<template>
    <div class="Menu">
        
        
        <RouterLink to="/" class="Menu-Logo">
            <img src="/images/cars-flash-mc-queen-verso.png" alt="Mcqueen">
            <h1>Flash Cards McQueen </h1>
        </RouterLink>
        <RouterLink to="/flashcards">Cards</RouterLink>
    </div>
</template>


<script setup lang="ts">
import { RouterLink } from 'vue-router';

</script>


<style scoped>
    .Menu{
        display: flex;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;
        height: 70px;
        background: blue;
        
    }

    .Menu-Logo{
        display: flex;
        align-items: center;
        gap :20px;
    }

    .Menu-Logo h1{
        font-size: 30px;
    }

    img{
        width: 100px;
        height: auto;
    }
    
    a {
        text-decoration: none;
        color: white;
        font-weight: bold;
        padding: 10px 15px;
        margin: 0 10px;
        border-radius: 5px;
        transition: background-color 0.3s;
    }
    
</style>
