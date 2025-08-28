'use client'
import React from 'react';
import toast from 'react-hot-toast';

const AddFriendForm = ({ 
  showAddFriend, 
  setShowAddFriend, 
  newFriendName, 
  setNewFriendName, 
  addFriend 
}) => {
  if (!showAddFriend) return null;

  const handleAdd = async ()=> {
    const result = await addFriend(newFriendName)
    if (result?.success) {
      toast.success('Friend request sent!')
      setNewFriendName('')
      setShowAddFriend(false)
    } else {
      toast.error(result?.message || 'Failed to send request')
    }
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <input
        type="text"
        placeholder="Enter friend's username"
        value={newFriendName}
        onChange={(e) => setNewFriendName(e.target.value)}
        className="w-full p-2 border rounded-lg mb-2 text-black"
      />
      <div className="flex gap-2">
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm"
        >
          Add
        </button>
        <button
          onClick={() => setShowAddFriend(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddFriendForm;