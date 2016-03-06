var rootURL = "http://localhost:8080/TstWS/webresources/com.juhnowski.personentity";

var currentPerson;

findAll();

$('#btnDelete').hide();

$('#btnSearch').click(function () {
    search();
    return false;
});


$('#btnAdd').click(function () {
    newPerson();
    return false;
});

$('#btnSave').click(function () {
    if ($('#personId').val() == '') {
        addPerson();

    } else
        updatePerson();
    return false;
});

$('#btnDelete').click(function () {
    deletePerson();
    return false;
});

$('#personList').click(function () {
        console.log('click');
    findById($(this).data('id'));

});

function search() {
    findAll();
}

function newPerson() {
    $('#btnDelete').hide();
    currentPerson = {};
    renderDetails(currentPerson);
}

function findAll() {
    console.log('findAll');
    $.ajax({
        type: 'GET',
        url: rootURL,
        dataType: "json", // data type of response
        success: renderList
    });
}

function findById(id) {
    console.log('findById: ' + id);
    $.ajax({
        type: 'GET',
        url: rootURL + '/' + id,
        dataType: "json",
        success: function (data) {
            $('#btnDelete').show();
            console.log('findById success: ' + data.fio);
            currentPerson = data;
            renderDetails(currentPerson);
        }
    });
}

function addPerson() {
    console.log('addPerson');
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: rootURL,
        dataType: "json",
        data: formToJSON(),
        success: function (data, textStatus, jqXHR) {
            alert('Person created successfully');
            $('#btnDelete').show();
            //$('#personId').val(data.id);
            findAll();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('addPerson error: ' + textStatus);
        }
    });
}

function updatePerson() {
    console.log('updatePerson');
    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        url: rootURL +"/"+ $('#personId').val(),
        dataType: "json",
        data: formToJSON(),
        success: function (data, textStatus, jqXHR) {
            alert('Person updated successfully');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('updatePerson error: ' + textStatus);
        }
    });
}

function deletePerson() {
    console.log('deletePerson');
    $.ajax({
        type: 'DELETE',
        url: rootURL + '/' + $('#personId').val(),
        success: function (data, textStatus, jqXHR) {
            alert('Person deleted successfully');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('deletePerson error');
        }
    });
}

function renderList(data) {
    var list = data === null ? [] : (data instanceof Array ? data : [data]);

    $('#personList li').remove();
    $.each(list, function (index, person) {
        $('#personList').append('<li><a onclick="findById(' + person.id + ')" href="#" data-id="' + person.id + '">' + person.fio + '(' + person.bdate + ')' + '</a></li>');
    });
}

function renderDetails(person) {
    $('#personId').val(person.id);
    $('#fio').val(person.fio);
}

function formToJSON() {
    var personId = $('#personId').val();
    return JSON.stringify({
        "id": personId === "" ? null : personId,
        "fio": $('#fio').val(),
        "bdate": $('#bdate').val()
    });
}
