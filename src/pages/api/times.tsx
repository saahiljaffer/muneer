import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { initializeApp } from 'firebase/app'
import { doc, getDoc, getFirestore } from 'firebase/firestore/lite'
import type { NextApiRequest, NextApiResponse } from 'next'

var customParseFormat = require('dayjs/plugin/customParseFormat')

const firebaseConfig = {
  apiKey: 'AIzaSyBgsOEHSTy0pCKc6kq__FrJt_Pl3GBGBnY',
  authDomain: 'prayers-be161.firebaseapp.com',
  projectId: 'prayers-be161',
  storageBucket: 'prayers-be161.appspot.com',
  messagingSenderId: '946674115385',
  appId: '1:946674115385:web:942da346b4b549d44ebee8',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  dayjs.extend(customParseFormat)

  const today = dayjs().tz('America/Toronto')
  const docRef = doc(db, 'times', today.format('MM-DD'))
  const docSnap = await getDoc(docRef)
  const prayers = docSnap.data()

  Object.keys(prayers).forEach((name) => {
    const add = dayjs().utcOffset() === -240 ? 1 : 0
    prayers[name] = dayjs(`${dayjs().format('YYYY-MM-DD')} ${prayers[name]}`)
      .add(add, 'hours')
      .format('h:mm')
  })

  res.status(200).json(prayers)
}
