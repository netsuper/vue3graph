<script setup>
// Pinia
import { useModel } from './store/model'
import { useUser } from './store/user'
// framework
import { watch,  computed, ref, onMounted} from 'vue'
// libs
import auth from './services/auth'
import graph from './services/graph'
// components
import Login from './components/Login.vue'
import DetailsModal from './components/DetailsModal.vue'
import Search from './components/Search.vue'
// state
const model = useModel()
const CU = useUser()

// User account object synced with MSAL getAccount()
let user = ref({})
// Access token fetched via MSAL for calling Graph API
let accessToken = ref('')
// Details fetched from Graph API user object and photo
let graphDetails = ref(null)
let graphPhoto = ref(null)
let graphEmail = ref(null)
let graphRootSites = ref(null)

// Visibility toggles for the three details modal popups
let showUserDetails = ref(false)
let showGraphDetails = ref(false)
let showTokenDetails = ref(false)
// Any errors
let error =  ref('')

//#region lifecycle hooks
onMounted( async () => { // Basic setup of MSAL helper with client id, or give up
  const id = 'VUE_APP_CLIENT_ID'
  if (id) {
    auth.configure(id, false)
    user = auth.user()// Restore any cached or saved local user
    console.log(`configured ${auth.isConfigured()}`)
  } else {
    error = 'VUE_APP_CLIENT_ID is not set, the app will not function! 😥'
  }
})
//#endregion

// Update user from MSAL
const updateUser = function() {
  user = auth.user()
}
const shallowLogout = function() {// Remove locally held user details, is same as logout
  user = null
  graphDetails = null
  userDetails = null
  graphPhoto = null
  auth.clearLocal()
}
const fullLogout = function() {// Full logout local & server side
  auth.logout()
}
const fetchGraphDetails = async function() {// Get an access token and call graphGetSelf & graphGetPhoto
  if (!user || user.username == 'demo@example.net') {
    return
  }
  try {
    graphDetails.value = await graph.getSelf()
    graphPhoto.value = await graph.getPhoto()
    accessToken.value = graph.getAccessToken()
    graphEmail.value = await graph.getEmail()
    graphRootSites.value = await graph.getRootSites()
    
  } catch (err) {
    error = err
  }
}
//#region watchers
watch(user,// getter
  async function() {// If user changes, make calls to Graph API
    fetchGraphDetails()
  }
)
watch(() => (model.loggedIn), async function(){// getter
    updateUser()// If user changes, make calls to Graph API
    await fetchGraphDetails()
  }
)
</script>

