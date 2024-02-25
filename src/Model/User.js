export default class User {
  constructor(userData) {
    this.userData = userData;
  }

  get data() {
    return this.userData;
  }

  get uid() {
    return this.userData ? this.userData.uid : null;
  }
  
}