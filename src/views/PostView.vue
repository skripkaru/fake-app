<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePostsStore } from '@/stores/posts'
import { useRoute, useRouter } from 'vue-router'

const { loading, post, comments } = storeToRefs(usePostsStore())
const { getPost, getPostComments } = usePostsStore()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  getPost(route.params.id)
})
</script>

<template>
  <h2 v-if="loading">Loading</h2>
  <div v-else class="page">
    <div class="page__header">
      <ElPageHeader @back="router.go(-1)">
        <template #content> Post {{ post.id }}</template>
      </ElPageHeader>
      <ElButton type="primary" @click="getPostComments(post.id)">View comments</ElButton>
    </div>
    <div class="page__body">
      <div v-if="post">
        <h1>{{ post.title }}</h1>
        <p>{{ post.body }}</p>
      </div>
      <ElEmpty v-else description="Users not found" />
      <ElDivider />
      <div v-if="comments.length !== 0" class="comment-list">
        <ElCard v-for="comment in comments" :key="comment.id">
          <h2>{{ comment.name }}</h2>
          <p>{{ comment.body }}</p>
          <span>{{ comment.email }}</span>
        </ElCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
</style>
