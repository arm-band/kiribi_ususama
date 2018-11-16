module.exports = {
    checkbox: (flag) => {
        if(typeof flag !== undefined && typeof flag !== null) {
            if(flag === "true") {
                return true;
            }
        }
        return false;
    }
};