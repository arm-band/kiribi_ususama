import $ from 'jquery';
import List from 'list.js';

//サイト内検索
export default () => {
    if ($('#sitesearch').length) {
        const options = {
            valueNames: ['searchTitle', 'searchText'],
        };
        const searchList = new List('listSearch', options);
        //hits
        searchList.on('searchComplete', function (a) {
            $('#hits').text(a.matchingItems.length);
        });
    }
};
