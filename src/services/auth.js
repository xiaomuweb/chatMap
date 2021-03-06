import firebase from 'firebase';
import _ from 'lodash';

export function signInWithEmailAndPassword(email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => ({ user }))
    .catch(() => {
      return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(user => {
          const name = _.split(email, '@', 2);
          firebase.database().ref(`/userInfo/${user.uid}`).update({
            userName: name[0],
            isOnline: 'ture'
          });
          return { user };
        })
        .catch((err) => ({ err }));
    });
}

export function signOut() {
  return firebase.auth().signOut();
}

export function getCurrentUser() {
  return firebase.auth();
}

export function updateLocation(region) {
  const { currentUser } = firebase.auth();
  const { latitude, longitude } = region;
  if (currentUser) {
    return firebase.database().ref(`/userInfo/${currentUser.uid}/latlon`).update(
      { latitude, longitude }
    );
  }
  return null;
}

export function getUser() {
  const { currentUser } = firebase.auth();
  const ref = firebase.database().ref(`/userInfo/${currentUser.uid}`);
  return new Promise((resolve) => {
   ref.once('value', snapshot => {
      const user = snapshot.val();
      resolve(user);
    });
  });
}
