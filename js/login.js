$(document).ready(function(){

    let users=[
        {'userName':'admin1', 'pass':12345678},
        {'userName':'admin2', 'pass':12345678},
    ]
    localStorage.setItem('Users',JSON.stringify(users));

    $("#loginForm").submit(function (event) {
        event.preventDefault(); 
    
    let userName = $('#userName').val().trim();
    let userPass =$('#password').val().trim();

    console.log(userName, userPass)
    if(userName=== '' || userPass==='' ){
        alert('Please enter your pass and user name')
    }
    users= JSON.parse(localStorage.getItem('Users'));
    let user = users.find(u => u.userName === userName && u.pass == userPass);
    //console.log(user)

    if (user) {
        alert("loged in succsesfuly");
        $('#errorMessage').addClass('d-none');
        sessionStorage.setItem('User',JSON.stringify(user))
        window.location.href = "dashboard.html"; 
    } else {
        $('#errorMessage').removeClass('d-none');}
    })


    // $('#togglePassword').on('click', function(){
    //     $('#password').text()
    // })




});