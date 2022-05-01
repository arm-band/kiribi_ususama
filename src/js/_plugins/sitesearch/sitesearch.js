import List from 'list.js';

//サイト内検索
export default () => {
    if (
        typeof document.querySelector('#sitesearch') !== 'undefined'
         && document.querySelector('#sitesearch') !== null
    ) {
        const options = {
            valueNames: ['searchTitle', 'searchText'],
        };
        const searchList = new List('listSearch', options);
        //hits
        searchList.on('searchComplete', function (a) {
            document.querySelector('#hits').textContent = a.matchingItems.length;
        });
    }
};
