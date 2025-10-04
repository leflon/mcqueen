<template>
    <div class="Practice-page">
        <h1>Practice</h1>
        
        <div class="Title-section">
            <h2>Biology</h2>
            <div class="Title-buttons">
                <button>Reset</button>
                <button>Exit</button>
            </div>
        </div>

        <div class="Stats-section">
            <div class="Stats-item">
                <p>Time : 69 seconds</p>
            </div>
            <div class="Stats-item">
                <p>Questions : 10</p>
            </div>
        </div>

        <div class="Question-card">
            <h3>Question : 2</h3>
            <p>What are the four main types of macromolecules in living organisms?</p>
        </div>

        <div class="Control-buttons">
            <button class="Previous-btn">< Previous question</button>
            <button class="See-answer-btn">See answer</button>
            <button class="Next-btn">Next question ></button>
        </div>
    </div>
</template>

<script lang="ts">

</script>

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