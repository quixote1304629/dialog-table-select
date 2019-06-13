基本用法

```vue
<template>
  <div>
    <el-button @click="openDialog">click</el-button>
    
    <div>
      <h1>选中数据(确认):</h1>
      <p :key="i" v-for="(item,i) in selectedList">id: {{item.id}},activityName: {{item.activityName}}</p>
    </div>
    
    <dialog-table-select
      ref="dialogTableSelect"
      :visible.sync="visible"
      :dialogConfig="dialogConfig"
      :searchFormConfig="searchFormConfig"
      :tableConfig="tableConfig"
      :selected="selectedList"
      @opened="dialogOpened"
      @handSelect="handSelect">
      <div slot="top" slot-scope="scope">top</div>
      <div slot="bottom" slot-scope="scope">
        <h1>选中数据(未确认):</h1>
        <p :key="i" v-for="(item,i) in scope.selectedDy">id: {{item.id}},activityName: {{item.activityName}}</p>
      </div>
    </dialog-table-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /** 控制弹框显隐*/
      visible: false,
      /** 弹框中搜索表单配置*/
      searchFormConfig: [
        {
          $type: 'input',
          $id: 'activityName',
          label: '活动名称',
          $el: {
            placeholder: '',
            size: 'mini'
          }
        },
        {
          $type: 'select',
          $id: 'activityType',
          label: '活动类型',
          $options: [{value: '1', label: 'aaa'}],
          $el: {
            size: 'mini'
          }
        }
      ],
      /** 弹框中表格配置*/
      tableConfig: {
        url: 'https://www.easy-mock.com/mock/5cffa748dd1bd63aa02f2fe0/example/hello-3',
        columns: [
          { type: 'selection', selectable: () => true },
          { prop: 'id', label: 'ID' },
          { prop: 'activityName', label: '活动名称' }
        ]
      },
      /** 弹框配置*/
      dialogConfig: {
        dialogAttr: { title: '选择活动' }
      },
      /** 选中的数据*/
      selectedList: [
        { id: '7cf9a84f7f9f342de76c79518282fe30', activityName: '蝈蝈测试长期活动' },
        { id: '7cf9a84f7f9f342de76c79518282fe32', activityName: '蝈蝈测试长期活动' }
      ]
    }
  },
  methods: {
    /** 打开弹框*/
    openDialog(){
      this.visible = true
    },
    /** 弹框打开执行*/
    dialogOpened(){
      let options = [{value: '1', label: 'aaa'}, {value: '2', label: 'bbb'}]
      this.$refs.dialogTableSelect.$refs.searchForm.setOptions('activityType', options)
    },
    /** 弹框确认选中数据*/
    handSelect(val){
      this.selectedList = val
    }
  }
}
</script>
```