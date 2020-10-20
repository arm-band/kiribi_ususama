//サイト内検索
const siteSearch = () => {
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
