import os from 'os';
import fs from 'fs';
import path from 'path';
import { LogWatcher } from 'ed-logwatcher';

export default class JournalWatcher {
    constructor(tracker, directory) {
        this.tracker = tracker;
        this.directory = directory || path.join(
            os.homedir(),
            'Saved Games',
            'Frontier Developments',
            'Elite Dangerous'
        );
        this.watcher = new LogWatcher(this.directory, 3);
    }

    init() {
        console.log(`Initialising watcher for: ${this.directory}`);
        this.watcher.on('Started', () => {
            console.log('Started');
        });
        this.watcher.on('error', (err) => {
            this.watcher.stop();
            console.error(err.stack || err);
        });
        this.watcher.on('finished', () => {
            console.log('Finished');
            this.onDataLoad();
        });
        this.watcher.on('data', (obs) => {
            // console.log('Data: ');
            // console.log(obs);
            // console.log(obs.length);
            this.tracker.addLoadedEventsCount(obs.length);
            this.tracker.addRecentEvents(obs);
        });
    }

    onDataLoad() {
        document.getElementById('dataCount').innerText = this.tracker.getEventCount();
        document.getElementById('lastEvent').innerText = this.tracker.getLastEvent().event;
    }
}
