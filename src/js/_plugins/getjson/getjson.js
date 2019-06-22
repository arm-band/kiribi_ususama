const getJsonFunc = (jsonFile, procFunc, doneFunc, failFunc) => {
    $.getJSON(
        jsonFile,
        { ts: new Date().getTime() },
        procFunc(data)
    ).done(
        doneFunc(data, status, xhr)
    ).fail(
        failFunc(xhr, status, error)
    )
}