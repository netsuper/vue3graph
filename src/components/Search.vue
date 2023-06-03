<script setup>
import _ from 'lodash'
import graph from '../services/graph'
// framework
import { watch,  computed, ref, onMounted} from 'vue'

const props = defineProps( {
  user: {
    type: Object,
    required: true,
    default: null
  },
  accessToken: {
    type: String,
    required: true,
    default: null
  }
})

const users = ref(null)
const searchTerm = ref(null)
const error = ref(null)
 
//#region watchers
watch(searchTerm,// getter // Watch the search field and run a Graph search with a debounce
  function(newValue) {
    if (newValue.trim()) {
      this.searchDebounce(newValue)
    }
  }
)


const searchSupported = function() {
  if (!this.user || !this.user.idTokenClaims) {
    return false
  }
  return this.user.idTokenClaims.tid !== '9188040d-6c67-4c5b-b112-36a304b66dad'
}

   
const debounce = async function(searchString){ // Lodash debounce wrapper around the HTTP call to the Graph
  if (!accessToken) {
    return
  }
  try {
    let searchRes = await graph.searchUsers(searchString, 25)
    users.value = searchRes.value
  } catch (err) {
    error.value = err.toString()
  }
}

</script>

<template>
  <div>
    <div class="title is-5 underline mt-6">
      Search Directory
    </div>

    <input
      v-if="searchSupported()"
      v-model="searchTerm"
      type="text"
      class="input"
      placeholder="User name or display name"
    />
    <div v-else class="notification is-light mt-4">
      Directory search not supported for personal accounts, sorry!
    </div>

    <div v-if="error" class="notification is-danger mt-4">⚠ {{ error }}</div>

    <table v-if="users" class="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>Display Name</th>
          <th>Names</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="userResult of users" :key="userResult.id">
          <td>{{ userResult.displayName }}</td>
          <td>{{ userResult.givenName }} {{ userResult.surname }}</td>
          <td>{{ userResult.mail }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>