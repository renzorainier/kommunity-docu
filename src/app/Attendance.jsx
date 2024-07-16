import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import './Attendance.css'; // If needed for additional styles

function Attendance({ userData }) {
  const { ref: wrapperRef, inView: wrapperInView } = useInView({
    triggerOnce: true,
  });

  const handleScroll = (entries) => {
    entries.forEach((entry) => {
      const listItem = entry.target;
      if (entry.isIntersecting) {
        listItem.classList.add('item-focus');
      } else {
        listItem.classList.remove('item-focus');
      }
    });
  };

  useEffect(() => {
    setTimeout(() => {
      const observer = new IntersectionObserver(handleScroll, {
        threshold: 0.5,
      });

      const items = document.querySelectorAll('.js-scroll-list-item');
      items.forEach((item) => observer.observe(item));

      return () => {
        items.forEach((item) => observer.unobserve(item));
      };
    }, 100); // Adjust the delay if necessary
  }, [userData]);

  const renderAttendanceRecords = () => {
    if (Object.keys(userData.attendance).length === 0) {
      return <p className="text-center mt-4 text-gray-600">No attendance records found.</p>;
    }

    let currentWeek = null;

    return (
      <div>
        {Object.keys(userData.attendance)
          .sort((a, b) => new Date(b) - new Date(a)) // Sort keys in descending order
          .map((date, index) => {
            const recordDate = new Date(date);
            const weekNumber = getWeekNumber(recordDate);

            // Display week header if it's a new week
            let weekHeader = null;
            if (weekNumber !== currentWeek) {
              currentWeek = weekNumber;
              weekHeader = (
                <div key={`week-${index}`} className="text-lg font-semibold mt-4">
                  Week {currentWeek}
                </div>
              );
            }
            return (
              <React.Fragment key={`attendance-${index}`}>
                {weekHeader}
                <div className="grid grid-cols-4 gap-2 rounded-lg shadow-md p-4 js-scroll-list-item transition duration-300 hover:shadow-lg">
                  <div className={`font-semibold text-lg rounded-lg text-white text-center py-2 ${
                    recordDate.getDay() === 1 ? 'bg-[#025172]' : // Monday
                    recordDate.getDay() === 2 ? 'bg-[#03597E]' : // Tuesday
                    recordDate.getDay() === 3 ? 'bg-[#05719E]' : // Wednesday
                    recordDate.getDay() === 4 ? 'bg-[#067EB0]' : // Thursday
                    recordDate.getDay() === 5 ? 'bg-[#078CC4]' : '' // Friday
                  }`}>
                    {recordDate.toLocaleDateString(undefined, {
                      weekday: 'short',
                    })}
                  </div>
                  <div className="text-lg text-center py-2">{recordDate.toLocaleDateString()}</div>
                  <div className="text-lg text-center py-2">
                    {userData.attendance[date].checkIn
                      ? new Date(userData.attendance[date].checkIn).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'N/A'}
                  </div>
                  <div className="text-lg text-center py-2">
                    {userData.attendance[date].checkOut
                      ? new Date(userData.attendance[date].checkOut).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'N/A'}
                  </div>
                </div>
              </React.Fragment>
            );


          })}
      </div>
    );
  };

  const getWeekNumber = (date) => {
    // Calculate the start of the school year (July 22, 2024)
    const schoolYearStart = new Date(2024, 6, 22); // Note: Months are zero-indexed (6 = July)

    // Calculate the difference in milliseconds
    const diffMilliseconds = date.getTime() - schoolYearStart.getTime();

    // Calculate the difference in weeks
    const oneWeekMilliseconds = 1000 * 60 * 60 * 24 * 7;
    const weekNumber = Math.floor(diffMilliseconds / oneWeekMilliseconds) + 1;

    return weekNumber;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center pt-12">
      {userData ? (
        <div
          className="w-full max-w-4xl bg-white text-gray-800 shadow-lg rounded-lg pt-2 overflow-hidden"
          ref={wrapperRef}
        >
          <div className="bg-gradient-to-r from-[#035172] to-[#0587be] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative text-white font-bold text-3xl text-center">Attendance Records</div>
            <div className="text-white text-lg text-center">{userData.name}</div>
          </div>

          <div className="px-6 py-4">{renderAttendanceRecords()}</div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}

export default Attendance;
