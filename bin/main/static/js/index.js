window.onload = function() {
    // setup datagrid
    $('#datagrid').w2grid({
        name: 'searchResult',
        header: 'Search Result',
        show: { 
            lineNumbers: true, 
            toolbar: true,
            footer: true
        },
        multiSearch: true,
        columns: [
            { field: 'threadTitle', text: 'Title', size: '10%', sortable: true},
            { field: 'postNum' , text: 'num'     , size: '3%' , sortable: true},
            { field: 'userId'  , text: 'UserID'  , size: '7%' , sortable: true},
            { field: 'date'    , text: 'Date'    , size: '13%', sortable: true},
            { field: 'userId'  , text: 'UserID'  , size: '7%' , sortable: true},
            { field: 'userName', text: 'UserName', size: '10%', sortable: true},
            { field: 'message' , text: 'Message' , size: '57%', sortable: true},
        ],
    });
    
    // form
    $('#urlForm').on("click", ".add", function() {
        $('#urlFormInput').clone(true).insertAfter($('#urlFormInput'));
    });
    $('#urlFormInput').on("click", ".del", function() {
        var target = $('#urlFormInput');
        if (target.parent().children().length > 2) {
            target.remove();
        }
    });
    
    $('#urlForm').on("click", ".sendUrl", function() {
        var urls = [];
        $('input.urlFormText').each(function (i, element) {
            urls.push(element.value);
        });
        var requestParam = {"urls": urls};

        $.ajax({
            type: "POST",
            url: "/scraping",
            data: JSON.stringify(requestParam),
            contentType: 'application/json',
        })
            .done(function (data) {
                $.each(data.records, function (i, element) {
                    element.recid = i;
                    data.records[i] = element;
                });
                w2ui['searchResult'].clear();
                w2ui['searchResult'].add(data.records);
            },
        );

    });
};

