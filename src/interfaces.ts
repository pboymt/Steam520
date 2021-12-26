export interface IDomainList {
    [key: string]: string[];
}

export type HostsTuple = [string, string];
export type HostsRaw = HostsTuple[];

export interface Hosts {
    [key: string]: string;
}