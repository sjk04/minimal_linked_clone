import axios from "axios";
import { useState, useEffect } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [newpost, setNewpost] = useState("");
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  
  //newly added----------------------------
const [users, setUsers] = useState([]);
const [selectedUser, setSelectedUser] = useState(null);
const [userPosts, setUserPosts] = useState([]);

// Fetch all users
useEffect(() => {
  const token = localStorage.getItem("token");
  axios
    .get("http://localhost:4000/users", {
      headers: { token: token },
    })
    .then((res) => {
      setUsers(res.data);
    });
}, []);

// View a user's profile
function viewUserProfile(userId) {
  const token = localStorage.getItem("token");
  axios
    .get(`http://localhost:4000/user/${userId}`, {
      headers: { token },
    })
    .then((res) => {
      setSelectedUser(res.data);
    });

  axios
    .get(`http://localhost:4000/user/${userId}/posts`, {
      headers: { token },
    })
    .then((res) => {
      setUserPosts(res.data);
    });
}

// Return to main feed
function returnToFeed() {
  setSelectedUser(null);
  setUserPosts([]);
}
//---------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:4000/post", {
        headers: { token: token },
      })
      .then((res) => {
        setPosts(res.data.post);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:4000/me", {
        headers: { token: token },
      })
      .then((res) => {
        setFollowing(res.data.following.map(id=>id.toString()));
      });
  }, []);

  function logout() {
    localStorage.removeItem("token");
    window.location = "/signup";
  }

  function addPost() {
    const token = localStorage.getItem("token");
    axios
      .post(
        "http://localhost:4000/post",
        {
          post: newpost,
        },
        {
          headers: { token: token },
        }
      )
      .then(() => {
        window.location.reload();
      });
  }
  function handleLike(postId) {
    const token = localStorage.getItem("token");
    axios
      .post(
        `http://localhost:4000/like/${postId}`,
        {},
        {
          headers: { token },
        }
      )
      .then(() => {
        axios
          .get("http://localhost:4000/post", {
            headers: { token },
          })
          .then((res) => {
            setPosts(res.data.post);
          });
      });
  }
  function handleDislike(postId) {
    const token = localStorage.getItem("token");
    axios
      .post(
        `http://localhost:4000/dislike/${postId}`,
        {},
        {
          headers: { token },
        }
      )
      .then(() => {
        axios
          .get("http://localhost:4000/post", {
            headers: { token },
          })
          .then((res) => {
            setPosts(res.data.post);
          });
      });
  }
  function followuser(userid) {
    const token = localStorage.getItem("token");
    axios
      .post(
        `http://localhost:4000/follow/${userid}`,
        {},
        {
          headers: { token },
        }
      )
      .then((res) => {
        // const follow = res.data.message;
        // alert(follow);

        axios.get("http://localhost:4000/me", {
          headers: { token },
        }).then((res)=>{
          setFollowing(res.data.following.map(id=>id.toString()))
        })
      });
  }

  function unfollowuser(userid) {
    const token = localStorage.getItem("token");
    axios
      .post(
        `http://localhost:4000/unfollow/${userid}`,
        {},
        {
          headers: { token },
        }
      )
      .then((res) => {
       // alert(res.data.message);

        axios
          .get("http://localhost:4000/me", {
            headers: { token },
          })
          .then((res) => {
            setFollowing(res.data.following.map(id=>id.toString()));
          });
      });
  }

  return (
  <div className="dashboard-container">
    <h2>Dashboard</h2>
    <button className="logout-btn" onClick={logout}>
      Logout
    </button>
    <br />
    
    {selectedUser ? (
      <div className="user-profile">
        <button onClick={returnToFeed}>← Back to feed</button>
        <h3>{selectedUser.name}'s Profile</h3>
        <p>Email: {selectedUser.email}</p>
        
        <div className="user-posts">
          <h4>Posts</h4>
          {userPosts.map((p, i) => (
            <div key={i} className="post-card">
              <div className="post-content">{p.post}</div>
              <div style={{ display: "flex" }}>
                <button onClick={() => handleLike(p._id)}>Like</button>
                <p>{p.likes} likes</p>
                <button onClick={() => handleDislike(p._id)}>Dislike</button>
                <p>{p.dislikes} dislikes</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <>
        <div className="new-post">
          <input
            type="text"
            placeholder="your post"
            value={newpost}
            onChange={(e) => setNewpost(e.target.value)}
          />
          <button onClick={addPost}>add post</button>
        </div>
        
        <div className="users-list">
          <h3>Discover People</h3>
          {users.map((user) => (
            <div key={user._id} className="user-card">
              <p>{user.name}</p>
              <button onClick={() => viewUserProfile(user._id)}>View Profile</button>
              {following.includes(user._id) ? (
                <button onClick={() => unfollowuser(user._id)}>Following</button>
              ) : (
                <button onClick={() => followuser(user._id)}>Follow +</button>
              )}
            </div>
          ))}
        </div>
        
        <div className="post-list">
          <h3>Your Feed</h3>
          {posts.map((p, i) => (
            <div key={i} className="post-card">
              <div className="post-user" onClick={() => viewUserProfile(p.userid._id)}>
                {p.userid.name}
              </div>
              <div className="post-content">{p.post}</div>
              <div style={{ display: "flex" }}>
                <button onClick={() => handleLike(p._id)}>Like</button>
                <p>{p.likes} likes</p>
                <button onClick={() => handleDislike(p._id)}>Dislike</button>
                <p>{p.dislikes} dislikes</p>
                {following.includes(p.userid._id.toString()) ? (
                  <button onClick={() => unfollowuser(p.userid._id)}>
                    Following
                  </button>
                ) : (
                  <button onClick={() => followuser(p.userid._id)}>
                    Follow +
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);

}
export default Dashboard;
