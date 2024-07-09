import React from 'react';

function Attendance({ userData }) {
    console.log(userData)
  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-10">
      {userData && (
        <div className="w-full max-w-4xl bg-white text-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-4">
            <div className="text-white font-bold text-3xl text-center">{userData.name}'s Attendance</div>
          </div>
          <div className="px-6 py-4">
            {Object.keys(userData.attendance).length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {Object.keys(userData.attendance)
                  .sort((a, b) => new Date(b) - new Date(a)) // Sort keys in descending order
                  .map((date) => (
                    <div key={date} className="bg-gray-100 rounded-lg shadow-md p-4 hover:bg-gray-200 transition duration-300">
                      <div className="flex justify-between">
                        <div className="font-semibold text-lg text-center">{new Date(date).toLocaleDateString()}</div>
                        <div className="flex space-x-4">
                          <div className="text-sm text-center">
                            {userData.attendance[date].checkIn
                              ? new Date(userData.attendance[date].checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : 'N/A'}
                          </div>
                          <div className="text-sm text-center">
                            {userData.attendance[date].checkOut
                              ? new Date(userData.attendance[date].checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
