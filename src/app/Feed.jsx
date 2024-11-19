'use client';

export default function Feed({ postData }) {
  if (!postData) {
    return <div className="text-center text-gray-600">No posts available.</div>;
  }

  const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp.seconds * 1000);
    return dateObj.toLocaleString(); // Convert to a readable date string
  };

  return (
    <div className="feed max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Posts Feed</h2>
      {Object.entries(postData).map(([date, posts]) => (
        <div key={date} className="date-group mb-8">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">{date}</h3>
          <div className="posts space-y-6">
            {Object.entries(posts).map(([postId, postDetails]) => (
              <div key={postId} className="post border border-gray-200 rounded-lg p-4 bg-white shadow-md">
                <p className="text-sm text-gray-500"><strong>Posted by:</strong> {postDetails.name}</p>
                <p className="text-sm text-gray-500"><strong>Date:</strong> {formatDate(postDetails.date)}</p>
                <p className="text-gray-700 mt-2"><strong>Caption:</strong> {postDetails.caption}</p>
                {postDetails.postPicRef && (
                  <p className="text-gray-700 mt-2"><strong>Picture Reference:</strong> {postDetails.postPicRef}</p>
                )}
                <p className="text-gray-500 mt-2"><strong>User ID:</strong> {postDetails.userID}</p>
                <p className="text-gray-500"><strong>User Profile Ref:</strong> {postDetails.userProfileRef}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
