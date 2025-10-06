<script setup lang="ts">

import { ref, computed } from 'vue'

/*
colors

#e9b796	
#a06561	
#ed4e4a	
#862922	
#ade1ee	*/

const color1=ref('#E9B796')
const color2=ref('#A06561')
const color3=ref('#ED4E4A')
const color4=ref('#862922')
const color5=ref('#ADE1EE')

type Variant = 'nextQuestion' | 'edit' | 'practice' | 'create' | 'seeAnswer' | 'addMore'

interface VariantStyle {
  class: Record<string, string>
  style: Record<string, string | number>
  size: Record<string, string | number>
}


const props = withDefaults(defineProps<{
  variant: Variant
}>(), {
  variant: 'nextQuestion' // valeur par défaut
})

/*
const variantStyle=computed<VariantStyle>(() => {
  switch (props.variant) {
    case 'nextQuestion': return {
      class: { 'nextQuestion' },
      style: { backgroundColor: color1.value, color:'black', borderRadius: 10 },
      size: {}
    }
    case 'edit': return {
      class: { 'edit' },
      style: { backgroundColor: color1.value, color:'black', borderRadius: 10 },
      size: {}
    }
    case 'practice': return {
      class: { ' },
      style: { backgroundColor: color1.value, color:'black', borderRadius: 10 },
      size: {}
    }
    case 'create' : return {
      class: {},
      style: { backgroundColor: color1.value, color:'black', borderRadius: 10 },
      size: {}
    }
    case 'seeAnswer' : return {
      class: { },
      style: { backgroundColor: color1.value, color:'black', borderRadius: 10 },
      size: {}
    }
    case 'addMore' : return {
      class: {},
      style: { backgroundColor: color4.value, color:'white', borderRadius:10 },
      size: {}
    }
  }
  return 'Typescript Fallback'
})
*/

const textContent = computed<string>(() => {
  switch (props.variant) {
    case 'nextQuestion': return 'next question'
    case 'edit': return 'edit'
    case 'practice': return 'practice'
    case 'create' : return 'Add FlashCard +'
    case 'seeAnswer' : return 'see answer'
    case 'addMore' : return 'add more' 
  }
  return 'Typescript Fallback'
})
</script>

<template>
  <button :class='variant'> <slot> {{ textContent }} </slot> </button>
</template>

<style scoped>

.nextQuestion {
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

.edit {
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

.practice {
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

.create {
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

.seeAnswer {
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

.addMore {
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


</style>

