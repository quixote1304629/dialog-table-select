// 比较两条数据是否为同一个，目前根据id进行比较
export const compareRow = (row1, row2) => {
  return row1.id === row2.id
}
// 在数组list中是否包含row
export const findRowFromList = (list, row) => {
  return (
    list.filter(item => {
      return compareRow(row, item)
    }).length > 0
  )
}
// 在list1和list2中找到相同的数据
export const findSameRow = (list1, list2) => {
  return list2.filter(row => {
    return findRowFromList(list1, row)
  })
}
// 在list2中找到list1没有的数据
export const findNotIncludRow = (list1, list2) => {
  return list2.filter(row => {
    return !findRowFromList(list1, row)
  })
}
// 在list1中删除list2
export const delList = (list1, list2) => {
  const newList = []
  list1.forEach(row => {
    if (!findRowFromList(list2, row)) {
      newList.push(row)
    }
  })
  return newList
}

// 判断是否为空对象
export const isEmptyObject = obj => {
  return JSON.stringify(obj) == '{}'
}
