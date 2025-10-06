<template>
  <div class="Edit-mode-page">
    <div
      v-if="others_flashcards_lists.length !== 0"
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
            v-for="value in others_flashcards_lists"
            :key="value['id']"
            @click="navigate_to_other_lists(value['id'])"
            style="cursor: pointer"
          >
            <h3>{{ value['name'] }}</h3>
          </li>
        </ul>
        <button @click="() => router.push('/creation_mode')">Add more +</button>
      </div>

      <button class="hide-display-button" @click="toggle_sidebar">
        <div>
          <p>{{ hide_sidebar ? '>' : '<' }}</p>
          <p>{{ hide_sidebar ? '>' : '<' }}</p>
        </div>
      </button>
    </div>
    <div
      class="Edit-Mode-section"
      :class="{ display: hide_sidebar, hidden: !hide_sidebar }"
    >
      <h1>Edit mode</h1>
      <h2>{{ list_title }}</h2>

      <div class="Edit-Mode-Controls">
        <input
          type="text"
          placeholder="Change flashcard title..."
          v-model="new_list_title"
        />
        <button @click="edit_list_name">Change directory name</button>
        <button @click="delete_all_flashcards">Delete all flascard</button>
        <button @click="delete_directory">Delete directory</button>
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
          v-for="value in flashcards"
          :key="value['id']"
        >
          <div>
            <p>Question</p>
            <textarea
              placeholder="Insert a question"
              v-model="value['question_text']"
            ></textarea>
          </div>
          <div>
            <p>Answer</p>
            <textarea
              placeholder="Insert an answer"
              v-model="value['answer_text']"
            ></textarea>
          </div>
          <div>
            <div class="Card-buttons">
              <button
                @click="
                  edit_single_flashcard(
                    value['id'],
                    value['question_text'],
                    value['answer_text']
                  )
                "
              >
                Save
              </button>
              <button @click="delete_single_flashcard(value['id'])">
                Delete
              </button>
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
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const id = route.params.id;

let ipt_question = ref('');
let ipt_answer = ref('');

type Flashcard = {
  id: string;
  question_text: string;
  answer_text: string;
};

//Title of the page
const list_title = ref('');
const new_list_title = ref('');

const flashcards = ref<Flashcard[]>([]); //The array of flashcard (question / answer)
const list_flashcards = ref<{ name?: string }>({ name: '' }); // The reference to the list(name, parent)
const others_flashcards_lists = ref<any[]>([]); // Array of Lists that don't contain the actual one of the page

const hide_sidebar = ref(false);

//Function to open and close the sidebar
function toggle_sidebar() {
  hide_sidebar.value = !hide_sidebar.value;
}

//Functions to GET information

async function get_flashcards() {
  try {
    const data = await api(`/user-content/flashcards/${id}`, 'GET');
    flashcards.value = data['flashcards'];
  } catch (error) {
    console.log(error);
  }
}

async function get_list_info() {
  try {
    const data = await api('/user-content/collections', 'GET');

    list_flashcards.value = data.lists.find((card: any) => card['id'] === id);
    list_title.value = list_flashcards.value?.name ?? '';
  } catch (err) {
    console.error(err);
  }
}

async function get_others_list_info() {
  try {
    const data = await api('/user-content/collections', 'GET');

    others_flashcards_lists.value = data.lists.filter(
      (card: any) => card['id'] !== id
    );
  } catch (err) {
    console.error(err);
  }
}

//Functions to add information

async function add_flashcard() {
  if (!ipt_question.value.trim() || !ipt_answer.value.trim()) {
    alert('Question and answer are required');
    return;
  }

  try {
    await api(`/user-content/flashcards/${id}`, 'POST', {
      flashcards: [
        {
          question_text: ipt_question.value,
          question_media_id: null,
          answer_text: ipt_answer.value,
          answer_media_id: null
        }
      ]
    });

    alert('Added flashcard');
    ipt_question.value = '';
    ipt_answer.value = '';
    get_flashcards();
  } catch (err) {
    console.error(err);
  }
}

//Functions to edit information

async function edit_single_flashcard(
  flascard_id: string,
  new_question: string,
  new_answer: string
) {
  if (!new_question.trim() || !new_answer.trim()) {
    alert('Question and answer are required');
    return;
  }

  try {
    await api(`/user-content/flashcard/${flascard_id}`, 'PATCH', {
      question_text: new_question,
      answer_text: new_answer
    });

    get_flashcards();
    alert('Modifications saved correctly');
  } catch (error) {
    console.log(error);
  }
}

async function edit_list_name() {
  try {
    await api(`/user-content/container/${id}`, 'PATCH', {
      name: new_list_title.value,
      parent_id: null
    });
    alert('Directory name changed');
  } catch (error) {
    console.log(error);
  }
}

//Functions to delete information

async function delete_single_flashcard(flascard_id: string) {
  try {
    await api(`/user-content/flashcards`, 'DELETE', {
      ids: [flascard_id]
    });
    get_flashcards();
    alert('Correctly deleted the flascard');
  } catch (error) {
    console.log(error);
  }
}

async function delete_all_flashcards() {
  if (flashcards.value.length > 0) {
    const ids = flashcards.value.map((card: any) => card.id);

    try {
      await api(`/user-content/flashcards`, 'DELETE', {
        ids: ids
      });

      get_flashcards();
      alert('Correctly deleted the flascard');
    } catch (error) {}
  }
}

async function delete_directory() {
  if (window.confirm(`Are you sure you want to delete the directory?`)) {
    try {
      await api(`/user-content/container/${id}`, 'DELETE');
      router.push('/flashcards');
    } catch (error) {
      console.log(error);
    }
  } else {
    return;
  }
}

//Function to refresh the content

function update_content() {
  get_list_info();
  get_flashcards();
  get_others_list_info();
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
.Edit-mode-page {
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

.Edit-Mode-section.hidden {
  width: 98%;
}

.Edit-Mode-section {
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.Edit-Mode-section h1,
h2 {
  color: white;
}

.Edit-Mode-Title {
  display: flex;
  gap: 10px;
  width: 450px;
  justify-content: center;
}

.Edit-Mode-Controls input {
  font-size: medium;
  text-align: left;
  border: none;
  border-radius: 10px;
  height: 40px;
  font-weight: bold;
  width: 200px;
  padding-left: 10px;
}

.Edit-Mode-Controls {
  display: flex;
  gap: 15px;
  width: 450px;
  justify-content: center;
}

.Edit-Mode-Controls button {
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
