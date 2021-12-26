import { TEMPLATE_HOSTS } from "./constants";
import { HostsRaw } from "./interfaces";
import { renderTemplate } from "./utils";

export function generateHosts(hosts: HostsRaw) {
    const lines: string[] = [];
    for (const [ip, domain] of hosts) {
        const line = `${ip.padEnd(20, ' ')}${domain}`;
        lines.push(line);
    }
    const rendered = renderTemplate(TEMPLATE_HOSTS, {
        content: lines.join('\n'),
        updateTime: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
        repoURL: 'https://github.com/pboymt/Steam520'
    });
    return rendered;
}