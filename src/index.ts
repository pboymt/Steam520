import Axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import { readFile, writeFile } from 'fs/promises';
import { setTimeout } from 'timers/promises';
import { PREFIX_IPADDRESS, DomainList, REGEX_IP } from './constants';
import { generateHosts } from './hosts';
import { HostsRaw } from './interfaces';
import { makeIPAddressURL, mostCommon, renderTemplate } from './utils';

(async () => {

    const axios = Axios.create({
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
        }
    });

    axiosRetry(axios, {
        retries: 5,
        retryDelay: () => 2000,
    });

    const hosts: HostsRaw = [];

    for (const section in DomainList) {
        if (Object.prototype.hasOwnProperty.call(DomainList, section)) {
            const section_list = DomainList[section];
            for (const domain_name of section_list) {
                const ipaddress_url = makeIPAddressURL(domain_name);
                console.log(ipaddress_url);
                try {
                    const response = await axios.get<string>(ipaddress_url, { timeout: 5000 });
                    const html = response.data.trim();
                    const match_iter = html.matchAll(REGEX_IP);
                    const ips = Array.from(match_iter).map((match) => {
                        return match[0];
                    });
                    const ip = mostCommon(ips);
                    hosts.push([ip, domain_name]);
                } catch (error: unknown) {
                    console.log((error as AxiosError)?.code ?? error);
                }
            }
        }
    }

    const hosts_str = generateHosts(hosts);

    await writeFile('./hosts', hosts_str);
    await writeFile('./hosts.json', JSON.stringify(hosts));

    const readme_str = await readFile('./README.template.md', 'utf8');
    await writeFile('./README.md', renderTemplate(readme_str, {
        hosts: hosts_str
    }));

})();

