import { exec } from 'child_process';

export default class Shell {
    public updatedAt: Date;
    public lastCommand: string | undefined;

    constructor() {
        this.updatedAt = new Date();
    }

    public async run(command: string): Promise<string> {
        this.setLastCommand(command);
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(stdout);
                }
            });
        });
    }

    private setLastCommand(command: string): void {
        this.lastCommand = command;
        this.updatedAt = new Date();
    }
}