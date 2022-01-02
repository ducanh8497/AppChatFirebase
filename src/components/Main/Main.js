import {
  addDoc,
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import InputEmoji from "react-input-emoji";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { checkText } from "smile2emoji";
import { db } from "../../firebase";
import "./main.css";
import { logout } from "../../redux/actions/user";
import useWindowSize from "../../hooks/useWindowSize";
import { Alert } from "react-bootstrap";
import { CAvatar } from "@coreui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { Profile } from "../Profile/Profile";
import { v4 as uuid } from "uuid";
import { Menu, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";

const IMAGE_DEFAULT = "https://bootdey.com/img/Content/avatar/avatar1.png";

const ChatHeader = ({ name, chatUserImage }) => {
  return (
    <div className="chat-header clearfix">
      <div className="row">
        <div className="col-lg-6 d-flex">
          <a href="#" data-target="#view_info">
            <CAvatar src={chatUserImage || IMAGE_DEFAULT} />
          </a>
          <h6 className="m-b-0 mt-1 name-user">{name}</h6>
        </div>
      </div>
    </div>
  );
};

const ChatHistory = ({ conversations, uid, chatUserImage }) => {
  const convert = (mess) => {
    var exp =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    var mess1 = mess.replace(exp, "<a href='$1'>$1</a>");
    var exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    return mess1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
  };

  const [hasBeenSeen, setHasBeenSeen] = useState(false);

  useEffect(() => {
    const objDiv = document.getElementById("chat-his");
    objDiv.scrollTop = objDiv.scrollHeight;

    // const latestMess = conversations.find(
    //   (x, idx) => idx === conversations.length - 1
    // )?.isView;
    // setHasBeenSeen(latestMess);
  }, [conversations]);

  return (
    <div className="chat-history" id="chat-his">
      <ul className="m-b-0">
        {conversations.map((con, index) => (
          <li className="clearfix" key={index}>
            {con.user_uid_1 === uid ? (
              <>
                <div
                  className="message other-message float-right"
                  title={new Date(con.createAt.seconds * 1000).toLocaleString()}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: checkText(convert(con.message)),
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <div
                  className="message-data"
                  title={new Date(con.createAt.seconds * 1000).toLocaleString()}
                >
                  <CAvatar src={chatUserImage || IMAGE_DEFAULT} />
                  <div
                    className="message my-message"
                    dangerouslySetInnerHTML={{ __html: convert(con.message) }}
                  />
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {hasBeenSeen && (
        <span className="float-right fst-italic fw-bold">
          Đã xem lúc {new Date().toLocaleString()}
        </span>
      )}
    </div>
  );
};

const Main = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [chatStarted, setChatStarted] = useState(false);
  const [chatUser, setChatUser] = useState("");
  const [message, setMessage] = useState("");
  const [userUid, setUserUid] = useState(null);
  const [allUser, setAllUser] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [chatUserImage, setChatUserImage] = useState();
  const windowSize = useWindowSize();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState();

  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    onSnapshot(doc(db, "users", user?.uid), (doc) => {
      const user = doc.data();
      setUserInfo(user);
    });
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const getRealtimeUsers = () => {
    const q = query(collection(db, "users"));
    onSnapshot(q, (querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().uid !== user.uid) {
          users.push(doc.data());
        }
      });
      setAllUser(users);
    });
  };

  useEffect(() => {
    getRealtimeUsers();
  }, []);

  const getRealtimeConversations = async (personIdSend, personIdReceive) => {
    const q = await query(
      collection(db, "conversations"),
      where("user_uid_1", "in", [personIdSend, personIdReceive])
    );

    onSnapshot(q, (querySnapshot) => {
      const tmp = [];
      querySnapshot.forEach((doc) => {
        if (
          (doc.data().user_uid_1 === personIdSend &&
            doc.data().user_uid_2 === personIdReceive) ||
          (doc.data().user_uid_1 === personIdReceive &&
            doc.data().user_uid_2 === personIdSend)
        ) {
          tmp.push(doc.data());
        }
      });
      const listConversationsSort = tmp.sort((a, b) => a.createAt - b.createAt);
      setConversations(listConversationsSort);
    });
  };
  const updateConversationsAreView = async (personIdSend, personIdReceive) => {
    const q = await query(
      collection(db, "conversations"),
      where("user_uid_1", "in", [personIdSend, personIdReceive])
    );
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((docs) => {
        if (// chỉ update state isView cho message có uid_1 = người nhận
          (docs.data().user_uid_1 === personIdReceive &&
            docs.data().user_uid_2 === personIdSend)
        ) {
          const convers = doc(db, "conversations", docs.id);
          updateDoc(convers, {
            isView: true,
          });
        }
      });
    });
  }
  useEffect(() => {
    const usermessages = [] 
    const q =  query(
      collection(db, "conversations"),
      where("user_uid_1", "==", user.uid || "user_uid_2", "==", user.uid )
    );
    // lấy tất cả tin nhắn của user
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((docs) => {
        console.log(docs.data())
        usermessages.push(docs.data())
       
      });
    });
    
  }, [])
  
  const initChat = async (userChat) => {
    navigate("/");
    setChatUser(userChat.name);
    setChatUserImage(userChat.urlImage);
    setUserUid(userChat.uid);
    setChatStarted(true);
    if (user?.uid && userChat?.uid) {
      getRealtimeConversations(user?.uid, userChat?.uid);
    }
    updateConversationsAreView(user?.uid, userChat?.uid);
  };

  const submitMessage = async () => {
    const msgObj = {
      user_uid_1: user.uid,
      user_uid_2: userUid,
      message,
      uid: uuid(),
    };

    if (message.trim() !== "") {
      await addDoc(collection(db, "conversations"), {
        ...msgObj,
        isView: false,
        createAt: new Date(),
      })
        .then(() => {
          setConversations([]);
          getRealtimeConversations(user?.uid, userUid);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const signOut = () => {
    dispatch(logout(user.uid));
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={showDrawer}>
        User profile
      </Menu.Item>
      <Menu.Item key="2" onClick={signOut}>
        Logout
      </Menu.Item>
    </Menu>
  );

  if (!user.authenticated) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <div className="container">
      {windowSize.width < 768 ? (
        <>
          <Dropdown.Button
            overlay={menu}
            placement="bottomCenter"
            icon={<UserOutlined />}
          >
            {user.name}
          </Dropdown.Button>
          <div className="list-user">
            {allUser?.map((x) => (
              <div
                key={x.uid}
                title={x?.name}
                onClick={() => initChat(x)}
                className="ml-2 mt-3"
              >
                <CAvatar
                  src={x?.urlImage || IMAGE_DEFAULT}
                  status={x?.isOnline ? "success" : "danger"}
                  style={{ marginLeft: 10 }}
                />
              </div>
            ))}
          </div>
          <div className="chat pt-2">
            {chatStarted ? (
              <>
                <ChatHeader name={chatUser} chatUserImage={chatUserImage} />
                <ChatHistory
                  conversations={conversations}
                  uid={user.uid}
                  chatUserImage={chatUserImage}
                />
                <div className="row reply">
                  <InputEmoji
                    value={message}
                    onChange={setMessage}
                    cleanOnEnter
                    onEnter={submitMessage}
                    placeholder="Type a message"
                  />
                </div>
              </>
            ) : (
              <Alert className="m-3">
                Please choose a friend to start a conversation
              </Alert>
            )}
          </div>
        </>
      ) : (
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card chat-app mt-5">
              <div id="plist" className="people-list">
                <div className="d-flex justify-content-between heading">
                  <div className="heading-avatar">
                    <div className="heading-avatar-icon mb-2">
                      <img src={user?.urlImage || IMAGE_DEFAULT} alt="#" />
                    </div>
                  </div>
                  <div className="w-100">
                    <Dropdown.Button
                      overlay={menu}
                      placement="bottomCenter"
                      icon={<UserOutlined />}
                    >
                      {user.name}
                    </Dropdown.Button>
                  </div>
                </div>
                <hr />
                <ul className="list-unstyled chat-list mt-2 mb-0">
                  {allUser?.map((x) => (
                    <li
                      className={
                        userUid === x.uid ? "clearfix active" : "clearfix"
                      }
                      onClick={() => initChat(x)}
                      key={x.uid}
                    >
                      <CAvatar
                        src={x?.urlImage || IMAGE_DEFAULT}
                        status={x?.isOnline ? "success" : "danger"}
                        className="mt-1"
                      />
                      <div className="about">
                        <div className="name">{x.name}</div>
                        <div className="status">
                          You: ừ
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="chat">
                {chatStarted ? (
                  <>
                    <ChatHeader name={chatUser} chatUserImage={chatUserImage} />
                    <ChatHistory
                      conversations={conversations}
                      uid={user.uid}
                      chatUserImage={chatUserImage}
                    />
                    <div className="row reply">
                      <InputEmoji
                        value={message}
                        onChange={setMessage}
                        cleanOnEnter
                        onEnter={submitMessage}
                        placeholder="Type a message"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <Alert className="m-3">
                      Please choose a friend to start a conversation
                    </Alert>
                    <img
                      src="https://www.tawk.to/wp-content/uploads/2020/08/Live-chat.png"
                      style={{ width: 300 }}
                      className="mt-5"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <Profile data={userInfo} onClose={onClose} visible={visible} />
    </div>
  );
};

export default Main;
