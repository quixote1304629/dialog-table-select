<template>
  <el-dialog
    v-bind="Object.assign({}, theDialogConfig.dialogAttr, $attrs)"
    v-on="$listeners"
    class="dialog-table"
    @opened="dialogOpened"
  >
    <slot name="top" :selectedDy="selectedDy"></slot>
    <div class="content" v-loading="tableData.loading">
      <!--搜索字段-->
      <el-form-renderer
        v-if="searchFormConfig.length > 0 || !!$slots.search"
        inline
        :content="searchFormConfig"
        ref="searchForm"
        @submit.native.prevent
      >
        <!--@slot 额外的搜索内容, 当searchForm不满足需求时可以使用-->
        <slot name="search"></slot>
        <el-form-item>
          <!--https://github.com/ElemeFE/element/pull/5920-->
          <el-button
            native-type="submit"
            type="primary"
            @click="search"
            size="mini"
          >查询</el-button
          >
          <el-button @click="resetSearch" size="mini">重置</el-button>
        </el-form-item>
      </el-form-renderer>
      <div class="refresh">
        <el-tooltip
          class="item"
          effect="dark"
          content="刷新数据"
          placement="top-end"
        >
          <i class="el-icon-refresh" @click="clickRefresh"></i>
        </el-tooltip>
      </div>
      <el-table
        ref="table"
        v-bind="theTableConfig.tableAttrs"
        :data="tableData.list"
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChange"
      >
        <el-table-column
          v-for="col in theTableConfig.columns"
          :key="col.prop"
          v-bind="col"
        >
        </el-table-column>
      </el-table>
      <el-pagination
        :pageSize.sync="thePaginationConfig.paginationAttr.pageSize"
        :currentPage.sync="thePaginationConfig.paginationAttr.currentPage"
        v-bind="thePaginationConfig.paginationAttr"
        @size-change="handlePaginationSizeChange"
        @current-change="handlePaginationCurrentChange"
      >
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="dialogClose">取 消</el-button>
      <el-button size="mini" type="primary" @click="dialogClickConfirmButton"
      >确 定</el-button
      >
    </span>
    <slot name="bottom" :selectedDy="selectedDy"></slot>
  </el-dialog>
</template>

