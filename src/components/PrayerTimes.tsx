const people = [
  {
    name: 'fajr',
    adhan: '5:00 AM',
    iqamah: '5:15 AM',
  },
  {
    name: 'dhuhr',
    adhan: '1:00 PM',
    iqamah: '1:15 PM',
  },
  {
    name: 'asr',
    adhan: '3:00 PM',
    iqamah: '3:15 PM',
  },
  {
    name: 'maghrib',
    adhan: '5:00 PM',
    iqamah: '5:15 PM',
  },
  {
    name: 'isha',
    adhan: '7:00 PM',
    iqamah: '7:15 PM',
  },
]

export default function Example() {
  return (
    <div className="lg:col-start-8 lg:col-end-13 lg:row-start-2 xl:col-start-9">
      <div className="flow-root">
        <div className="overflow-x-auto ">
          <div className="inline-block min-w-full align-middle ">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Adhan
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Iqamah
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {people.map((person) => (
                    <tr key={person.name}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {person.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.adhan}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.iqamah}
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
