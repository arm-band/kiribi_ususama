module.exports = {
    empty: (str) => {
        return Boolean(str);
    },
    text: (str) => {
        return str.match(/^.+$/);
    },
    alphabet: (str) => {
        return str.match(/^[a-zA-Z0-9\-_\.!~*\'\(\);\/?:\@&=+\$,%#]+$/);
    },
    year: (str) => {
        return str.match(/^20[\d]{2}$/); //20XX
    },
    numcode: (str) => {
        return str.match(/^[\d\-]+$/);
    },
    url: (str) => {
        return str.match(/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/);
    },
    color: (str) => {
        return str.match(/^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/);
    },
    checkbox: (flag) => {
        if(typeof flag !== undefined && typeof flag !== null) {
            return true;
        }
        return false;
    }
};