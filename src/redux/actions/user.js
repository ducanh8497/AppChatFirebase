import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, db } from "../../firebase";
import { USER } from "./const";

export const signInWithFacebook = () => {
  return async (dispatch) => {
    dispatch({ type: `${USER.USER_LOGIN}_REQUEST` });
    const provider = new FacebookAuthProvider();
    await signInWithPopup(auth, provider)
      .then((result) => {
        const userf = result.user;
        getDoc(doc(db, "users", userf.uid)).then((docSnap) => {
          if (docSnap.exists()) {
            const userRef = doc(db, "users", userf.uid);
            // console.log(userRef);
            updateDoc(userRef, {
              isOnline: true,
            });
            dispatch({
              type: `${USER.USER_LOGIN}_SUCCESS`,
              payload: { user: docSnap.data() },
            });
          } else {
            console.log("No such document!");
            setDoc(doc(db, "users", userf.uid), {
              uid: userf.uid,
              name: userf.displayName,
              dayOfbirth: "",
              gender: "",
              isOnline: true,
              isChat: false,
            })
              .then(() => {
                //success
                const loggedInUser = {
                  uid: userf.uid,
                  dayOfbirth: userf.displayName,
                  dayofbirth: "",
                  gender: "",
                  isOnline: true,
                  isChat: false,
                };

                dispatch({
                  type: `${USER.USER_LOGIN}_SUCCESS`,
                  payload: { user: loggedInUser },
                });
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
      })
      .catch((error) => {
        // Handle Errors here.
        console.log(error);
      });
  };
};

export const signInWithGoogle = () => {
  return async (dispatch) => {
    dispatch({ type: `${USER.USER_LOGIN}_REQUEST` });
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider)
      .then((result) => {
        const userf = result.user;
        getDoc(doc(db, "users", userf.uid)).then((docSnap) => {
          if (docSnap.exists()) {
            const userRef = doc(db, "users", userf.uid);
            updateDoc(userRef, {
              isOnline: true,
            });
            dispatch({
              type: `${USER.USER_LOGIN}_SUCCESS`,
              payload: { user: docSnap.data() },
            });
          } else {
            setDoc(doc(db, "users", userf.uid), {
              uid: userf.uid,
              name: userf.displayName,
              dayOfbirth: "",
              gender: "",
              email: userf.email,
              isOnline: true,
              isChat: false,
              urlImage: userf.photoURL,
            })
              .then(() => {
                //success
                const loggedInUser = {
                  uid: userf.uid,
                  name: userf.displayName,
                  dayOfbirth: "",
                  gender: "",
                  email: userf.email,
                  isOnline: true,
                  isChat: false,
                  urlImage: userf.photoURL,
                };

                dispatch({
                  type: `${USER.USER_LOGIN}_SUCCESS`,
                  payload: { user: loggedInUser },
                });
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
      })
      .catch((error) => toast("An error occurred, please try again"));
  };
};

export const signup = (params) => {
  return async (dispatch) => {
    dispatch({ type: `${USER.USER_LOGIN}_REQUEST` });

    createUserWithEmailAndPassword(auth, params.email, params.password)
      .then((userCredential) => {
        toast("Register success!");
        const user = userCredential.user;
        const currentUser = auth.currentUser;
        const name = params.name;
        currentUser.displayName = name;
        setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: params.name,
          dayOfbirth: "",
          gender: "",
          isOnline: true,
          isChat: false,
        })
          .then(() => {
            const loggedInUser = {
              uid: user.uid,
              name: params.name,
              dayOfbirth: "",
              gender: "",
              isOnline: true,
              isChat: false,
            };
            dispatch({
              type: `${USER.USER_LOGIN}_SUCCESS`,
              payload: { user: loggedInUser },
            });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {});
  };
};
export const signin = (params) => {
  return async (dispatch) => {
    dispatch({ type: `${USER.USER_LOGIN}_REQUEST` });
    signInWithEmailAndPassword(auth, params.email, params.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        try {
          const userRef = doc(db, "users", user.uid);
          updateDoc(userRef, {
            isOnline: true,
          });
          onSnapshot(doc(db, "users", user.uid), (doc) => {
            const user = doc.data();
            const loggedInUser = {
              uid: user.uid,
              name: user.name,
              dayOfbirth: user.dayOfbirth,
              gender: user.gender,
              isOnline: user.isOnline,
              isChat: user.isChat,
              urlImage: user.urlImage,
            };
            dispatch({
              type: `${USER.USER_LOGIN}_SUCCESS`,
              payload: { user: loggedInUser },
            });
          });
        } catch (error) {
          toast("An error occurred, please try again");
          dispatch({
            type: `${USER.USER_LOGIN}_FAILURE`,
            payload: { error },
          });
        }
      })
      .catch((err) => {
        toast("Wrong data!");
      });
  };
};
export const logout = (params) => {
  return async (dispatch) => {
    dispatch({ type: `${USER.USER_LOGOUT}_REQUEST` });
    const userRef = doc(db, "users", params);
    updateDoc(userRef, {
      isOnline: false,
    }).then(() => {
      auth
        .signOut()
        .then(() => {
          localStorage.clear();
          dispatch({ type: `${USER.USER_LOGOUT}_SUCCESS` });
        })
        .catch((error) => {
          console.log(error);
          dispatch({
            type: `${USER.USER_LOGOUT}_FAILURE`,
            payload: { error },
          });
        });
    });
  };
};

export const updateInfo = (params) => {
  return async (dispatch) => {
    const userRef = doc(db, "users", params.uid);
    updateDoc(userRef, {
      name: params.name,
      dayOfbirth: params.dayOfbirth,
      gender: params.gender,
    })
      .then(() => {
        const userUpdate = {
          uid: params.uid,
          name: params.name,
          dayOfbirth: params.dayOfbirth,
          gender: params.gender,
          isOnline: true,
          isChat: false,
        };
        dispatch({
          type: `${USER.USER_UPDATE}_SUCCESS`,
          payload: { user: userUpdate },
        });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: `${USER.USER_UPDATE}_FAILURE`,
          payload: { error },
        });
      });
  };
};
