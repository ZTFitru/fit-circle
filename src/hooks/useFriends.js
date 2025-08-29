'use client'
import { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '@/context/UserContext';
import toast from 'react-hot-toast';

export const useFriends = () => {
  const { currentUser, refreshUser } = useContext(UserContext);
  const [friends, setFriends] = useState([]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendName, setNewFriendName] = useState("");
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const addFriendInProgress = useRef(false);
  const removeFriendInProgress = useRef(false);

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
    if (addFriendInProgress.current) {
      console.log('Add friend already in progress, ignoring duplicate call');
      return { success: false, message: 'Request already in progress' };
    }

    addFriendInProgress.current = true;

    try {
      if (!currentUser?._id || !username.trim()) {
        const message = 'Missing user ID or username';
        toast.error(message);
        return { success: false, message }
      }

      const res = await fetch(`/api/friend-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromId: currentUser._id, toUsername: username })
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data.error || res.statusText;
        toast.error(message);
        return { success: false, message }
      }
      
      await fetchFriendsAndRequests();
      const successMessage = data.message || 'Friend request sent successfully';
      toast.success(successMessage);
      return { success: true, message: successMessage }
    
    } catch (err) {
      const message = err.message || 'Add friend failed';
      toast.error(message);
      return { success: false, message }
    } finally {
      setTimeout(() => {
        addFriendInProgress.current = false;
      }, 1000);
    }
  };

  const removeFriend = async (friendId) => {
    if (removeFriendInProgress.current) {
      console.log('Remove friend already in progress, ignoring duplicate call');
      return { success: false, message: 'Request already in progress' };
    }

    removeFriendInProgress.current = true;

    try {
      if (!friendId) {
        const message = 'Friend ID is required';
        toast.error(message);
        return { success: false, message };
      }

      if (!currentUser?._id) {
        const message = 'User not authenticated';
        toast.error(message);
        return { success: false, message };
      }

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
        const message = data.error || `Failed to remove friend (${res.status})`;
        toast.error(message);
        return { success: false, message };
      }

      await fetchFriendsAndRequests();
      if (refreshUser) {
        refreshUser();
      }
      const successMessage = data.message || 'Friend removed successfully';
      toast.success(successMessage);
      return { success: true, message: successMessage };

    } catch (err) {
      console.error("Remove friend failed:", err);
      const message = err.message || 'Remove friend failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setTimeout(() => {
        removeFriendInProgress.current = false;
      }, 1000);
    }
  };

  const acceptRequest = async (requestId) => {
    if (!requestId) {
      const message = 'Request ID is required';
      toast.error(message);
      return { success: false, message };
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
        const message = data.error || `Failed to accept request (${res.status})`;
        toast.error(message);
        return { success: false, message };
      }

      await fetchFriendsAndRequests();
      if (refreshUser) {
        refreshUser();
      }
      const successMessage = data.message || 'Friend request accepted';
      toast.success(successMessage);
      return { success: true, message: successMessage };

    } catch (err) {
      console.error("Accept request failed:", err);
      const message = err.message || 'Accept request failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const rejectRequest = async (requestId) => {
    if (!requestId) {
      const message = 'Request ID is required';
      toast.error(message);
      return { success: false, message };
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
        const message = data.error || `Failed to reject request (${res.status})`;
        toast.error(message);
        return { success: false, message };
      }

      await fetchFriendsAndRequests();
      const successMessage = data.message || 'Friend request rejected';
      toast.success(successMessage);
      return { success: true, message: successMessage };

    } catch (err) {
      console.error("Reject request failed:", err);
      const message = err.message || 'Reject request failed';
      toast.error(message);
      return { success: false, message };
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