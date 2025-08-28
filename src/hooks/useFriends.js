'use client'
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import toast from 'react-hot-toast';

export const useFriends = () => {
  const { currentUser, refreshUser } = useContext(UserContext);
  const [friends, setFriends] = useState([]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendName, setNewFriendName] = useState("");
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchFriends = async () => {
      try {
        const res = await fetch(`/api/friends/${currentUser._id}`);
        if (res.ok) {
          const data = await res.json();
          setFriends(data);
        }
      } catch (err) {
        console.error('Failed to fetch friends:', err);
      }
    };

    fetchFriends();
  }, [currentUser]);

  const fetchFriendsAndRequests = async ()=> {
    if (!currentUser?._id) return;
    try {
      const [friendsRes, requestsRes] = await Promise.all([
        fetch(`/api/friends/${currentUser._id}`),
        fetch(`/api/friend-requests/user/${currentUser._id}`)
      ])

      if (friendsRes.ok) {
        const data = await friendsRes.json();
        setFriends(Array.isArray(data) ? data : data.friends || [])
      }
      if (requestsRes.ok) {
        const data = await requestsRes.json();
        setRequests(Array.isArray(data) ? data : data.requests || [])
      }
    } catch (err) {
      console.error('Failed to fetch friends/requests:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=> {
    fetchFriendsAndRequests()
  }, [currentUser?._id])

  const addFriend = async (username) => {
    if (!currentUser?._id || !username.trim()) {
      return { success: false, message: 'Missing user ID or username' }
    }

    try {
      const res = await fetch(`/api/friend-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromId: currentUser._id, toUsername: username })
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.error || res.statusText }
      }
      fetchFriendsAndRequests();
      return { success: true, message: data.message || 'Friend request sent successfully' }
    
    } catch (err) {
      return { success: false, message: err.message || 'Add friend failed' }
    }
  };

  const removeFriend = async (friendId) => {
    if (!friendId) {
      return { success: false, message: 'Friend ID is required' };
    }

    if (!currentUser?._id) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const res = await fetch(`/api/friends/${currentUser._id}`, { 
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId }), 
      });

      let data = {};

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch (jsonError) {
          console.warn('Failed to parse JSON response:', jsonError);
          data = {};
        }
      }

      if (!res.ok) {
        return { success: false, message: data.error || `Failed to remove friend (${res.status})` };
      }

      await fetchFriendsAndRequests();
      return { success: true, message: data.message || 'Friend removed successfully' };

    } catch (err) {
      console.error("Remove friend failed:", err);
      return { success: false, message: err.message || 'Remove friend failed' };
    }
  };

  const acceptRequest = async (requestId) => {
    if (!requestId) {
      return { success: false, message: 'Request ID is required' };
    }

    try {
      const res = await fetch(`/api/friend-requests/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept" })
      });

      let data = {};
    
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch (jsonError) {
          console.warn('Failed to parse JSON response:', jsonError);
          data = {};
        }
      }

      if (!res.ok) {
        return { success: false, message: data.error || `Failed to accept request (${res.status})` };
      }

      await fetchFriendsAndRequests();
      return { success: true, message: data.message || 'Friend request accepted' };

    } catch (err) {
      console.error("Accept request failed:", err);
      return { success: false, message: err.message || 'Accept request failed' };
    }
  };

  const rejectRequest = async (requestId) => {
    if (!requestId) {
      return { success: false, message: 'Request ID is required' };
    }

    try {
      const res = await fetch(`/api/friend-requests/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" })
      });

      let data = {};
    
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch (jsonError) {
          console.warn('Failed to parse JSON response:', jsonError);
          data = {};
        }
      }

      if (!res.ok) {
        return { success: false, message: data.error || `Failed to reject request (${res.status})` };
      }

      await fetchFriendsAndRequests();
      return { success: true, message: data.message || 'Friend request rejected' };

    } catch (err) {
      console.error("Reject request failed:", err);
      return { success: false, message: err.message || 'Reject request failed' };
    }
  };

  return {
    friends,
    showAddFriend,
    setShowAddFriend,
    newFriendName,
    setNewFriendName,
    addFriend,
    removeFriend,
    requests,
    acceptRequest,
    rejectRequest,
    loading
  };
};