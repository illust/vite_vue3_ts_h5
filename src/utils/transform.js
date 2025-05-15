/**
 *
 * @param {*} text
 * @returns {number}
 * @description 计算文本中中文字符的数量
 * @example
 * const text = '你好'
 * const count = cntChineseChars(text)
 * console.log(count) // 2
 */
function cntChineseChars(text) {
  const matches = text.match(/[\u4E00-\u9FFF]/g)
  return matches ? matches.length : 0
}

/**
 *
 * @param {*} input
 * @returns  {string}
 * @description 将输入字符串转换为特定格式
 * @example
 * transPuzzlePosition('1,2') // .r1-c2
 */
function transPuzzlePosition(input) {
  const parts = input.split(',')
  return `.r${parts[0]}-c${parts[1]}`
}

/**
 *
 * @param {*} existingSet
 * @returns Array
 * @description 找到10x10坐标中除去existingSet以外其他的坐标
 * @example
 */
function findMissingCoordinates(existingSet) {
  const missing = []

  // 生成所有可能的10x10坐标
  for (let row = 1; row <= 10; row++) {
    for (let col = 1; col <= 10; col++) {
      const coord = `${row},${col}`

      // 如果当前坐标不在existingSet中，则添加到结果数组
      if (!existingSet.has(coord)) {
        missing.push(coord)
      }
    }
  }

  return missing
}
export { cntChineseChars, transPuzzlePosition, findMissingCoordinates }
