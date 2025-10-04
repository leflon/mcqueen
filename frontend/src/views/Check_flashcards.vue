<template>
    <div class="Check-flascard-page">
        <h1>Check FlashCards</h1>
        <div class="Search-bar">
            <input type="text" placeholder="Search a flashcard" >
            <button>Search</button>
        </div>
        <button class="Create-button">Create flashcard</button>
        <div class="Container-Category-Cards">
            <div class="Category-card">
                <h4>Biology</h4>
                <div class="Blue-card">
                    <p>This is a question</p>
                </div>
                <div class="Practice-Edit-buttons">
                    <button>Practice</button>
                    <button>Edit</button>
                </div>
            </div>
            <div class="Category-card">
                <h4>Biology</h4>
                <div class="Blue-card">
                    <p>This is a question</p>
                </div>
                <div class="Practice-Edit-buttons">
                    <button>Practice</button>
                    <button>Edit</button>
                </div>
            </div>
            <div class="Category-card">
                <h4>Biology</h4>
                <div class="Blue-card">
                    <p>This is a question</p>
                </div>
                <div class="Practice-Edit-buttons">
                    <button>Practice</button>
                    <button>Edit</button>
                </div>
            </div>
        </div>
        
    </div>
    
</template>

<script setup lang="ts">
    
</script>


<style scoped>

    .Check-flascard-page{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 15px;

        padding-bottom: 30px;
    }

    h1,h2{
        color: white;
        text-align: center;
    }

    

    .Search-bar{
        height: 40px;
        display: flex;
    }

    .Search-bar input{
        width: 350px;
        height: 100%;
        border-radius: 10px 0 0 10px;
        border: none;
        outline: none;
        padding-left: 10px;
        padding-right: 10px;
        font-family: "Inter";
        font-size: large;
        box-sizing: border-box;
    }

    .Search-bar button{
        height: 100%;
        width: 100px;
        border: none;
        border-radius: 0 10px 10px 0;
        box-sizing: border-box;

        
    }

    .Create-button{
        background-color: #e9b796;
        height: 40px;
        width: 300px;
        border-radius: 10px;

        font-size: large;
    }

    .Container-Category-Cards{
        justify-items: center;
        display: grid;
        grid-template-columns: repeat(3, 1fr); 
        gap: 20px;
        width: 100%;
        margin-top: 10px;
    }

    .Category-card{
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .Category-card h4{
        font-size: 30px;
        color: white;

    }   

    .Blue-card{
        width: 300px;
        height: 180px;
        background-color: #ade1ee;

        display: flex;
        justify-content: center;
        align-items: center;
        
        border-radius: 20px;

        margin: 8px;
    }

    .Practice-Edit-buttons{
        display: flex;
        gap: 20px;
    }

    .Practice-Edit-buttons button{
        background-color: #e9b796;
        height: 40px;
        min-width: 100px;
        border-radius: 10px;
    }


    
</style>