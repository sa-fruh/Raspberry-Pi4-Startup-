import { hostname, NetworkInterfaceInfoIPv4, networkInterfaces } from 'os';
import Shell from "./Shell";
import Log from "./Log";

const log = new Log("../logs/machine.log");

export default class Machine {
    public readonly hostname: string;
    public readonly interface: NetworkInterfaceInfoIPv4;

    constructor(networkInterfaceName?: string) {
        const ipv4Interface = networkInterfaceName
            ? this.getIpv4Interface(networkInterfaceName)
            : this.getIpv4Interface();
        this.hostname = hostname();
        this.interface = ipv4Interface!!;
    }

    public async reboot(): Promise<void> {
        await log.write(`Rebooting ${this.hostname}`);
        await new Shell().run('sudo reboot');
    }

    private getIpv4Interface(interfaceName?: string): NetworkInterfaceInfoIPv4 | null {
        const interfaces = networkInterfaces();
        if (interfaceName && interfaces[interfaceName]) {
            for (const net of interfaces[interfaceName]!!) {
                if (net.family === 'IPv4' && !net.internal) {
                    return net;
                }
            }
            return null;
        }
        for (const name of Object.keys(interfaces)) {
            for (const net of interfaces[name]!!) {
                if (net.family === 'IPv4' && !net.internal) {
                    return net;
                }
            }
        }
        return null;
    }
}