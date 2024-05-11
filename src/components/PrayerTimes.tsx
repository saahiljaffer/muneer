const people = [
  {
    name: 'Imsak',
    adhan: '5:00 AM',
    iqamah: '5:15 AM',
  },
  {
    name: 'Fajr',
    adhan: '5:15 AM',
    iqamah: '5:15 AM',
  },
  {
    name: 'Sunrise',
    adhan: '7:00 AM',
    iqamah: '7:15 AM',
  },
  {
    name: 'Dhuhr',
    adhan: '12:00 PM',
    iqamah: '12:15 PM',
  },
  {
    name: 'Sunset',
    adhan: '6:00 PM',
    iqamah: '6:15 PM',
  },
  {
    name: 'Maghrib',
    adhan: '6:15 PM',
    iqamah: '6:15 PM',
  },
  // More people...
]

export default function PrayerTimes() {
  return (
    <div className="space-y-6">
      <div className="flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle ">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="tabular-nums min-w-full divide-y divide-slate-300">
                <thead className="bg-slate-100">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6"
                    ></th>
                    <th
                      scope="col"
                      className="text-end px-3 py-3.5 text-sm font-semibold text-slate-900"
                    >
                      Adhan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {people.map((person) => (
                    <tr key={person.name}>
                      <td className="text-end whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                        {person.name}
                      </td>
                      <td className="text-end whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                        {person.adhan}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
