<script lang="js" setup>
const props = defineProps({
  shown: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    required: false,
    default: ''
  },
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: false,
    default: ''
  },
  wrap: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="modal" :class="{ 'is-active': props.shown }">
    <div class="modal-background" />
    <div class="modal-content">
      <div class="notification is-info is-light">
        <button class="delete" />
        <h5 class="title is-5">
          {{ props.title }}
          <a v-if="props.link" class="button is-primary is-pulled-right" target="_blank" :href="props.link">{{ props.link }}</a>
        </h5>
        <pre style="{preStyle}" :class="{ 'wrap-pre': props.wrap }">
          {{ props.content }}
        </pre>
      </div>
    </div>
  </div>
</template>


<style scoped>
  .modal-content {
    width: 80% !important;
  }

  .wrap-pre {
    word-wrap: break-word;
    white-space: pre-wrap;
  }
</style>