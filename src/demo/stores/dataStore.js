import { observable, computed } from 'mobx';

class DataStore {

    @observable title = 'TITLE HAHA ~~ !!!';

    @observable list = [];

    @computed get listCount() {
        return this.list.length;
    }

    inputTitle(title) {
        this.title = title;
    }

    add(data) {
        this.list.push(data);
    }

}

const dataStore = new DataStore();

export default dataStore;
