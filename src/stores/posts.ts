import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import axios from 'axios'
import type { Post } from '@/interfaces/post'
import type { Option } from '@/interfaces/option'
import type { Comment } from '@/interfaces/comment'

export const usePostsStore = defineStore('posts', () => {
  const loading = ref<boolean>(true)
  const posts = ref<Post[]>([])
  const post = ref({} as Post)
  const comments = ref<Comment[]>([])
  const limit = ref<number>(8)
  const page = ref<number>(1)
  const total = ref<number>(0)
  const title = ref<string>('')
  const body = ref<string>('')
  const dialogVisible = ref<boolean>(false)
  const searchQuery = ref<string>('')
  const selectedSort = ref<string>('')
  const sortOptions = ref<Option[]>([
    {
      value: 'title',
      label: 'Title'
    }
  ])

  const sortedPosts = computed(() => {
    return [...posts.value].sort(
      (a: any, b: any) => a[selectedSort.value]?.localeCompare(b[selectedSort.value])
    )
  })

  const sortedSearchedPosts = computed(() => {
    return sortedPosts.value.filter(
      (post) => post?.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  const getPosts = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts', {
        params: {
          _page: page.value,
          _limit: limit.value
        }
      })
      total.value = Number(response.headers['x-total-count'])
      posts.value = response.data
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  }

  const getPost = async (id: any) => {
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
      post.value = response.data
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  }

  const getPostComments = async (id: number) => {
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
      comments.value = response.data
    } catch (e) {
      console.log(e)
    }
  }

  const createPost = async () => {
    if (title.value === '' || body.value === '') return

    const newPost = {
      id: Date.now(),
      title: title.value,
      body: body.value
    }
    posts.value.push(newPost)
    title.value = ''
    body.value = ''
    dialogVisible.value = false
  }

  return {
    loading,
    posts,
    title,
    body,
    post,
    limit,
    page,
    total,
    dialogVisible,
    comments,
    searchQuery,
    selectedSort,
    sortOptions,
    sortedPosts,
    sortedSearchedPosts,
    getPosts,
    getPost,
    getPostComments,
    createPost
  }
})
