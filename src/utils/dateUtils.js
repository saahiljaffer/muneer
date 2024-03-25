export const div = (a, b) => {
  return ~~(a / b)
}

export const mod = (a, b) => {
  return a - ~~(a / b) * b
}

export const moons = [
  59082, 59111, 59141, 59170, 59200, 59229, 59259, 59288, 59318, 59348, 59377,
  59407, 59437, 59467, 59496, 59526, 59555, 59584, 59614, 59643, 59673, 59702,
  59732, 59762, 59791, 59821, 59851, 59880, 59910, 59939, 59968, 59998, 60027,
  60056, 60086, 60115, 60145, 60175, 60205, 60235, 60265, 60294, 60323, 60352,
  60381, 60411, 60440, 60470, 60499, 60529, 60559, 60589, 60618, 60648, 60678,
  60707, 60736, 60765, 60795, 60824,
]

/*
    Returns the nearest new moon

    @param jdn Julian Day number
    @return
      i: the index of a modified Julian day number.
  */
const getNewMoonMJDNIndexByJDN = (mjdn) => {
  for (var i = 0; i < moons.length; i = i + 1) {
    if (moons[i] > mjdn) return i
  }
}

export const START_MONTHS = 17292

export const toHijri = (jdn) => {
  var hijriDate = d2h(jdn)
  hijriDate.hm -= 1
  return hijriDate
}

/*
    Converts the Julian Day number to a date in the Hijri calendar.

    @param jdn Julian Day number
    @return
      hy: Hijri year (1356 to 1500)
      hm: Hijri month (1 to 12)
      hd: Hijri day (1 to 29/30)
  */

const d2h = (jdn) => {
  var i = getNewMoonMJDNIndexByJDN(jdn),
    totalMonths = i + START_MONTHS,
    cYears = Math.floor((totalMonths - 1) / 12),
    hy = cYears + 1,
    hm = totalMonths - 12 * cYears,
    hd = jdn - moons[i - 1] + 1

  return {
    hy: hy,
    hm: hm,
    hd: hd,
  }
}

/*
    Calculates the Julian Day number from Gregorian or Julian
    calendar dates. This integer number corresponds to the noon of
    the date (i.e. 12 hours of Universal Time).
    The procedure was tested to be good since 1 March, -100100 (of both
    calendars) up to a few million years into the future.

    @param gy Calendar year (years BC numbered 0, -1, -2, ...)
    @param gm Calendar month (1 to 12)
    @param gd Calendar day of the month (1 to 28/29/30/31)
    @return Julian Day number
  */

// export const g2d = (gy, gm, gd) => {
//   var d =
//     div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
//     div(153 * mod(gm + 9, 12) + 2, 5) +
//     gd -
//     34840408
//   d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752
//   return d
// }

const leap_gregorian = (year) => {
  return year % 4 == 0 && !(year % 100 == 0 && year % 400 != 0)
}
var GREGORIAN_EPOCH = 1721425.5

const gregorian_to_jd = (year, month, day) => {
  return (
    GREGORIAN_EPOCH -
    1 +
    365 * (year - 1) +
    Math.floor((year - 1) / 4) +
    -Math.floor((year - 1) / 100) +
    Math.floor((year - 1) / 400) +
    Math.floor(
      (367 * month - 362) / 12 +
        (month <= 2 ? 0 : leap_gregorian(year) ? -1 : -2) +
        day,
    )
  )
}

export const g2d = (year, month, day) => {
  const result =
    gregorian_to_jd(year, month + 1, day) + Math.floor(0.5) / 86400.0
  return result - 2400000.5
}

/*
    Returns the index of the modified Julian day number of the new moon
    by the given year and month

    @param hy: Hijri year (1356 to 1500)
    @param hm: Hijri month (1 to 12)
    @return
        i: the index of the new moon in modified Julian day number.
  */
function getNewMoonMJDNIndex(hy, hm) {
  var cYears = hy - 1,
    totalMonths = cYears * 12 + 1 + (hm - 1),
    i = totalMonths - START_MONTHS
  return i
}

/*
            Converts a date of the Hijri calendar to the Julian Day number.
        
            @param hy Hijri year (1356 to 1500)
            @param hm Hijri month (1 to 12)
            @param hd Hijri day (1 to 29/30)
            @return Julian Day number
          */

const h2d = (hy, hm, hd) => {
  var i = getNewMoonMJDNIndex(hy, hm),
    mjdn = hd + moons[i - 1] - 1,
    jdn = mjdn + 2400000.5

  return jdn
}

export const toGregorian = (hy, hm, hd) => {
  const gregorianDate = d2g(h2d(hy, hm + 1, hd))
  gregorianDate.gm -= 1
  return gregorianDate
}

/*
    Calculates Gregorian and Julian calendar dates from the Julian Day number
    (hdn) for the period since jdn=-34839655 (i.e. the year -100100 of both
    calendars) to some millions years ahead of the present.

    @param jdn Julian Day number
    @return
      gy: Calendar year (years BC numbered 0, -1, -2, ...)
      gm: Calendar month (1 to 12)
      gd: Calendar day of the month M (1 to 28/29/30/31)
  */

function d2g(jdn) {
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
