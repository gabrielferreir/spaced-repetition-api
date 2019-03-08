const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_WEEK = ONE_DAY * 7;
const ONE_MONTH = ONE_WEEK * 4;
const ONE_YEAR = ONE_MONTH * 12;

module.exports = {
    1: {
        time: 0
    },
    2: {
        time: ONE_MINUTE * 10
    },
    3: {
        time: ONE_MINUTE * 30
    },
    4: {
        time: ONE_HOUR * 2
    },
    6: {
        time: ONE_HOUR * 8
    },
    7: {
        time: ONE_DAY
    },
    8: {
        time: ONE_DAY * 3
    },
    9: {
        time: ONE_DAY * 7
    },
    10: {
        time: ONE_DAY * 15
    },
    11: {
        time: ONE_MONTH
    },
    12: {
        time: ONE_MONTH * 3
    },
    13: {
        time: ONE_MONTH * 6
    },
    14: {
        time: ONE_YEAR
    }
};