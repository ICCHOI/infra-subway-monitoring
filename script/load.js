import http from 'k6/http';
import { check, group, sleep, fail } from 'k6';

export let options = {
    stages: [
        { duration: '20s', target: 0 },
        { duration: '5m', target: 70 },
        { duration: '25m', target: 70 },
        { duration: '30m', target: 155 },
        { duration: '30m', target: 155 },
        { duration: '25m', target: 70 },
        { duration: '5m', target: 70 },
        { duration: '20s', target: 0 }
    ],

    thresholds: {
        http_req_duration: ['p(99)<1300'], // 99% of requests must complete below 0.1s
    },
};

const BASE_URL = 'https://infragongbang.kro.kr/';

function main() {
    let response = http.get(`${BASE_URL}`);

    check(response, { "load main page": (resp) => resp.status === 200 });
}

function path() {
    let response = http.get(`${BASE_URL}/path`);

    check(response, { "load path page ": (resp) => resp.status === 200 });
}

function find(params) {
    let response = http.get(`${BASE_URL}/path?source=1&target=5`, params);

    check(response, { "find path ": (resp) => resp.status === 200 });
}

export default function ()  {

    let params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    main();

    path();

    find(params);

    sleep(1);
};