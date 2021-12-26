import { PREFIX_IPADDRESS } from "./constants";

/**
 * 渲染模板字符串
 * 
 * @param template 模板字符串
 * @param object 模板变量对象
 * @returns 
 */
export function renderTemplate<T extends { [key: string]: any }>(template: string, object: T): string {

    return template.replace(/\{\s*([A-z0-9_]+)\s*\}/g, (_, key: string) => {

        return object[key];

    });

}

/**
 * 生成IPAddress链接
 * 
 * @param domain_name 需要处理的域名
 * @returns IPAddress链接
 */
export function makeIPAddressURL(domain_name: string) {

    const dot_count = domain_name.split(".").length - 1;

    if (dot_count > 1) {

        const raw_domain_parts = domain_name.split(".");
        const tmp_domain = raw_domain_parts.slice(-2).join(".");
        return `https://${tmp_domain}${PREFIX_IPADDRESS}/${domain_name}`;

    } else {

        return `https://${domain_name}${PREFIX_IPADDRESS}`;

    }

}

/**
 * 从字符串数组挑出出现最多的字符串
 * 
 * @param array 字符串数组
 * @returns 出现最多的元素
 */
export function mostCommon(array: string[]): string {

    const counts: { [key: string]: number } = {};

    for (const item of array) {
        if (counts[item]) {
            counts[item]++;
        } else {
            counts[item] = 1;
        }
    }

    let max_count = 0;
    let max_item = "";

    for (const item in counts) {
        if (counts[item] > max_count) {
            max_count = counts[item];
            max_item = item;
        }
    }

    return max_item;

}
