// 选择数据类型 单选/多选
export const SELECT_TYPE = {
  SINGLE: 'single',
  MULTIPLE: 'multiple'
}

// dialog配置参数
export const DIALOG_CONFIG_DEFAULT = {
  // el-dialog默认属性
  dialogAttr: {title: 'unknown title', width: '50%'}
}

// table配置参数
export const TABLE_CONFIG_DEFAULT = {
  // 数据请求地址
  url: '',
  // url响应数据中路径-list数据路径
  dataPath: 'payload.content',
  // url响应数据中路径-总数量的路径
  totalPath: 'payload.totalElements',
  // el-table默认属性
  tableAttrs: {border: true, highlightCurrentRow: true},
  columns: [
    // 如果配置了选择列，则为多选；不配置多选列为单选
    // {type: 'selection', selectable: () => true},
  ]
}

// pagination配置参数
export const PAGINATION_CONFIG_DEFAULT = {
  // 默认当前页号
  pageDefault: 1,
  // 默认每页显示数目-用于重置
  sizeDefault: 5,
  // el-pagination默认属性
  paginationAttr: {
    pageSizes: [5, 10, 20, 50],
    pageSize: 5,
    currentPage: 1,
    layout: 'total, sizes, prev, pager, next, jumper',
    total: 0
  }
}