<script>
  import {
    DIALOG_CONFIG_DEFAULT,
    TABLE_CONFIG_DEFAULT,
    PAGINATION_CONFIG_DEFAULT,
    SELECT_TYPE
  } from './config.js'
  import {
    compareRow,
    findRowFromList,
    findSameRow,
    findNotIncludeRow,
    delList,
    isEmptyObject
  } from './utils.js'
  export default {
    name: 'DialogTableSelect',
    inheritAttrs: false,
    components: {},
    props: {
      // 弹框配置参数，具体格式见 ./config.js
      dialogConfig: {type: Object, require: false, default: () => {}},
      // 搜索表单配置参数
      searchFormConfig: {type: Array, require: false, default: () => []},
      // 表格配置参数，具体格式见 ./config.js
      tableConfig: {type: Object, require: false, default: () => {}},
      // 分页配置参数，具体格式见 ./config.js
      paginationConfig: {type: Object, require: false, default: () => {}},
      // 初始时选中数据
      selected: {type: Array, require: false, default: () => []},
      // 请求完毕执行的函数
      fecthSuccess: {type: Function, require: false, default: () => {}}
    },
    data() {
      return {
        dialogVisible: false,
        theDialogConfig: Object.assign(
          {},
          DIALOG_CONFIG_DEFAULT,
          this.dialogConfig
        ),
        theTableConfig: Object.assign({}, TABLE_CONFIG_DEFAULT, this.tableConfig),
        thePaginationConfig: Object.assign(
          {},
          PAGINATION_CONFIG_DEFAULT,
          this.paginationConfig
        ),
        searchForm: {
          data: {}
        },
        tableData: {
          loading: false,
          // 是否为多选表格
          isMultiSelection: false,
          // 是否请求过数据
          isRequested: false,
          // 初始选中的数据
          listSelected: [],
          // 单选到的数据
          singleSelectedDy: [],
          // 多选到的数据
          listSelectedDy: [],
          list: []
        }
      }
    },
    computed: {
      // 动态选中的数据-单选数据/多选数据
      selectedDy() {
        return this.tableData.isMultiSelection ? this.tableData.listSelectedDy : this.tableData.singleSelectedDy
      }
    },
    methods: {
      // 弹框打开后
      dialogOpened() {
        let table = this.$refs.table
        // 判断是否为多选
        this.tableData.isMultiSelection = table && table.$children[0] && table.$children[0].type === 'selection'
        this.getList(false)
      },
      // 关闭弹框
      dialogClose() {
        // 清空单选时 选中行
        this.resetSingleSelected()

        this.$emit('update:visible', false)
      },
      // 设置表格选中数据
      setTableSelected() {
        if (!this.tableData.list || this.tableData.list.length == 0) {
          return
        }
        this.$nextTick(() => {
          this.tableData.list.forEach(row => {
            const flag = this.tableData.listSelected.some(item => {
              return compareRow(item, row)
            })
            // 多选
            this.$refs.table.toggleRowSelection(row, flag)
            // 单选
            flag && this.$refs.table.setCurrentRow(row)
          })
        })
      },
      // 请求获取table数据(isRefresh:是否直接刷新数据)
      getList(isRefresh = false) {
        if (!this.theTableConfig.url) {
          throw new Error("haven't url")
        }
        if (isRefresh || !this.tableData.isRequested) {
          this.tableData.loading = true
          let requestParam = {
            page: this.thePaginationConfig.paginationAttr.currentPage,
            size: this.thePaginationConfig.paginationAttr.pageSize,
            ...this.searchForm.data
          }
          this.$axios
            .get(this.theTableConfig.url, {params: requestParam})
            .then(response => {
              let res = response.data
              this.tableData.list = res.payload.content
              this.thePaginationConfig.paginationAttr.total =
                res.payload.totalElements
              this.tableData.isRequested = true
              this.setTableSelected()

              this.fecthSuccess()
            })
            .finally(() => {
              this.tableData.loading = false
            })
        }
      },
      // 重置数据(分页参数、是否请求参数、表格数据)
      resetData() {
        this.tableData.isRequested = false
        this.tableData.list = []
        this.thePaginationConfig.paginationAttr.currentPage = this.thePaginationConfig.pageDefault
        this.thePaginationConfig.paginationAttr.pageSize = this.thePaginationConfig.sizeDefault
      },
      // 点击刷新
      clickRefresh() {
        this.resetData()
        this.getList(true)
      },
      // 分页组件 size变化时
      handlePaginationSizeChange(val) {
        this.thePaginationConfig.paginationAttr.pageSize = val
        this.tableData.isRequested = false
        this.tableData.list = []
        this.getList(true)
      },
      // 分页组件 page变化时
      handlePaginationCurrentChange(val) {
        this.thePaginationConfig.paginationAttr.currentPage = val
        this.tableData.isRequested = false
        this.tableData.list = []
        this.getList(true)
      },
      // 多选-当选择项发生变化时会触发该事件
      handleSelectionChange(val) {
        // this.tableData.listSelectedDy = val
        // 1.找出val中有,listSelectedDy无的数据，并存入listSelectedDy
        let addList = findNotIncludeRow(this.tableData.listSelectedDy, val)
        this.tableData.listSelectedDy = this.tableData.listSelectedDy.concat(
          addList
        )
        // 2.找出listSelectedDy和tableData.list有，但val无 的数据，在listSelectedDy中删除
        let sameData = findSameRow(
          this.tableData.listSelectedDy,
          this.tableData.list
        )
        let delData = findNotIncludeRow(val, sameData)
        this.tableData.listSelectedDy = delList(
          this.tableData.listSelectedDy,
          delData
        )
      },
      // 单选-当选项行变化时
      handleCurrentChange(row) {
        this.tableData.singleSelectedDy = [row]
      },
      /** 搜索表单相关方法*****start**/
      async search() {
        await this.$refs.searchForm.validate()
        this.resetData()
        this.searchForm.data = this.$refs.searchForm.getFormValue()
        this.getList(true)
      },
      resetSearch() {
        // reset后, form里的值会变成 undefined, 在下一次查询会赋值给query
        this.$refs.searchForm.resetFields()
        this.searchForm.data = {}
        this.resetData()
        this.getList(true)
      },
      /** 搜索表单相关方法*****end**/
      // 单选-清空单选数据
      resetSingleSelected() {
        this.$refs.table.setCurrentRow()
        this.tableData.singleSelectedDy = []
      },
      // 点击确定按钮
      dialogClickConfirmButton() {
        if (this.selectedDy.length === 0) {
          this.$message.warning('未选择数据')
          return
        }
        this.$emit('handSelect', this.selectedDy)
        this.dialogClose()
      }
    },
    watch: {
      selected: {
        handler(val) {
          this.tableData.listSelected = val
          this.setTableSelected()
        },
        deep: true,
        immediate: true
      }
    },
    created() {},
    mounted() {}
  }
</script>

<style lang="stylus" scoped>
  /deep/.el-table__body tr.current-row > td {
    color: #40a9ff;
  }

  /deep/.el-pagination {
    text-align: right;
    padding: 5px 0;
  }

  .dialog-table {
    line-height: 1 !important;

    .refresh {
      margin-bottom: 10px;
      height: 20px;

      i {
        float: right;
        font-size: 20px;

        &:hover {
          color: #409eff;
        }
      }
    }
  }
</style>
