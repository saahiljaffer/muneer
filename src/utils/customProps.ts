import { g2d, toHijri } from './dateUtils'

const customProps = (o, c) => {
  const proto = c.prototype
  proto.iMonth = function () {
    const jdn = g2d(this.$y, this.$M, this.$D)
    const hijri = toHijri(jdn)
    return hijri.hm
  }
  proto.iDay = function () {
    const jdn = g2d(this.$y, this.$M, this.$D)
    const hijri = toHijri(jdn)
    return hijri.hd
  }
  proto.iYear = function () {
    const jdn = g2d(this.$y, this.$M, this.$D)
    const hijri = toHijri(jdn)
    return hijri.hy
  }
}

export default customProps
