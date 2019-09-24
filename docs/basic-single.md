单选

```vue
<template>
  <div>
    <el-button @click="openDialog">click</el-button>
    
    <div>
      <h1>选中数据(确认):</h1>
      <p :key="i" v-for="(item,i) in selectedList">
        <span>id: {{item.id}},activityName: {{item.activityName}}</span>
        <button @click="drop(i)">移除</button>
      </p>
    </div>
    
    <dialog-table-select
      :visible.sync="visible"
      :dialogConfig="dialogConfig"
      :searchFormConfig="searchFormConfig"
      :tableConfig="tableConfig"
      :selected="selectedList"
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
        }
      ],
      /** 弹框中表格配置*/
      tableConfig: {
        url: 'http://39.100.141.76:3000/mock/610/aa/activities',
        columns: [
          { prop: 'id', label: 'ID' },
          { prop: 'activityName', label: '活动名称' }
        ]
      },
      /** 弹框配置*/
      dialogConfig: {
        dialogAttr: { title: '选择活动', width: '70%' }
      },
      /** 选中的数据*/
      selectedList: [
        { id: '7cf9a84f7f9f342de76c79518282fe30x', activityName: '蝈蝈测试长期活动' }
      ]
    }
  },
  methods: {
    /** 打开弹框*/
    openDialog(){
      this.visible = true
    },
    /** 弹框确认选中数据*/
    handSelect(val){
      this.selectedList = val
    },
    /** 移除*/
    drop(i){
      this.selectedList.splice(i, 1)
    }
  }
}
</script>
```