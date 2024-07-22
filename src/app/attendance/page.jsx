import { useUserData } from '@/app/UserDataContext';

const Attendance = () => {
  const { userData } = useUserData();

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Attendance Data</h1>
      {/* Render the attendance data here */}
      <pre>{JSON.stringify(userData, null, 2)}</pre>
    </div>
  );
};

export default Attendance;
