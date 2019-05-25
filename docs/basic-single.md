基本用法

```vue
<template>
  <div>
    <el-button @click="openDialog">click</el-button>
    <div>{{selectedList}}</div>
    <dialog-table-select
    :visible.sync="visible"
    :dialogConfig="dialogConfig"
    :searchFormConfig="searchFormConfig"
    :tableConfig="tableConfig"
    :selected="selectedList"
    @handSelect="handSelect">
      <div slot="top">top</div>
      <div slot="bottom">bottom</div>
    </dialog-table-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      searchFormConfig: [
        {
          $type: 'input',
          $id: 'activityName',
          label: '活动名称',
          $el: {
            placeholder: '',
            size: 'mini'
          }
        }
      ],
      tableConfig: {
        url: 'http://39.98.50.163:3000/mock/725/cdp-wy-activity-center/api/v1/memberActivities/mine',
        columns: [
          { prop: 'id', label: 'ID' },
          { prop: 'activityName', label: '活动名称' }
        ]
      },
      dialogConfig: {
        dialogAttr: { title: '选择活动' }
      },
      selectedList: [
        { id: '7cf9a84f7f9f342de76c79518282fe30', activityName: '蝈蝈测试长期活动' }
      ]
    }
  },
  methods: {
    openDialog(){
      this.visible = true
    },
    handSelect(val){
      this.selectedList = val
    }
  }
}
</script>
```