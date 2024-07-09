import React, { useState } from "react";
import { db } from "./firebase.js";
import { updateDoc, doc, getDoc, setDoc } from "firebase/firestore";

const MockAttendanceGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateMockData = async () => {
    setIsGenerating(true);

    const userId = "z4yeXSKFmagyBOI3g7jnRyoyaPW2";
    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(today.getMonth() + 1); // One month from now

    const dates = getWeekdayDatesBetween(today, endDate); // Filter weekdays only
    const attendanceData = {};

    dates.forEach((date) => {
      const formattedDate = formatDate(date);
      attendanceData[formattedDate] = {
        checkIn: generateRandomTime(date),
        checkOut: generateRandomTime(date),
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

  const generateRandomTime = (date) => {
    const randomHour = Math.floor(Math.random() * 24);
    const randomMinute = Math.floor(Math.random() * 60);
    date.setHours(randomHour, randomMinute);
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
