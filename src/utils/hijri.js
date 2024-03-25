// integer division
export const div = (a, b) => {
  return ~~(a / b)
}

// modulo
export const mod = (a, b) => {
  return a - ~~(a / b) * b
}

// moonsightings
export const moons = [
  59082, 59111, 59141, 59170, 59200, 59229, 59259, 59288, 59318, 59348, 59377,
  59407, 59437, 59467, 59496, 59526, 59555, 59584, 59614, 59643, 59673, 59702,
  59732, 59762, 59791, 59821, 59851, 59880, 59910, 59939, 59968, 59998, 60027,
  60056, 60086, 60115, 60145, 60175, 60205, 60235, 60265, 60294, 60323, 60352,
  60381, 60411, 60440, 60470, 60499, 60529, 60559, 60589, 60618, 60648, 60678,
  60707, 60736, 60765, 60795, 60824,
]

// returns the index of the new moon closest to a modified julian day number
const getNewMoonIndexByJulian = (mjdn) => {
  for (var i = 0; i < moons.length; i = i + 1) {
    if (moons[i] > mjdn) return i
  }
}

// epoch
export const START_MONTHS = 17292

//  converts a date from a modified julian day number to a hijri date
const julianToHijri = (jdn) => {
  var i = getNewMoonIndexByJulian(jdn),
    totalMonths = i + START_MONTHS,
    cYears = Math.floor((totalMonths - 1) / 12),
    hy = cYears + 1,
    hm = totalMonths - 12 * cYears,
    hd = jdn - moons[i - 1] + 1

  return {
    hy: hy,
    hm: hm - 1,
    hd: hd,
  }
}

const leapGregorian = (year) => {
  return year % 4 == 0 && !(year % 100 == 0 && year % 400 != 0)
}
var GREGORIAN_EPOCH = 1721425.5

// calculates the julian day number for a gregorian calendar date
const gregorianToJulian = (year, month, day) => {
  return (
    GREGORIAN_EPOCH -
    1 +
    365 * (year - 1) +
    Math.floor((year - 1) / 4) +
    -Math.floor((year - 1) / 100) +
    Math.floor((year - 1) / 400) +
    Math.floor(
      (367 * month - 362) / 12 +
        (month <= 2 ? 0 : leapGregorian(year) ? -1 : -2) +
        day,
    ) -
    2400000.5
  )
}

// returns the index of the new moon closest to a hijri date
function getNewMoonIndexByHijri(hy, hm) {
  var cYears = hy - 1,
    totalMonths = cYears * 12 + 1 + (hm - 1),
    i = totalMonths - START_MONTHS

  return i
}

// converts a hijri date to a julian day number
const hijriToJulian = (hy, hm, hd) => {
  var i = getNewMoonIndexByHijri(hy, hm),
    mjdn = hd + moons[i - 1] - 1,
    jdn = mjdn + 2400000.5

  return jdn
}

// converts a hijri date to a gregorian date
const hijriToGregorian = (hy, hm, hd) => {
  const gregorianDate = julianToGregorian(hijriToJulian(hy, hm, hd))
  return gregorianDate
}

// converts a julian day number to a gregorian date
function julianToGregorian(jdn) {
  var j, i, gd, gm, gy
  j = 4 * jdn + 139361631
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908
  i = div(mod(j, 1461), 4) * 5 + 308
  gd = div(mod(i, 153), 5) + 1
  gm = mod(div(i, 153), 12) + 1
  gy = div(j, 1461) - 100100 + div(8 - gm, 6)
  return {
    year: gy,
    month: gm,
    day: gd,
  }
}

export const FORMAT_DEFAULT = 'YYYY-MM-DDTHH:mm:ssZ'

let locale = {}

const t = (format) =>
  format.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, (_, a, b) => a || b.slice(1))

const englishFormats = {
  LTS: 'h:mm:ss A',
  LT: 'h:mm A',
  L: 'MM/DD/YYYY',
  LL: 'MMMM D, YYYY',
  LLL: 'MMMM D, YYYY h:mm A',
  LLLL: 'dddd, MMMM D, YYYY h:mm A',
}

// format function
const u = (formatStr, formats) =>
  formatStr.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, (_, a, b) => {
    const B = b && b.toUpperCase()
    return a || formats[b] || englishFormats[b] || t(formats[B])
  })

const formattingTokens =
  /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|YYYY|iYYYY|iYY?|YY?|MM?M?M?|iMM?M?M|Do|iDo|DD?|iDD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g

// parse function for each format
const match2 = /\d\d/ // 00 - 99
const match4 = /\d{4}/ // 0000 - 9999
const match1to2 = /\d\d?/ // 0 - 99
const matchSigned = /[+-]?\d+/ // -inf - inf
const matchWord = /\d*[^-_:/,()\s\d]+/ // Word

// parse two digit year
let parseTwoDigitYear = function (input) {
  input = +input
  return input + (input > 68 ? 1900 : 2000)
}

// set property to value
const addInput = function (property) {
  return function (input) {
    this[property] = +input
  }
}

// get part of locale
const getLocalePart = (name) => {
  const part = locale[name]
  return part && (part.indexOf ? part : part.s.concat(part.f))
}

