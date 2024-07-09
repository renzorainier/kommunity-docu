import React from 'react';

function Attendance({ userData }) {
  console.log(userData);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-10 bg-gray-100">
      {userData && (
        <div className="w-full max-w-4xl bg-white text-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-8">
            <div className="text-white font-bold text-3xl text-center">{userData.name}'s Attendance</div>
          </div>
          <div className="px-8 py-6">
            {Object.keys(userData.attendance).length > 0 ? (
              <div>
                <div className="grid grid-cols-4 gap-4 bg-gray-200 p-4 rounded-lg shadow-sm">
                  <div className="font-semibold text-lg text-center text-gray-700">Date</div>
                  <div className="font-semibold text-lg text-center text-gray-700">Day</div>
                  <div className="font-semibold text-lg text-center text-gray-700">Check-in</div>
                  <div className="font-semibold text-lg text-center text-gray-700">Check-out</div>
                </div>
                <div className="divide-y divide-gray-200">
                  {Object.keys(userData.attendance)
                    .sort((a, b) => new Date(b) - new Date(a)) // Sort keys in descending order
                    .map((date) => (
                      <div key={date} className="grid grid-cols-4 bg-white p-4 hover:bg-gray-50 transition duration-300">
                        <div className="text-sm text-center text-gray-600">{new Date(date).toLocaleDateString(undefined, { weekday: 'short' })}</div>
                        <div className="font-medium text-center text-gray-800">{new Date(date).toLocaleDateString()}</div>
                        <div className="text-sm text-center text-gray-600">
                          {userData.attendance[date].checkIn
                            ? new Date(userData.attendance[date].checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'N/A'}
                        </div>
                        <div className="text-sm text-center text-gray-600">
                          {userData.attendance[date].checkOut
                            ? new Date(userData.attendance[date].checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'N/A'}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <p className="text-center mt-4 text-gray-600">No attendance records found.</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default Attendance;
