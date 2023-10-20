<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'

const {
  loading,
  limit,
  total,
  page,
  dialogVisible,
  title,
  body,
  searchQuery,
  selectedSort,
  sortOptions,
  sortedSearchedPosts
} = storeToRefs(usePostsStore())
const { getPosts, createPost } = usePostsStore()
const router = useRouter()

watch(page, getPosts)

onMounted(() => {
  getPosts()
})
</script>

<template>
  <h2 v-if="loading">Loading</h2>
  <div v-else class="page">
    <div class="page__header">
      <ElPageHeader @back="router.go(-1)">
        <template #content>Posts</template>
      </ElPageHeader>
      <ElButton type="primary" @click="dialogVisible = true">Create post</ElButton>
    </div>
    <div class="page__body">
      <div class="filters">
        <ElInput v-model="searchQuery" size="large" placeholder="Search" :suffix-icon="Search" />
        <ElSelect v-model="selectedSort" placeholder="Sort" size="large">
          <ElOption
            v-for="option in sortOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </ElSelect>
      </div>
      <div v-if="sortedSearchedPosts.length !== 0" class="post-list">
        <ElCard v-for="post in sortedSearchedPosts" :key="post.id" class="post-item">
          <h2 class="post-item__title">{{ post.title }}</h2>
          <ElButton @click="router.push(`/posts/${post.id}`)" class="card-btn">Read more</ElButton>
        </ElCard>
      </div>
      <ElEmpty v-else description="Posts not found" />
    </div>
    <div class="page__footer">
      <ElPagination
        v-model:current-page="page"
        :page-size="limit"
        :pager-count="3"
        :total="total"
        background
        layout="prev, pager, next"
      />
    </div>
    <ElDialog v-model="dialogVisible" title="Create post">
      <ElForm>
        <ElFormItem>
          <ElInput v-model="title" placeholder="Title" size="large" />
        </ElFormItem>
        <ElFormItem>
          <ElInput v-model="body" placeholder="Body" size="large" />
        </ElFormItem>
        <ElButton type="primary" size="large" @click="createPost">Create</ElButton>
      </ElForm>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.post-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.post-item {
  &__title {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}

.card-btn {
  margin-top: auto;
}
</style>
