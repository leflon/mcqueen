<template>
    <div class="Edit-mode-page">
        <div class="Side-bar" :class="{ display: hide_sidebar, hidden: !hide_sidebar}">
            <div class="Side-bar-content" :class="{ display: hide_sidebar, hidden: !hide_sidebar }">
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
        <div class="Edit-Mode-section" :class="{ display: hide_sidebar, hidden: !hide_sidebar}">
            <h1>Edit mode</h1>
            <input type="text" placeholder="Change flascard title...">
            <div class="Edit-Mode-Buttons">
                <button>Delete all</button>
                <button>Save</button>
            </div>
            
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
        justify-content: center;
    }

    /* Sidebar styles */
    .Side-bar.display{
        width: 20%;
        display: flex;
        border-radius: 10px;
        padding-top: 10px;

    }

    .Side-bar.hidden{
        width: 2%;
        display: flex;
    }

    .Side-bar.display>button{
        width: 5%;
        background-color: #525252;
        border-radius: 0px 10px 10px 0;
        color: white;
        font-weight: bold;
    }

    .Side-bar.display>button div{
        display: flex;
        flex-direction: column;
        gap: 100px;
    }


    .Side-bar.hidden>button {
        
        width: 100%;
        color: black;
        border-radius: 0px 10px 10px 0;
    }

    .Side-bar.hidden>button div{
        display: flex;
        flex-direction: column;
        gap: 100px;
    }

    

    .Side-bar-content.display{
        background-color: #ade1ee;

        width: 95%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 50px;
        padding-top: 30px;
        transition: ease-in-out;
    }
    .Side-bar-content.hidden{
        display: none;
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

    .Edit-Mode-section.hidden{
        width: 98%;
        
    }

    .Edit-Mode-section{
        width: 80%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
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

    .Edit-Mode-Buttons{
        display: flex;
        gap: 15px;
    }

    .Edit-Mode-Buttons button{
        min-width: 200px;
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