<template>
  <div id="app">
    <section class="hero is-primary is-bold">
      <div class="hero-body">
        <h1 class="title"><img src="./assets/logo.svg" alt="logo" class="ml-4" />MSAL and Microsoft Graph Demo with Vue 3<img src="./assets/vue.svg" alt="logo" class="ml-4" /></h1>
      </div>
      <span class="gitlink is-2 title">
        <a href="https://github.com/benc-uk/msal-graph-vue">
          <i class="fab fa-github fa-fw" />
        </a>
      </span>
    </section>

    <div class="container is-fluid">
      <div v-if="error" class="notification is-danger is-4 title">
        {{ error }}
      </div>
      <Login v-if="!model.loggedIn"  />
      <div v-if="model.loggedIn" class="columns is-multiline">
        <div class="column">
          <div class="title is-5 underline">
            Account &amp; Tokens
          </div>
          <p><b>Name:</b> {{ user?.name }}</p>
          <p><b>Username:</b> {{ user?.username }}</p>
          <br />
          <button class="button is-success is-fullwidth mt-2" @click="showUserDetails = true">
            <span class="icon">
              <i class="fas fa-user fa-fw" />
            </span>
            <span>ID Token &amp; Account</span>
          </button>
          <button class="button is-success is-fullwidth mt-2" @click="showTokenDetails = true">
            <span class="icon">
              <i class="fas fa-code fa-fw" />
            </span>
            <span>Access Token</span>
          </button>

          <div class="columns mt-2">
            <div class="column">
              <button class="button is-warning is-fullwidth" @click="shallowLogout">
                <span class="icon">
                  <i class="fas fa-sign-out-alt fa-fw" />
                </span>
                <span>Logout (Local)</span>
              </button>
            </div>
            <div class="column">
              <button class="button is-warning is-fullwidth" @click="fullLogout">
                <span class="icon">
                  <i class="fas fa-door-open fa-fw" />
                </span>
                <span>Logout (Full)</span>
              </button>
            </div>
          </div>
        </div>

        <div v-if="graphDetails" class="column">
          <div class="title is-5 underline">Graph Details</div>
          <p><b>UPN:</b> {{ graphDetails.userPrincipalName }}</p>
          <p><b>ID:</b> {{ graphDetails.id }}</p>
          <p><b>Job Title:</b> {{ graphDetails.jobTitle }}</p>
          <p><b>Location:</b> {{ graphDetails.officeLocation }}</p>
          <p><b>Mobile:</b> {{ graphDetails.mobilePhone }}</p>
          <p><b>Department:</b> {{ graphDetails.department }}</p>
          <p><b>WEB SITE:</b> <a :href="graphRootSites?.webUrl" target="_blank">{{ graphRootSites?.webUrl }}</a></p>
          <button class="button is-success is-fullwidth mt-2" @click="showGraphDetails = true">
            <span class="icon">
              <i class="fas fa-address-card fa-fw" />
            </span>
            <span>Full Graph Result</span>
          </button>
        </div>

        <div v-if="graphPhoto" class="column">
          <div class="title is-5 underline">
            Photo
          </div>
          <p><img class="graphphoto" :src="graphPhoto" alt="user" /></p>
        </div>

        <div class="column is-full">
          <Search :user="user" :access-token="accessToken" />
        </div>
        <div>
          <div> EMAIL</div>
            <template v-for="e of graphEmail?.value" >
              <div > SUBJECT:{{  e.subject }}</div>
              <div v-html="e.bodyPreview" style="height:200px"></div>
            </template>
        </div>
      </div>
    </div>

    <DetailsModal :content="JSON.stringify(user, null, 2)" title="Account &amp; ID Token Details" :shown="showUserDetails" @close="showUserDetails = false" />
    <DetailsModal :content="JSON.stringify(user, null, 2)" title="Account &amp; ID Token Details" :shown="showUserDetails" @close="showUserDetails = false" />
    <DetailsModal :content="JSON.stringify(graphDetails, null, 2)" title="Full Graph Details" :shown="showGraphDetails" @close="showGraphDetails = false" />
    <DetailsModal :content="accessToken" title="Access Token Raw Value" :wrap="true" link="https://jwt.ms" :shown="showTokenDetails" @close="showTokenDetails = false"/>
    
  </div>
</template>

<style>
.hero-body img {
  width: 80px;
  vertical-align: middle;
  padding-right: 1rem;
}

.hero-body {
  padding: 0.5rem;
}

.hero {
  margin-bottom: 1rem;
}

.graphphoto {
  border-radius: 15px;
}

.underline {
  border-bottom: 3px solid #bbb;
}

.gitlink,
.gitlink a:visited {
  position: absolute;
  top: 0.8rem;
  right: 1rem;
  color: #333436;
}

.email {
      box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
      padding: 10px;
      margin: 8px 4px;
      font-family: Segoe UI, Frutiger, Frutiger Linotype, Dejavu Sans, Helvetica Neue, Arial, sans-serif;
    }

    .email:hover {
      box-shadow: 0 3px 14px rgba(0, 0, 0, 0.3);
      padding: 10px;
      margin: 8px 4px;
    }

    .email h3 {
      font-size: 12px;
      margin-bottom: 4px;
    }

    .email h4 {
      font-size: 10px;
      margin-top: 0px;
      margin-bottom: 4px;
    }

    .email mgt-person {
      --font-size: 10px;
      --avatar-size-s: 12px;
    }

    .email .preview {
      font-size: 13px;
      text-overflow: ellipsis;
      word-wrap: break-word;
      overflow: hidden;
      max-height: 2.8em;
      line-height: 1.4em;
    }
</style>