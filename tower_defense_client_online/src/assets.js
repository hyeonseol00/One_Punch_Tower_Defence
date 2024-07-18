let instance;

export default class GameAssets {
  constructor(data) {
    if (instance) {
      return instance;
    }
    this.gameAssets = data;
    instance = this;
  }

  getData() {
    return this.gameAssets;
  }

  setData(data) {
    this.gameAssets = data;
  }
}
