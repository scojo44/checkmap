import axios from "axios"

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 */

export default class CheckMapAPI {
  static userToken;

  static async request(endpoint, data = {}, method = "get") {
    const url = `${BASE_URL}/${endpoint}`;
    const headers = {Authorization: `Bearer ${this.userToken}`};
    const params = (method === "get")? data : {};

    try {
      return (await axios({url, method, data, params, headers})).data;
    }
    catch (err) {
      console.error("API Error:", err);
      const message = `${err.name}: ${err.message} - URL: ${err.config.url}`;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Login the user.
   * 
   * credentials: {username, password}
   */

  static async login(credentials) {
    const res = await this.request(`auth/token`, credentials, 'post');
    return res.token;
  }

  /** Register the new user.
   * 
   * newUser: {username, password, imageURL}
   */

  static async signup(newUser) {
    const res = await this.request(`auth/register`, newUser, 'post');
    return res.token;
  }

  /** Get details on a user by username. */

  static async getUser(username) {
    const res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Update the user profile.
   * 
   * newUser: {username, password, imageURL}
   */

  static async updateUser(user) {
    const {username, ...userInfo} = user;
    const res = await this.request(`users/${username}`, userInfo, 'patch');
    return res.user;
  }

  /** Get the user's lists. */

  static async getLists(username) {
    const res = await this.request(`users/${username}/lists`);
    return res.lists;
  }

  /** Get details on a list. */

  static async getList(listID) {
    const res = await this.request(`lists/${listID}`);
    return res.list;
  }

  /** Create a new list */

  static async createList(username, newList) {
    const res = await this.request(`users/${username}/lists`, newList, 'post');
    return res.list;
  }

  /** Update the list details */

  static async updateList(listID, updatedList) {
    const res = await this.request(`lists/${listID}`, updatedList, 'patch');
    return res.list;
  }

  /** Delete a list */

  static async deleteList(listID) {
    const res = await this.request(`lists/${listID}`, {}, 'delete');
    return res.deleted;
  }

  /** Add a region to a list */

  static async addRegion(listID, regionID) {
    const res = await this.request(`lists/${listID}/regions`, {regionID}, 'post');
    return res.added;
  }

  /** Delete a list */

  static async removeRegion(listID, regionID) {
    const res = await this.request(`lists/${listID}/regions/${regionID}`, {}, 'delete');
    return res.removed;
  }

  /** Get all the regions.  Accepts values for the RegionType enum on the backend */

  static async getRegions(type) {
    const res = await this.request(`regions`, {type});
    return res;
  }
}
