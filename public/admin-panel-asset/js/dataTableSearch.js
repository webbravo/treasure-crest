/*-------------------------------------
      Search Table
-------------------------------------*/


var table = $('#studentList').DataTable();

// #myInput is a <input type="text"> element
$('#studentName').on('keyup', function () {
    table.search(this.value).draw();
});