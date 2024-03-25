import { toGregorian, toHijri, g2d } from './dateUtils'

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

const u = (formatStr, formats) =>
  formatStr.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, (_, a, b) => {
    const B = b && b.toUpperCase()
    return a || formats[b] || englishFormats[b] || t(formats[B])
  })

const formattingTokens =
  /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|YYYY|iYYYY|iYY?|YY?|MM?M?M?|iMM?M?M|Do|iDo|DD?|iDD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g

const match2 = /\d\d/ // 00 - 99
const match4 = /\d{4}/ // 0000 - 9999
const match1to2 = /\d\d?/ // 0 - 99
const matchSigned = /[+-]?\d+/ // -inf - inf
const matchWord = /\d*[^-_:/,()\s\d]+/ // Word

let locale = {}

let parseTwoDigitYear = function (input) {
  input = +input
  return input + (input > 68 ? 1900 : 2000)
}

const addInput = function (property) {
  return function (input) {
    this[property] = +input
  }
}

const getLocalePart = (name) => {
  const part = locale[name]
  return part && (part.indexOf ? part : part.s.concat(part.f))
}

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

function correctHours(time) {
  const { afternoon } = time
  if (afternoon !== undefined) {
    const { hours } = time
    if (afternoon) {
      if (hours < 12) {
        time.hours += 12
      }
    } else if (hours === 12) {
      time.hours = 0
    }
    delete time.afternoon
  }
}

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
    correctHours(time)
    return time
  }
}

const parseFormattedInput = (input, format, utc) => {
  try {
    if (['x', 'X'].indexOf(format) > -1)
      return new Date((format === 'X' ? 1000 : 1) * input)
    const parser = makeParser(format)
    const result = parser(input)
    const { year, month, day } = toGregorian(
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
    return new Date(y, M, d)
  } catch (e) {
    return new Date('') // Invalid Date
  }
}

const customParseFormat = (o, C, d) => {
  d.p.customParseFormat = true
  if (o && o.parseTwoDigitYear) {
    ;({ parseTwoDigitYear } = o)
  }
  const proto = C.prototype
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

export default customParseFormat
