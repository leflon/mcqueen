<template>
    <div class="Check-flascard-page">
        <h1>Check FlashCards</h1>
        
        <div class="Search-bar">
            <div class="Search-input">
                <input type="text" placeholder="Search a flashcard" v-model="search_input">
                <button @click="update_list_on_search">Search</button>
            </div>
            <button class="Search-bar-reset" @click="reset_search">Reset</button>
        </div>
        
        <button class="Create-button" @click="()=>router.push('/creation_mode')">Create flashcard</button>

        <div class="Container-Category-Cards">
            <div class="Category-card" v-for="value in filtered_list_flascards" :key="value['id']">
                <h4>{{ value["name"] }}</h4>

                <div class="Blue-card">
                    <p>{{ value.first_question }}</p>
                </div>

                <div class="Practice-Edit-buttons">
                    <button @click="()=>router.push(`/practice/${value['id']}`)">Practice</button>
                    <button @click="()=>router.push(`/edit_mode/${value['id']}`)">Edit</button>
                </div>
            </div>
            <h2 v-if="filtered_list_flascards.length ===0 &&list_flascards.length>0"> No results</h2>
            <h2 v-if="list_flascards.length ===0">No Cards created</h2>
        </div>
        
    </div>
    
</template>

<script setup lang="ts">

import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue';
import { api } from '../lib/api'   

const router = useRouter()
const loading = ref(false)
const list_flascards = ref<any[]>([])

const search_input = ref("")

const filtered_list_flascards = ref<any[]>([])

function update_list_on_search(){
    if(search_input.value !==""){
        filtered_list_flascards.value = list_flascards.value.filter((card: any) =>
        card.name.toLowerCase().startsWith(search_input.value.toLowerCase())
    );
    }else{
        filtered_list_flascards.value = list_flascards.value
    }
    
}

function reset_search(){
    search_input.value = "";
    filtered_list_flascards.value = list_flascards.value
}



async function get_lists() {
    try {
        const data = await api('/user-content/collections', 'GET')
        
        const listsWithQuestions = await Promise.all(data.lists.map(async (list: any) => {
            const question = await get_first_question(list.id)
            return { ...list, first_question: question }
        }))
        
        list_flascards.value = listsWithQuestions
        filtered_list_flascards.value = listsWithQuestions 

    } catch (err) {
        console.error(err)
    }
    finally {
        loading.value = false
    }
}

async function get_first_question(list_id: string) {
    try {
        const data = await api(`/user-content/flashcards/${list_id}`, 'GET')
        let flashcards = data["flashcards"]
        if (!flashcards || flashcards.length === 0) {
            return "No questions in this flashcard"
        }
        return flashcards[0]['question_text']
        

    } catch (error) {
        console.log(error)
        return "Error loading question"
    }
    
}




onMounted(()=>{
    get_lists()
})

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
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: center;
        height: 40px;
    }

    .Search-bar-reset{
        width: 100px;
        height: 100%;
        border-radius: 10px;

    }

    .Search-input{
        height: 40px;
        display: flex;
    }

    .Search-input input{
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

    .Search-input button{
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