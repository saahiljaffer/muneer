import { g2d, moons, toHijri } from './dateUtils'

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
    const jdn = g2d(this.$y, this.$M, this.$D)
    console.log('jdn', jdn, 'y', this.$y, 'm', this.$M, 'd', this.$D)
    const hijriDate = toHijri(jdn)
    console.log('toHijri', hijriDate)

    const result = str.replace(
      /\[([^\]]+)]|iY{1,4}|iM{1,4}|iD{1,2}|id{1,4}/g,
      (match) => {
        switch (match) {
          case 'iYY':
            return String(hijriDate.hy).slice(-2)
          case 'iYYYY':
            return utils.s(hijriDate.hy, 4, '0')
          case 'iM':
            return hijriDate.hm + 1
          case 'iMM':
            return utils.s(hijriDate.hm + 1, 2, '0')
          case 'iMMM':
            return 'iMMM'
          case 'iMMMM':
            return 'iMMMM'
          case 'iD':
            return hijriDate.hd
          case 'iDD':
            return utils.s(hijriDate.hd, 2, '0')
          case 'id':
            return 'id'
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
