<template>
  <div class="Creation-mode-page">
    <div
      v-if="others_list_infos.length !== 0"
      class="Side-bar"
      :class="{ display: hide_sidebar, hidden: !hide_sidebar }"
    >
      <div
        class="Side-bar-content"
        :class="{ display: hide_sidebar, hidden: !hide_sidebar }"
      >
        <h2>Your FlashCards</h2>

        <ul>
          <li
            v-for="value in others_list_infos"
            :key="value['id']"
            @click="navigate_to_other_lists(value['id'])"
            style="cursor: pointer"
          >
            <h3>{{ value['name'] }}</h3>
          </li>
        </ul>
      </div>

      <button class="hide-display-button" @click="toggle_sidebar">
        <div>
          <p>{{ hide_sidebar ? '>' : '<' }}</p>
          <p>{{ hide_sidebar ? '>' : '<' }}</p>
        </div>
      </button>
    </div>
    <div
      class="Creation-mode-section"
      :class="{ display: hide_sidebar, hidden: !hide_sidebar }"
    >
      <h1>Create New List</h1>
      <input
        type="text"
        placeholder="Enter list name..."
        v-model="new_list_name"
      />
      <div class="Creation-mode-Buttons">
        <button @click="save_new_list">Save New List</button>
      </div>

      <div class="Card-section">
        <div class="Add-card-section">
          <div>
            <p>Question</p>
            <textarea
              placeholder="Insert a question"
              v-model="ipt_question"
            ></textarea>
          </div>
          <div>
            <p>Answer</p>
            <textarea
              placeholder="Insert an answer"
              v-model="ipt_answer"
            ></textarea>
          </div>
          <div>
            <button @click="add_flashcard">Add FlashCard +</button>
          </div>
        </div>

        <div
          class="Single-Card-section"
          v-for="(value, index) in local_flashcards"
          :key="index"
        >
          <div>
            <p>Question</p>
            <textarea
              placeholder="Insert a question"
              v-model="value.question_text"
            ></textarea>
          </div>
          <div>
            <p>Answer</p>
            <textarea
              placeholder="Insert an answer"
              v-model="value.answer_text"
            ></textarea>
          </div>
          <div>
            <div class="Card-buttons">
              <button @click="remove_local_flashcard(index)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '../lib/api';
import { useRouter } from 'vue-router';

const router = useRouter();

// Input fields for new flashcards
let ipt_question = ref('');
let ipt_answer = ref('');

// Title of the new list
const new_list_name = ref('');
// Local array of flashcards that will be added to the backend when saving
const local_flashcards = ref<{ question_text: string; answer_text: string }[]>(
  []
);
// Array of other Lists for sidebar navigation
const others_list_infos = ref<any[]>([]);

// Sidebar visibility state
const hide_sidebar = ref(false);

//Function to open and close the sidebar
function toggle_sidebar() {
  hide_sidebar.value = !hide_sidebar.value;
}

//Functions to GET information

async function get_others_list_info() {
  try {
    const data = await api('/user-content/collections', 'GET');

    others_list_infos.value = data.lists;
  } catch (err) {
    console.error(err);
  }
}

//Functions to add information locally

function add_flashcard() {
  if (!ipt_question.value.trim() || !ipt_answer.value.trim()) {
    alert('Question and answer are required');
    return;
  }

  local_flashcards.value.push({
    question_text: ipt_question.value,
    answer_text: ipt_answer.value
  });

  ipt_question.value = '';
  ipt_answer.value = '';
}

//Function to refresh the content

function update_content() {
  new_list_name.value = '';
  local_flashcards.value = [];
  get_others_list_info();
}

//Functions to save information to API

