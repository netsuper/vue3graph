# Original Vue 2
This is a Vite/Vue 3 version of this Vue 2 repo.  https://github.com/benc-uk/msal-graph-vue

It does not include the docker instance, just a Vue app.  
It uses the composition API with <script setup> and Pinia state management (to control component state).  
I also added a couple graph features (email, sharepoint root site).

Follow the directions in that repo to setup your Azure App ID then replace the ID in code.  :)

# Get Started

1. Clone the repo
2. run:
  
  npm install
  
  npm run dev

  
  # Microsoft Graph Toolkit
  https://mgt.dev/
  
  # Microsoft Graph Explorer
  
  https://developer.microsoft.com/en-us/graph/graph-explorer

  #OData
  
  Microsoft SharePoint has been using the Microsoft Open Data (OData) protocol for years for REST API access.  It has similar functionality to GraphQL 
  (my impresssion is they named MSGraph after that paradigm, although it isn't technically GraphQL) in that you can return child entities in a single
  REST API call.
  
  It appears that they have leveraged the OData REST API against most of their Office 365 platform (so you can get email/onedrive/sharepoint/teams, etc. data via REST API).
  This is intriguing because you can create applications with modern web development tooling (Vite + Vuejs/Reactjs/Angularjs) that combine all of these datasets in one app.