// parse function for each format
const expressions = {
  iD: [match1to2, addInput('day')],
  iDD: [match2, addInput('day')],
  iDo: [
    matchWord,
    function (input) {
      const { ordinal } = locale
      ;[this.day] = input.match(/\d+/)
      if (!ordinal) return
      for (let i = 1; i <= 31; i += 1) {
        if (ordinal(i).replace(/\[|\]/g, '') === input) {
          this.day = i
        }
      }
    },
  ],
  iM: [match1to2, addInput('month')],
  iMM: [match2, addInput('month')],
  iMMM: [
    matchWord,
    function (input) {
      const months = getLocalePart('months')
      const monthsShort = getLocalePart('monthsShort')
      const matchIndex =
        (monthsShort || months.map((_) => _.slice(0, 3))).indexOf(input) + 1
      if (matchIndex < 1) {
        throw new Error()
      }
      this.month = matchIndex % 12 || matchIndex
    },
  ],
  iMMMM: [
    matchWord,
    function (input) {
      const months = getLocalePart('months')
      const matchIndex = months.indexOf(input) + 1
      if (matchIndex < 1) {
        throw new Error()
      }
      this.month = matchIndex % 12 || matchIndex
    },
  ],
  iY: [matchSigned, addInput('year')],
  iYY: [
    match2,
    function (input) {
      this.year = parseTwoDigitYear(input)
    },
  ],
  iYYYY: [match4, addInput('year')],
}

// split string by formatting tokens
function makeParser(format) {
  format = u(format, locale && locale.formats)
  const array = format.match(formattingTokens)
  const { length } = array
  for (let i = 0; i < length; i += 1) {
    const token = array[i]
    const parseTo = expressions[token]
    const regex = parseTo && parseTo[0]
    const parser = parseTo && parseTo[1]
    if (parser) {
      array[i] = { regex, parser }
    } else {
      array[i] = token.replace(/^\[|\]$/g, '')
    }
  }
  return function (input) {
    const time = {}
    for (let i = 0, start = 0; i < length; i += 1) {
      const token = array[i]
      if (typeof token === 'string') {
        start += token.length
      } else {
        const { regex, parser } = token
        const part = input.slice(start)
        const match = regex.exec(part)
        const value = match[0]
        parser.call(time, value)
        input = input.replace(value, '')
      }
    }
    return time
  }
}

// parse input string + format to date object
const parseFormattedInput = (input, format, utc) => {
  try {
    if (['x', 'X'].indexOf(format) > -1)
      return new Date((format === 'X' ? 1000 : 1) * input)
    const parser = makeParser(format)
    const result = parser(input)
    const { year, month, day } = hijriToGregorian(
      result.year,
      result.month,
      result.day,
    )
    const now = new Date()
    const d = day || (!year && !month ? now.getDate() : 1)
    const y = year || now.getFullYear()
    let M = 0
    if (!(year && !month)) {
      M = month > 0 ? month - 1 : now.getMonth()
    }
    const ret = new Date(y, M, d)
    return ret
  } catch (e) {
    return new Date('') // Invalid Date
  }
}

const hijri = (option, dayjsClass, dayjsFactory) => {
  // locale needed later
  const proto = dayjsClass.prototype
  // add property methods
  proto.iMonth = function () {
    const jdn = gregorianToJulian(this.$y, this.$M + 1, this.$D)
    const hijri = julianToHijri(jdn)
    return hijri.hm
  }
  proto.iDay = function () {
    const jdn = gregorianToJulian(this.$y, this.$M + 1, this.$D)
    const hijri = julianToHijri(jdn)
    return hijri.hd
  }
  proto.iYear = function () {
    const jdn = gregorianToJulian(this.$y, this.$M + 1, this.$D)
    const hijri = julianToHijri(jdn)
    return hijri.hy
  }
  // add format methods
  const oldFormat = proto.format
  proto.format = function (formatStr) {
    if (!this.isValid()) {
      return oldFormat.bind(this)(formatStr)
    }

    const utils = this.$utils()
    const str = formatStr || FORMAT_DEFAULT
    const jdn = gregorianToJulian(this.$y, this.$M + 1, this.$D)
    const hijriDate = julianToHijri(jdn)

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

  const oldParse = proto.parse
  proto.parse = function (cfg) {
    const { date, utc, args } = cfg
    this.$u = utc
    const format = args[1]
    if (typeof format === 'string') {
      const isStrictWithoutLocale = args[2] === true
      const isStrictWithLocale = args[3] === true
      const isStrict = isStrictWithoutLocale || isStrictWithLocale
      let pl = args[2]
      if (isStrictWithLocale) [, , pl] = args
      locale = this.$locale()
      if (!isStrictWithoutLocale && pl) {
        locale = d.Ls[pl]
      }

      this.$d = parseFormattedInput(date, format, utc)
      this.init()
      if (pl && pl !== true) this.$L = this.locale(pl).$L
      // use != to treat
      // input number 1410715640579 and format string '1410715640579' equal
      // eslint-disable-next-line eqeqeq
      if (isStrict && date != this.format(format)) {
        this.$d = new Date('')
      }
      // reset global locale to make parallel unit test
      locale = {}
    } else if (format instanceof Array) {
      const len = format.length
      for (let i = 1; i <= len; i += 1) {
        args[1] = format[i - 1]
        const result = d.apply(this, args)
        if (result.isValid()) {
          this.$d = result.$d
          this.$L = result.$L
          this.init()
          break
        }
        if (i === len) this.$d = new Date('')
      }
    } else {
      oldParse.call(this, cfg)
    }
  }
}

export default hijri
