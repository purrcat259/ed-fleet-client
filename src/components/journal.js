import JournalTracker from './journal/journal-tracker';
import JournalWatcher from './journal/journal-watcher';
import JournalTransmitter from './journal/journal-transmitter';

export default class Journal {
    constructor(directory, url) {
        this.directory = directory;
        this.url = url;
        this.tracker = new JournalTracker();
        this.watcher = new JournalWatcher(this.tracker, this.directory);
        this.transmitter = new JournalTransmitter(this.url);
        this.init();
    }

    init() {
        let self = this;
        // Setup references to DOM elements
        self.dataCountEl = document.getElementById('dataCount');
        self.lastEventEl = document.getElementById('lastEvent');
        self.watcherStateEl = document.getElementById('watcherState');
        // Subscribe to watcher events
        self.watcher.on('update', () => {
            self.updateUI();
        });
        // TODO: Subscribe to transmission events
    }

    updateUI() {
        this.updateEvents();
    }

    updateEvents() {
        document.getElementById('dataCount').innerText = this.tracker.getEventCount();
        document.getElementById('lastEvent').innerText = this.tracker.getLastEvent().event;
    }

    startWatcher() {
        this.tracker.setWatcherState(true);
        this.updateWatcher();
        this.watcher.init();
    }

    stopWatcher() {
        this.tracker.setWatcherState(false);
        this.updateWatcher();
        this.watcher.stop();
    }

    // TODO: Move into updateUI?
    updateWatcher() {
        if (this.tracker.getWatcherState()) {
            this.watcherStateEl.classList.add('active');
            this.watcherStateEl.classList.remove('inactive');
            this.watcherStateEl.innerText = 'Active';
        } else {
            this.watcherStateEl.classList.add('inactive');
            this.watcherStateEl.classList.remove('active');
            this.watcherStateEl.innerText = 'Inactive';
        }
    }

    checkConnection() {
        return this.transmitter.checkLatency().then((response) => {
            console.log(response);
        }).catch((error) => {

        });
    }

    isActive() {
        return this.tracker.getWatcherState();
    }
}
