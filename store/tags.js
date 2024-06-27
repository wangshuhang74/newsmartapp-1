import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTagsStore = defineStore(
  'tags',
  () => {
    const tagsInfo = ref({})
    const blueToothDevices = ref([])//蓝牙设备
    const isOpenOnBlue = ref(false); //本次启动是否已打开蓝牙监听
    const samsn = ref('') //安全模块序列号

    const isReadRules = ref(true); //当前步骤是否读规则
    const readRules = ref({ deleteRO: false, addRO: false, startRO: false, addAO: true });//读规则步骤  1删除RO-403 2添加RO-401 3启动RO-405 4-是否已经addAO,如果是需要删除
    const writeRules = ref({ deleteRO: false, deleteAO: false, addRO: false, addAO: false, startRO: false });//写规则步骤  1删除RO-403 2删除AO-453 3添加RO-401 4添加AO-451 5启动RO-405

    const startAddAO = ref(false); //写入时是否可以开始添加AO

    const addROArea = ref('user0'); //当前addRO 区域  标签未激活需要先读user0 然后所有user0写入

    //连接蓝牙识读初始化数据
    // const deviceId = ref('');//蓝牙设备id
    // const serviceId = ref('0000FFE0-0000-1000-8000-00805F9B34FB')
    // const characteristicId = ref('0000FFE9-0000-1000-8000-00805F9B34FB'); //蓝牙write
    // const characteristicId_notify = ref('0000FFE4-0000-1000-8000-00805F9B34FB'); //蓝牙notify
    const blueToothInit = ref({ deviceId: '', serviceId: '0000FFE0-0000-1000-8000-00805F9B34FB', characteristicId: '0000FFE9-0000-1000-8000-00805F9B34FB', characteristicId_notify: '0000FFE4-0000-1000-8000-00805F9B34FB' });

    // const setPostForm = (val) => {
    //   postForm.value = val
    // }

    return {
      // setPostForm,
      tagsInfo,
      blueToothDevices,
      isOpenOnBlue,
      samsn,
      isReadRules,
      readRules,
      writeRules,
      blueToothInit,
      startAddAO,
      addROArea
    }
  },
  {
    persist: true,
  },
)
