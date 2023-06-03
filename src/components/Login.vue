
<script lang="js" setup>
// Pinia
import { useModel } from '../store/model'
import { useUser } from '../store/user'
// framework
import { watch,  computed, ref, onMounted} from 'vue'
// libs
import auth from '../services/auth'
// state
const model = useModel()
const CU = useUser()


let error = ref('')
const doLogin = async function() {
  try {
    await auth.login()
    model.loggedIn = true
    // $emit('loginComplete')
  } catch (err) {
    error.value = err.toString()
  }
}
</script>

<style scoped>
  .centered {
    text-align: center;
  }
</style>

<template>
  <div class="centered">
    <h1 class="title is-5">
      Please login with Microsoft Identity Platform
    </h1>
    <button class="button is-dark is-large" @click="doLogin">
      Sign in with Microsoft <img class="ml-4" src="../assets/mssymbol.svg" alt="MS logo">
    </button>
    <p class="mt-4">
      Note. You can login with a 'work &amp; school' or personal Microsoft account
    </p>

    <div v-if="error" class="notification is-warning mt-4">
      {{ error }}
    </div>
  </div>
</template>
