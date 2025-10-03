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

const props=defineProps({ 
  variant: {
    type: String,
    default: 'nextQuestion'
  }
})

const variantStyle=computed(() => {
  switch (props.variant) {
    case 'nextQuestion': return {
      class: { },
      style: { backgroundColor: color1.value, color:'black', borderRadius: 10 },
      size: {}
    }
    case 'edit': return {
      class: { },
      style: { backgroundColor: color1.value, color:'black', borderRadius: 10 },
      size: {}
    }
    case 'practice': return {
      class: { },
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
      style: { backgroundColor: color1.value, color:'black',borderRadius: 10 },
      size: {}
    }
    case 'addMore' : return {
      class: {},
      style: { backgroundColor: color2.value, color:'white' ,borderRadius:10 },
      size: {}
    }
  }
})

const textContent = computed(() => {
  switch (props.variant) {
    case 'nextQuestion': return 'next question'
    case 'edit': return 'edit'
    case 'practice': return 'practice'
    case 'create' : return 'Add FlashCard +'
    case 'seeAnswer' : return 'see answer'
    case 'addMore' : return 'add more' 
  }
})
</script>

<template>
  
</template>
