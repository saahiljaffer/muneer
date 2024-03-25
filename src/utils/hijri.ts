const hijri = (o, c) => {
  // locale needed later
  const proto = c.prototype
  const oldFormat = proto.format
  proto.format = function (formatStr) {
    const locale = this.$locale()

    if (!this.isValid()) {
      return oldFormat.bind(this)(formatStr)
    }

    const utils = this.$utils()
    const str = formatStr || 'YYYY-MM-DDTHH:mm:ssZ'
    const result = str.replace(
      /\[([^\]]+)]|iY{1,4}|iM{1,4}|iD{1,2}|id{1,4}/g,
      (match) => {
        switch (match) {
          case 'iYY':
            return String(this.$y).slice(-2)
          case 'iYYYY':
            return utils.s(this.$y, 4, '0')
          case 'iM':
            return this.$M + 1
          case 'iMM':
            return utils.s(this.$M + 1, 2, '0')
          case 'iMMM':
            return 'iMMM'
          case 'iMMMM':
            return 'iMMMM'
          case 'iD':
            return this.$D
          case 'iDD':
            return utils.s(this.$D, 2, '0')
          case 'id':
            return String(this.$W)
          case 'idd':
            return 'idd'
          case 'iddd':
            return 'iddd'
          case 'idddd':
            return 'idddd'
          default:
            return match
        }
      },
    )
    return oldFormat.bind(this)(result)
  }
}

export default hijri
