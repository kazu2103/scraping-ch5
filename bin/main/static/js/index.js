var gRecid = 0;

window.onload = function() {
    // setup datagrid
    $('#datagrid').w2grid({
        name: 'searchResult',
        header: 'Search Result',
        multiSearch: true,
        show: { 
            lineNumbers: true, 
            toolbar: true,
            footer: true
        },
        columns: [
            { field: 'threadTitle', text: 'Title'     , size: '10%', sortable: true},
            { field: 'postNum'    , text: 'Post'      , size: '3%' , sortable: true},
            { field: 'userId'     , text: 'UserID'    , size: '7%' , sortable: true},
            { field: 'date'       , text: 'Date'      , size: '13%', sortable: true},
            { field: 'userName'   , text: 'UserName'  , size: '10%', sortable: true},
            { field: 'message'    , text: 'Message'   , size: '40%', sortable: true},
            { field: 'backLinks'  , text: 'Back Link' , size: '10%', sortable: true},
            { field: 'threadNum'  , text: 'tnum'      , size: '0%'},
        ],
        toolbar: {
            items: [
                { type: 'break' },
                { type: 'check', id: 'threadTitle', text: 'Title'},
                { type: 'check', id: 'postNum'    , text: 'Post'},
                { type: 'check', id: 'userId'     , text: 'UserID'},
                { type: 'check', id: 'date'       , text: 'Date'},
                { type: 'check', id: 'userName'   , text: 'UserName'},
                { type: 'check', id: 'message'    , text: 'Message'},
                { type: 'check', id: 'backLinks'  , text: 'Back Link'},
            ],
            onClick: function (target, data) {
                console.log()
                w2ui['searchResult'].toggleColumn(target);
            }
        },

    });
    w2ui['searchResult'].hideColumn('threadNum');
    // form
    $('#urlForm').on("click", ".add", function() {
        $('#urlFormInput').clone(true).insertAfter($('#urlFormInput'));
    });
    $('#urlFormInput').on("click", ".del", function() {
        let target = $('#urlFormInput');
        if (target.parent().children().length > 2) {
            target.remove();
        }
    });
    
    $('#urlForm').on("click", ".sendUrl", function() {
        let urls = [];
        $('input.urlFormText').each(function (i, element) {
            urls.push(element.value);
        });
        let requestParam = {"urls": urls};

        $.ajax({
            type: "POST",
            url: "/scraping",
            data: JSON.stringify(requestParam),
            contentType: 'application/json',
        })
            .done(function (data) {
                gRecid = 0;
                $.each(data.records, function (i, element) {
                    gRecid++;
                    element.recid = i;
                    data.records[i] = element;
                });
                setAnchorLinks(data);
                w2ui['searchResult'].clear();
                w2ui['searchResult'].add(data.records);
            },
        );
    });
}

function setAnchorLinks(data){
    // メッセージ内のアンカーにリンク追加
    $.each(data.records, function (i, ei) {
        regex = /\>\>[1$-9]{1,3}($|\s)/g,
        anchors = ei.message.match(regex);
        if(anchors){
            $.each(anchors, function (j, ej) { 
                let linkNum = ej.trim().replace(">>", "");
                let cls = "a" + ei.recid + "_" + linkNum;
                // アンカーにonclickで参照元の行追加、onmouseoverで参照元のオーバレイ表示をするリンクを追加
                ei.message = ei.message.replace(ej, "<a href='#' class=" + cls + 
                " onclick='addRefRecord(" + ei.recid + ", " + ei.threadNum + ", " + linkNum + ")'" +
                " onmouseover='showRefRecord(\"" + cls + "\", " + ei.threadNum + ", " + linkNum + ")'>" + ej + "</a>");
            });
        }

    // バックリンクに追加
        if(ei.backLinks){
            $.each(ei.backLinks, function (j, ej) { 
                let cls = "b" + ei.recid + "_" + ej;
                // バックリンクにonclickで参照元の行追加、onmouseoverで参照元のオーバレイ表示をするリンクを追加
                ei.backLinks[j] = "<a href='#' class=" + cls + 
                    " onclick='addRefRecord(" + ei.recid + ", " + ei.threadNum + ", " + ej + ")'" +
                    " onmouseover='showRefRecord(\"" + cls + "\", " + ei.threadNum + ", " + ej + ")'>" + ej + "</a>";
            });
        }
    });
}

function addRefRecord(recid, threadNum, linkNum){
    let datagrid = w2ui['searchResult'].records;
    let source;
    $.each(datagrid, function (i, element) { 
        if (element['threadNum'] == threadNum && element['postNum'] == linkNum){
            source = Object.assign({}, element);
            source.recid = gRecid++;
        }
    });
    w2ui['searchResult'].set(
        w2ui['searchResult'].get(recid).w2ui = {children: [source]}
    );
    w2ui['searchResult'].expand(recid);
}

function showRefRecord(cls, threadNum, linkNum){
    let datagrid = w2ui['searchResult'].records;
    let source;
    $.each(datagrid, function (i, element) { 
        if (element['threadNum'] == threadNum && element['postNum'] == linkNum){
            source = Object.assign({}, element);
        }
    });
    $('.' + cls).w2overlay({
        openAbove: window.above,
        align: window.align,
        html: '<div style="padding: 10px; line-height: 150%">'+
            '    Date: ' + source.date + '<br>UserName: ' + source.userName + '<br>UserID: ' + source.userId + '<br>Message: ' + source.message +
            '</div>'
    });
}
