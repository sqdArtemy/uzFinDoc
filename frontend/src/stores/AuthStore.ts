import { makeAutoObservable } from "mobx";

interface IAuth {
  email?: string;
  password?: string;
  name?: string;
  surname?: string;
  phoneNumber?: string;
  accessToken?: string;
  refreshToken?: string;
}

class AuthStore {
  storeData: IAuth = {};

  constructor() {
    makeAutoObservable(this);
  }

  set data(data: IAuth) {
    this.storeData = data;
  }

  get data(): IAuth {
    return this.storeData;
  }
}

const authStore = new AuthStore();
export default authStore;
