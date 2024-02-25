import { auth } from '../firebase';
import User from '../Model/User';

class UserService {
  constructor() {
    this.unsubscribe = null;
  }

  startListening(callback) {
    this.unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        callback(new User(user)); // Transform user data into User model
      } else {
        callback(null); // No user authenticated
      }
    });
  }

  stopListening() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
  
  export default UserService;