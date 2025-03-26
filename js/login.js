$(document).ready(function(){

    let users=[
        {'userName':'admin1', 'pass':12345678},
        {'userName':'admin2', 'pass':12345678},
        {'userName':'sandy', 'pass':12345678},

    ]
    //localStorage.setItem('Users',JSON.stringify(users));


    async function hashPassword(pass) {
        const encoder = new TextEncoder();
        const data = encoder.encode(pass);
        console.log('data' + data)
        const hash = await crypto.subtle.digest('SHA-256',data);
        console.log( hash)
        let hashpass= Array.from(new Uint8Array(hash))
        .map(byte => byte.toString(16).padStart(2,'0'))
        .join('');
        //console.log(hashpass)
        return hashpass
    }
    //hashPassword('sandy123')
        async function storeHashedPasswords() {
            for (let user of users) {
                user.pass = await hashPassword(user.pass);
            }
            localStorage.setItem('Users', JSON.stringify(users));
        }
        storeHashedPasswords();

    $("#loginForm").submit(async function (event) {
        event.preventDefault(); 
    
    let userName = $('#userName').val().trim();
    let userPass =$('#password').val().trim();
    let hashedPassword = await hashPassword(userPass);


    console.log(userName, userPass)
    if(userName=== '' || userPass==='' ){
        alert('Please enter your pass and user name')
    }
    let storedUsers = JSON.parse(localStorage.getItem('Users')) || [];
    let user = storedUsers.find(u => u.userName === userName && u.pass == hashedPassword);
    //console.log(user)

    if (user) {
        $('#errorMessage').addClass('d-none');
        sessionStorage.setItem('User',JSON.stringify(user))
        window.location.href = "dashboard.html"; 
    } else {
        $('#errorMessage').removeClass('d-none');}
    })


    $('#togglePassword').on('click', function(){
        let input =$('#password');
        if(input.attr('type')=== 'password'){
            input.attr('type', 'text')
            $('#togglePassword i').removeClass('fa fa-eye').addClass('fa fa-eye-slash')
        }else{
            input.attr('type', 'password');
            $('#togglePassword i').removeClass('fa fa-eye-slash').addClass('fa fa-eye')

        }
    })








});