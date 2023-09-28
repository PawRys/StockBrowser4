<script setup lang="ts">
import { ref } from 'vue'

const textarea = ref('')
const message = ref('')
const clipboardPerrmisionTest = ref(true)

await navigator.permissions
  .query({ name: 'clipboard-read' as PermissionName })
  .then((permissionStatus) => {
    permissionStatus.addEventListener('change', () => {
      if (permissionStatus.state === 'denied') {
        clipboardPerrmisionTest.value = false
      }
    })
  })
  .catch((err) => {
    console.log('/** Browser permission issue. **/\n', err)
    clipboardPerrmisionTest.value = false
  })

function dummy(e: Event): void {
  console.log(e)
}

async function clip() {
  message.value = 'some message\nsome message\nsome message\n'

  const clipboardData = await navigator.clipboard
    .readText()
    .catch((reason) => console.error(reason))

  if (clipboardData) {
    textarea.value = clipboardData
  }
}
</script>

<template>
  <section id="database-update">
    <h2>Wczytywanie danych</h2>
    <form @submit.prevent="dummy">
      <textarea id="data-input" v-model="textarea"></textarea>

      <div :class="['message-box', { active: message }]">
        <pre>{{ message }}</pre>
      </div>

      <div class="buttonbar">
        <button type="reset" @click="message = ''">
          <span>Wyczyść</span>
          <i class="bi bi-backspace"></i>
        </button>

        <button type="button" v-if="clipboardPerrmisionTest" @click="clip">
          <span>Wklej ze schowka</span>
          <i class="bi bi-save"></i>
        </button>

        <button type="submit">
          <span>Zatwierdź</span>
          <i class="bi bi-check2"></i>
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
#data-input {
  padding: 0.6ch 1ch;
  width: 100%;
  height: 5rem;
}

.message-box {
  border: pink;

  display: grid;
  grid-template-rows: 0fr;
  transition-property: grid-template-rows;
  transition-duration: 200ms;
}

.message-box > * {
  overflow: hidden;
}
.message-box.active {
  grid-template-rows: 2fr;
}
</style>
