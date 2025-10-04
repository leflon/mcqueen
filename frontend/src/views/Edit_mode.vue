<template>
    <div class="Edit-mode-page">
        <div class="Side-bar" :class="{ 'sidebar-collapsed': hide_sidebar }">
            <div class="Side-bar-content" :class="{ hidden: hide_sidebar }">
                <h2>Your FlashCards</h2>

                <ul>
                    <li><h3>Physics</h3></li>
                    
                    <li><h3>Biology</h3></li>
                    
                    <li><h3>Maths</h3></li>
                    
                </ul>
                <button >Add more +</button>
            </div>
            
            <button class="hide-display-button" @click="toggle_sidebar">
                <div>
                    <p>{{ hide_sidebar? ">"  : "<"  }}</p>
                    <p>{{ hide_sidebar? ">"  : "<"  }}</p>
                </div>
            </button>
        </div>
        <div class="Edit-Mode-section" :class="{ 'content-expanded': hide_sidebar }">
            <h1>Edit mode</h1>
            <input type="text" placeholder="Change flascard title...">
            <button>Delete all</button>
            <div class="Card-section">
                <div class="Add-card-section">
                    <div >
                        <p>Question</p>
                        <textarea placeholder="Insert a question"></textarea>
                    </div>
                    <div >
                        <p>Answer</p>
                        <textarea placeholder="Insert an answer"></textarea>
                    </div>
                    <div>
                        <button>
                            Add FlashCard +
                        </button>
                    </div>
                    
                </div>

                <div class="Single-Card-section">
                    <div >
                        <p>Question</p>
                        <textarea placeholder="Insert a question"></textarea>
                    </div>
                    <div >
                        <p>Answer</p>
                        <textarea placeholder="Insert an answer"></textarea>
                    </div>
                    <div>
                        <div class="Card-buttons">
                            <button>Save</button>
                            <button>Delete</button>
                        </div>
                    </div>
                    
                    
                </div>
            </div>
            
        </div>

    </div>
    
    
</template>

<script setup lang="ts">
import { ref } from 'vue';

const hide_sidebar = ref(false)

function toggle_sidebar(){
    hide_sidebar.value = !hide_sidebar.value
}

</script>

<style scoped>
    .Edit-mode-page{
        width: 100%;
        min-height: 550px;
        display: flex;
        justify-content: flex-start;
    }

    /* Sidebar styles */
    .Side-bar{
        width: 20%;
        display: flex;
        border-radius: 10px;
        padding-top: 10px;
        transition: width 0.4s ease, padding 0.4s ease;
    }

    .Side-bar.sidebar-collapsed{
        width: 40px; /* Just the toggle button width */
        padding-top: 0;
        padding-left: 0;
        padding-right: 0;
        border-radius: 0;
    }

    .Side-bar>button{
        width: 5%;
        background-color: #525252;
        border-radius: 0px 10px 10px 0;
        color: white;
        font-weight: bold;
        transition: width 0.4s ease, border-radius 0.4s ease;
    }

    .sidebar-collapsed .Side-bar>button{
        width: 100%;
        border-radius: 0px 5px 5px 0;
    }

    .Side-bar>button div{
        display: flex;
        flex-direction: column;
        gap: 100px;
    }

    .Side-bar-content {
        background-color: #ade1ee;
        width: 95%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 50px;
        padding-top: 30px;
        max-height: 600px;
        opacity: 1;
        overflow: hidden;
        border-radius: 10px 0 0 10px;
        transition: max-height 0.4s ease, opacity 0.4s ease, padding 0.4s ease;
    }

    .Side-bar-content.hidden{
        max-height: 0;
        opacity: 0;
        pointer-events: none;
        padding-top: 0;
        padding-bottom: 0;
        width: 0;
        overflow: hidden;
    }

    .Side-bar-content ul{
        background-color: #e9b796;
        padding: 10px;
        list-style: none;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .Side-bar-content li{
        text-align: center;
        width: 90%;
        height: 40px;
        border-bottom: 2px solid black;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .Side-bar-content li:last-child{
        border:none
    }

    .Side-bar-content button{
        background-color: #862922;
        font-family: "Outfit";
        height: 40px;
        width: 150px;
        font-size: 20px;
        color: white;
        border-radius: 10px;
    }

    

    /* Main content section */
    .Edit-Mode-section{
        width: 80%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        transition: width 0.4s ease;
    }

    .Edit-Mode-section.content-expanded{
        width: calc(100% - 50px); /* Take full width minus toggle button space */
    }

    .Edit-Mode-section h1{
        color: white;
    }

    .Edit-Mode-section > input{
        font-size: large;
        text-align: center;
        border: none;
        border-radius: 10px;
        height: 40px;
        font-weight: bold;
        width: 300px;
    }

    .Edit-Mode-section > button{
        min-width: 300px;
        height: 40px;
        background-color: #e9b796;
        border-radius: 10px;
    }

    .Card-section{
        width: 90%;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .Add-card-section, .Single-Card-section{
        width: 100%;
        min-height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        border-radius: 20px;
        padding: 20px;
    }

    .Add-card-section{
        background-color: #C2C2C2;
    }

    .Single-Card-section{
        background-color: #ade1ee;
    }

    .Add-card-section > div, .Single-Card-section > div{
        width: 30%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }

    .Add-card-section textarea, .Single-Card-section textarea{
        height: 60px;
        width: 100%;
        max-width: 220px;
        outline: none;
        resize: none; 
        border: none;
        border-radius: 5px;
        padding: 5px;
    }

    p{
        font-weight: bold;
    }

    .Card-section button{
        height: 40px;
        background-color: #e9b796;
        border-radius: 10px;
    }

    .Add-card-section button{
        width: 200px;
    }

    .Card-buttons{
        display: flex;
        flex-direction: row;
        gap: 10px;
        justify-content: center;
        align-items: center;
    }

    .Card-buttons button{
        width: 80px;
        min-width: 80px;
    }
</style>