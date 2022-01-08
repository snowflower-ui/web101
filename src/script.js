$(document).ready(function () {
  var user = {};

  function register(e) {
    user.idnumber = document.getElementById("idnumber").value;
    user.firstname = document.getElementById("firstname").value;
    user.lastname = document.getElementById("lastname").value;
    user.gender = document.getElementById("gender").value;
    user.bday = document.getElementById("bday").value;
    user.program = document.getElementById("program").value;
    user.yearlevel = document.getElementById("yearlevel").value;
    console.log(user);

    $.ajax({
      type: "POST",
      data: { action: "register", userdata: user },
      url: "src/php/user.php",
      success: function (response) {
        idresponse = jQuery.parseJSON(response);
        var table = $("#usertable tbody");
        if (idresponse == 0) {
          alert("Error saving the user!");
        } else {
          user.id = idresponse;
          appendUser(user, table);
        }
        $("#userForm").find("input, select").val("");
      },
    });

    e.preventDefault();
  }

  function getUsers() {
    $.ajax({
      type: "GET",
      data: { action: "getusers" },
      url: "src/php/user.php",
      success: function (response) {
        users = jQuery.parseJSON(response);
        var table = $("#usertable tbody");
        for (var i = 0; i < users.length; i++) {
          appendUser(users[i], table);
        }
      },
    });
  }

  function appendUser(user, table) {
    row =
      `<tr id="${user.id}">` +
      '<th scope="row">' +
      user.id +
      "</th>" +
      "<td data-target='idnumber'>" +
      user.idnumber +
      "</td>" +
      "<td data-target='firstname'>" +
      user.firstname +
      "</td>" +
      "<td data-target='lastname'>" +
      user.lastname +
      "</td>" +
      "<td data-target='gender'>" +
      user.gender +
      "</td>" +
      "<td data-target='bday'>" +
      user.bday +
      "</td>" +
      "<td data-target='program'>" +
      user.program +
      "</td>" +
      "<td data-target='yearlevel'>" +
      user.yearlevel +
      "</td>" +
      "<td>" +
      `<button type="button" id="delete-user-${user.id}" class="btn btn-danger">delete</button>` +
      "</td>" +
      "<td>" +
      `<a href="#" id="update-user" data-role="update" data-id="${user.id}" class="btn btn-warning">update</a>` +
      "</td>" +
      "</tr>";

    table.append(row);

    $("#delete-user-" + user.id).click(function (e) {
      const btn = this;
      deleteUser(user.id);
    })
  }

  function deleteUser(userId) {
    $.ajax({
      type: "POST",
      data: { action: "deleteuser", userId: userId },
      url: "src/php/user.php",
      success: function (response) {
        console.log(response);
        $(`#${userId}`).remove();
      },
    });

    console.log("hello");
  }

  function updateUser(e) {
      var user = {};
      user.id = $('#userId').val();
      user.idnumber = $('#m-idnumber').val();
      user.firstname = $('#m-firstname').val();
      user.lastname = $('#m-lastname').val();
      user.gender = $('#m-gender').val();
      user.bday = $('#m-bday').val();
      user.program = $('#m-program').val();
      user.yearlevel = $('#m-yearlevel').val();
    
      $.ajax({
          type: 'POST',
          data: { action: "update_user", userdata : user },
          url: "src/php/user.php",
          success: function (response) {
              console.log(response);
              if (response == 0) {
                alert("Error saving the user!");
              }
              $('#'+user.id).children('td[data-target=idnumber]').text(user.idnumber);
              $('#'+user.id).children('td[data-target=firstname]').text(user.firstname);
              $('#'+user.id).children('td[data-target=lastname]').text(user.lastname);
              $('#'+user.id).children('td[data-target=gender]').text(user.gender);
              $('#'+user.id).children('td[data-target=bday]').text(user.bday);
              $('#'+user.id).children('td[data-target=program]').text(user.program);
              $('#'+user.id).children('td[data-target=yearlevel]').text(user.yearlevel); 
              $('#myModal').modal('toggle');

          },
      });
      //location.reload(true);
  }
  
  $(document).on('click', 'a[data-role=update]', function () {
      var id = $(this).data('id');
      var idnumber = $('#'+id).children('td[data-target=idnumber]').text();
      var firstname = $('#'+id).children('td[data-target=firstname]').text();
      var lastname = $('#'+id).children('td[data-target=lastname]').text();
      var gender = $('#'+id).children('td[data-target=gender]').text();
      var bday = $('#'+id).children('td[data-target=bday]').text();
      var program = $('#'+id).children('td[data-target=program]').text();
      var yearlevel = $('#'+id).children('td[data-target=yearlevel]').text();

      $('#m-idnumber').val(idnumber);
      $('#m-firstname').val(firstname);
      $('#m-lastname').val(lastname);
      $('#m-gender').val(gender);
      $('#m-bday').val(bday);
      $('#m-program').val(program);
      $('#m-yearlevel').val(yearlevel);
      $('#userId').val(id);
      $('#myModal').modal('toggle');
  });

  $('#save').click(updateUser);

  $("#userForm").submit(register);
  getUsers();
  
});
