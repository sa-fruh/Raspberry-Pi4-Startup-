import { writeFile, readdir } from 'fs';
import { join, normalize, dirname } from 'path';

export default class Log {
    public readonly createdAt: Date;
    public updatedAt: Date;
    public logFilePath: string;

    constructor(logFilePath: string) {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.logFilePath = normalize(join(__dirname, logFilePath));
    }

    private updateTimestamp(): void {
        this.updatedAt = new Date();
    }

    public getLogFiles(): Promise<string[]> {
        const dir = dirname(this.logFilePath);
        return new Promise((resolve, reject) => {
            readdir(dir, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files.map(file => join(dir, file)));
                }
            });
        });
    }

    public async write(message: string, type: string = 'LOG'): Promise<void> {
        this.updateTimestamp();
        const logMessage = `[ ${this.updatedAt.toLocaleString()} ] [ ${type.toUpperCase()} ] ${message}\n`;

        return new Promise((resolve, reject) => {
            writeFile(this.logFilePath, logMessage, {flag: 'a'}, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}