import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTagsStore = defineStore(
  'tags',
  () => {
    const tagsInfo = ref({})
    const blueToothDevices = ref([])//蓝牙设备

    // const setPostForm = (val) => {
    //   postForm.value = val
    // }

    return {
      // setPostForm,
      tagsInfo,
      blueToothDevices
    }
  },
  {
    persist: true,
  },
)