async function save_new_list() {
  if (!new_list_name.value.trim()) {
    alert('Please enter a list name');
    return;
  }

  if (local_flashcards.value.length === 0) {
    alert('Please add at least one flashcard before saving');
    return;
  }

  try {
    const listResponse = await api('/user-content/list', 'POST', {
      name: new_list_name.value,
      parent_id: ''
    });

    const newListId = listResponse.listId;

    const flashcardsToAdd = local_flashcards.value.map((card) => ({
      question_text: card.question_text,
      question_media_id: null,
      answer_text: card.answer_text,
      answer_media_id: null
    }));

    await api(`/user-content/flashcards/${newListId}`, 'POST', {
      flashcards: flashcardsToAdd
    });

    alert('List and flashcards saved successfully!');

    new_list_name.value = '';
    local_flashcards.value = [];

    router.push(`/flashcards`).then(() => {
      window.location.reload();
    });
  } catch (err) {
    console.error(err);
    alert('Failed to create list');
  }
}

//Functions to delete information locally

function remove_local_flashcard(index: number) {
  local_flashcards.value.splice(index, 1);
}

//Function to navigate to others page through the side bar

function navigate_to_other_lists(list_id: string) {
  router.push(`/edit_mode/${list_id}`).then(() => {
    window.location.reload();
  });
}

//Function to update the content on loading.

onMounted(() => {
  update_content();
});
</script>

<style scoped>
.Creation-mode-page {
  width: 100%;
  min-height: 550px;
  display: flex;
  justify-content: center;
}

/* Sidebar styles */
.Side-bar.display {
  width: 20%;
  display: flex;
  border-radius: 10px;
  padding-top: 10px;
}

.Side-bar.hidden {
  width: 2%;
  display: flex;
}

.Side-bar.display > button {
  width: 5%;
  background-color: #525252;
  border-radius: 0px 10px 10px 0;
  color: white;
  font-weight: bold;
}

.Side-bar.display > button div {
  display: flex;
  flex-direction: column;
  gap: 100px;
}

.Side-bar.hidden > button {
  width: 100%;
  color: black;
  border-radius: 0px 10px 10px 0;
}

.Side-bar.hidden > button div {
  display: flex;
  flex-direction: column;
  gap: 100px;
}

.Side-bar-content.display {
  background-color: #ade1ee;

  width: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  padding-top: 30px;
  transition: ease-in-out;
}
.Side-bar-content.hidden {
  display: none;
}

.Side-bar-content ul {
  background-color: #e9b796;
  padding: 10px;
  list-style: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.Side-bar-content li {
  text-align: center;
  width: 90%;
  height: 40px;
  border-bottom: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
}
.Side-bar-content li:last-child {
  border: none;
}

.Side-bar-content button {
  background-color: #862922;
  font-family: 'Outfit';
  height: 40px;
  width: 150px;
  font-size: 20px;
  color: white;
  border-radius: 10px;
}

/* Main content section */

.Creation-mode-section.hidden {
  width: 98%;
}

.Creation-mode-section {
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.Creation-mode-section h1 {
  color: white;
}

.Creation-mode-section > input {
  font-size: large;
  text-align: center;
  border: none;
  border-radius: 10px;
  height: 40px;
  font-weight: bold;
  width: 300px;
}

.Creation-mode-Buttons {
  display: flex;
  gap: 15px;
}

.Creation-mode-Buttons button {
  min-width: 200px;
  height: 40px;
  background-color: #e9b796;
  border-radius: 10px;
}

.Card-section {
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.Add-card-section,
.Single-Card-section {
  width: 100%;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  border-radius: 20px;
  padding: 20px;
}

.Add-card-section {
  background-color: #c2c2c2;
}

.Single-Card-section {
  background-color: #ade1ee;
}

.Add-card-section > div,
.Single-Card-section > div {
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.Add-card-section textarea,
.Single-Card-section textarea {
  height: 60px;
  width: 100%;

  outline: none;
  resize: none;
  border: none;
  border-radius: 5px;
  padding: 5px;
}

p {
  font-weight: bold;
}

.Card-section button {
  height: 40px;
  background-color: #e9b796;
  border-radius: 10px;
}

.Add-card-section button {
  width: 200px;
}

.Card-buttons {
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.Card-buttons button {
  width: 80px;
  min-width: 80px;
}
</style>
