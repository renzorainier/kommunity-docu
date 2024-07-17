import React, { useState } from "react";
import { db } from "./firebase.js";
import { updateDoc, doc } from "firebase/firestore";

const MockAttendanceGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateMockData = async () => {
    setIsGenerating(true);

    const userId = "84SZqxa281diLISPBpQFxiSqCN73";
    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(today.getMonth() + 1); // One month from now

    const dates = getWeekdayDatesBetween(today, endDate); // Filter weekdays only
    const attendanceData = {};

    dates.forEach((date) => {
      const formattedDate = formatDate(date);
      attendanceData[formattedDate] = {
        checkIn: generateRandomCheckInTime(date),
        checkOut: generateRandomCheckOutTime(date),
      };
    });

    try {
      await updateDoc(doc(db, "users", userId), {
        attendance: attendanceData,
      });
      console.log("Mock attendance data updated successfully.");
    } catch (error) {
      console.error("Error updating mock attendance data:", error);
    }

    setIsGenerating(false);
  };

  const getWeekdayDatesBetween = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // Exclude Sunday (0) and Saturday (6)
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const generateRandomCheckInTime = (date) => {
    // Generate random time between 7:00 AM (07:00) and 8:15 AM (08:15)
    const startHour = 7;
    const endHour = 8;
    const hour = startHour + Math.floor(Math.random() * (endHour - startHour + 1));
    const minute = Math.floor(Math.random() * 16); // Random minute between 0 and 15
    date.setHours(hour, minute);
    return date.toISOString();
  };

  const generateRandomCheckOutTime = (date) => {
    // Generate random time between 12:00 PM (12:00) and 4:00 PM (16:00)
    const startHour = 15;
    const endHour = 16;
    const hour = startHour + Math.floor(Math.random() * (endHour - startHour + 1));
    const minute = Math.floor(Math.random() * 60); // Random minute between 0 and 59
    date.setHours(hour, minute);
    return date.toISOString();
  };

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleGenerateMockData}
        disabled={isGenerating}
      >
        {isGenerating ? "Generating..." : "Generate Mock Attendance Data"}
      </button>
    </div>
  );
};

export default MockAttendanceGenerator;
