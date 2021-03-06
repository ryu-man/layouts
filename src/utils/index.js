export function css(node, style = {}) {
  const stylesheet = node.style
  Object.entries(style)
    .filter((o) => o)
    .filter(([e1, e2]) => e2)
    .forEach((elem) => {
      stylesheet[elem[0]] = elem[1]
    })
}

export function classNames(...args) {
  return args

    .filter((o) => o)
    .map((o) => {
      if (typeof o === 'string') {
        return o.trim()
      }
      return Array.from(Object.entries(o))
        .map(([e1, e2]) => {
          if (e2) {
            if (typeof e2 === 'boolean') {
              return e1
            }
            return `${e2?.trim()} ${e1}`
          }
          return ''
        })
        .filter((o) => o)
        .join(' ')
        .trim()
    })
    .filter((o) => o)
    .join(' ')
    .trim()
}
